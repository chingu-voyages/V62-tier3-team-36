from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta, timezone
from unittest.mock import Mock
from urllib.parse import parse_qs, urlparse

from db import get_db
from init_db import _create_indexes


GENERIC_MESSAGE = {
    "message": (
        "If an account with that email exists, password reset instructions "
        "have been sent."
    )
}


def _request_token(client, mocked_email, email="reset.user@example.com"):
    response = client.post("/api/forgot_password", json={"email": email})
    assert response.status_code == 202
    reset_url = mocked_email.call_args.args[1]
    return parse_qs(urlparse(reset_url).query)["token"][0]


def test_forgot_password_hides_account_existence(
    app, client, registered_user, mocked_email
):
    existing = client.post(
        "/api/forgot_password", json={"email": registered_user["email"]}
    )
    unknown = client.post(
        "/api/forgot_password", json={"email": "unknown@example.com"}
    )

    assert existing.status_code == unknown.status_code == 202
    assert existing.get_json() == unknown.get_json() == GENERIC_MESSAGE
    assert "token" not in existing.get_json()
    mocked_email.assert_called_once()

    token = parse_qs(urlparse(mocked_email.call_args.args[1]).query)["token"][0]
    with app.app_context():
        record = get_db().password_reset_tokens.find_one()
        assert record["token_hash"] != token
        assert "token" not in record


def test_complete_password_reset_flow(client, registered_user, mocked_email):
    initial_login = client.post(
        "/api/login",
        json={"email": registered_user["email"], "password": "OldPassword123!"},
    )
    old_access_token = initial_login.get_json()["access_token"]
    old_refresh_token = initial_login.get_json()["refresh_token"]
    token = _request_token(client, mocked_email)

    reset = client.post(
        "/api/reset_password",
        json={"token": token, "password": "NewPassword123!"},
    )
    old_login = client.post(
        "/api/login",
        json={"email": registered_user["email"], "password": "OldPassword123!"},
    )
    new_login = client.post(
        "/api/login",
        json={"email": registered_user["email"], "password": "NewPassword123!"},
    )
    reused = client.post(
        "/api/reset_password",
        json={"token": token, "password": "AnotherPassword123!"},
    )
    old_access = client.get(
        "/api/me", headers={"Authorization": f"Bearer {old_access_token}"}
    )
    old_refresh = client.post(
        "/api/refresh", json={"refresh_token": old_refresh_token}
    )

    assert reset.status_code == 200
    assert old_login.status_code == 401
    assert new_login.status_code == 200
    assert reused.status_code == 400
    assert old_access.status_code == 401
    assert old_refresh.status_code == 401


def test_expired_token_is_rejected(app, client, registered_user, mocked_email):
    token = _request_token(client, mocked_email)
    with app.app_context():
        get_db().password_reset_tokens.update_one(
            {}, {"$set": {"expires_at": datetime.now(timezone.utc) - timedelta(seconds=1)}}
        )

    response = client.post(
        "/api/reset_password",
        json={"token": token, "password": "NewPassword123!"},
    )

    assert response.status_code == 400
    assert response.get_json() == {"error": "Invalid or expired password reset token"}


def test_reset_validation(client):
    invalid_email = client.post("/api/forgot_password", json={"email": "not-an-email"})
    missing_token = client.post(
        "/api/reset_password", json={"password": "NewPassword123!"}
    )
    weak_password = client.post(
        "/api/reset_password", json={"token": "x" * 43, "password": "short"}
    )

    assert invalid_email.status_code == 422
    assert missing_token.status_code == 422
    assert weak_password.status_code == 422


def test_email_failure_does_not_leak_account(
    client, registered_user, mocked_email
):
    mocked_email.side_effect = RuntimeError("Resend unavailable")

    response = client.post(
        "/api/forgot_password", json={"email": registered_user["email"]}
    )

    assert response.status_code == 202
    assert response.get_json() == GENERIC_MESSAGE
    assert "token" not in response.get_json()


def test_password_reset_work_is_queued_before_account_lookup(app, registered_user):
    executor = Mock()
    app.config["PASSWORD_RESET_SYNCHRONOUS"] = False
    app.extensions["password_reset_executor"] = executor

    with app.test_client() as queued_client:
        existing = queued_client.post(
            "/api/forgot_password", json={"email": registered_user["email"]}
        )
        unknown = queued_client.post(
            "/api/forgot_password", json={"email": "unknown@example.com"}
        )

    assert existing.status_code == unknown.status_code == 202
    assert existing.get_json() == unknown.get_json() == GENERIC_MESSAGE
    assert executor.submit.call_count == 2


def test_duplicate_request_respects_cooldown(client, registered_user, mocked_email):
    first = client.post(
        "/api/forgot_password", json={"email": registered_user["email"]}
    )
    second = client.post(
        "/api/forgot_password", json={"email": registered_user["email"]}
    )

    assert first.status_code == second.status_code == 202
    assert first.get_json() == second.get_json() == GENERIC_MESSAGE
    mocked_email.assert_called_once()


def test_concurrent_requests_issue_only_one_token(app, registered_user, mocked_email):
    def request_reset():
        with app.test_client() as thread_client:
            return thread_client.post(
                "/api/forgot_password", json={"email": registered_user["email"]}
            )

    with ThreadPoolExecutor(max_workers=4) as executor:
        responses = list(executor.map(lambda _: request_reset(), range(4)))

    assert all(response.status_code == 202 for response in responses)
    assert mocked_email.call_count == 1

    with app.app_context():
        assert get_db().password_reset_tokens.count_documents({}) == 1


def test_signup_rejects_caller_assigned_admin_role(client):
    response = client.post(
        "/api/signup",
        json={
            "full_name": "Unauthorized Admin",
            "organisation_name": "Test Organisation",
            "email": "admin-request@example.com",
            "password": "Password123!",
            "role": "ADMIN",
        },
    )

    assert response.status_code == 422
    assert "role" in response.get_json()["details"]


def test_password_reset_indexes_are_created(app):
    with app.app_context():
        database = get_db()
        _create_indexes(database)
        indexes = database.password_reset_tokens.index_information().values()
        lock_indexes = database.password_reset_locks.index_information().values()

    assert any(index.get("unique") for index in indexes)
    assert any(index.get("expireAfterSeconds") == 0 for index in indexes)
    assert any(index.get("expireAfterSeconds") == 0 for index in lock_indexes)
