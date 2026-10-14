from io import BytesIO

from db import get_db

ADMIN = {
    "full_name": "Ada Admin",
    "organisation_name": "Acme Retail",
    "email": "ada@example.com",
    "password": "AdminPassword123!",
}
VIEWER = {
    "full_name": "Vic Viewer",
    "email": "vic@example.com",
    "password": "ViewerPassword123!",
}


def _login(client, account):
    response = client.post(
        "/api/login",
        json={"email": account["email"], "password": account["password"]},
    )
    session = response.get_json()
    return session["user"], {"Authorization": "Bearer " + session["access_token"]}


def test_admin_adds_a_viewer_who_cannot_perform_admin_actions(client):
    assert client.post("/api/signup", json=ADMIN).status_code == 201
    admin, admin_headers = _login(client, ADMIN)
    assert admin["role"] == "ADMIN"

    added = client.post("/api/members", json=VIEWER, headers=admin_headers)
    assert added.status_code == 201
    viewer, viewer_headers = _login(client, VIEWER)
    assert viewer["role"] == "VIEWER"
    assert viewer["organisation_name"] == "Acme Retail"

    members = client.get("/api/members", headers=admin_headers).get_json()["members"]
    assert [member["role"] for member in members] == ["ADMIN", "VIEWER"]

    upload = {"file": (BytesIO(b"order_id\n1\n"), "sales.csv")}
    denied = [
        client.post("/api/analysis/uploads", data=upload, headers=viewer_headers),
        client.post("/api/members", json=VIEWER, headers=viewer_headers),
        client.get("/api/members", headers=viewer_headers),
    ]
    assert [response.status_code for response in denied] == [403, 403, 403]
    assert client.get("/api/analysis/uploads", headers=viewer_headers).status_code == 200


def test_account_created_before_workspaces_is_admin_of_its_own(client):
    assert client.post("/api/signup", json=ADMIN).status_code == 201
    get_db().users.update_one(
        {"email": ADMIN["email"]},
        {"$unset": {"organisation_id": ""}, "$set": {"role": "VIEWER"}},
    )

    user, headers = _login(client, ADMIN)

    assert user["role"] == "ADMIN"
    assert client.get("/api/members", headers=headers).status_code == 200
