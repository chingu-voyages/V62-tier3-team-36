import os
from unittest.mock import patch

import mongomock
import pytest

# Prevent importing app.py from resolving or connecting to the real Atlas URI.
os.environ["MONGO_URI"] = "mongodb://localhost"
os.environ["MONGO_DB_NAME"] = "password_reset_tests"
os.environ["RESEND_API_KEY"] = "re_test_key"
os.environ["SECRET_KEY"] = "test-import-secret-key-that-is-longer-than-32-bytes"

from app import create_app
from db import get_db


class TestConfig:
    TESTING = True
    SECRET_KEY = "test-secret-key-that-is-longer-than-32-bytes"
    MONGO_URI = "mongodb://localhost"
    MONGO_DB_NAME = "password_reset_tests"
    MONGO_CLIENT_CLASS = mongomock.MongoClient
    FRONTEND_URL = "http://localhost:3000"
    RESEND_API_KEY = "re_test_key"
    RESEND_FROM_EMAIL = "Sales Dashboard <onboarding@resend.dev>"
    RESET_TOKEN_TTL_MINUTES = 60
    RESET_REQUEST_COOLDOWN_SECONDS = 60
    PASSWORD_RESET_SYNCHRONOUS = True


@pytest.fixture()
def app():
    application = create_app(TestConfig)
    with application.app_context():
        database = get_db()
        database.users.create_index("email", unique=True)
        database.password_reset_tokens.create_index("token_hash", unique=True)
        yield application
        application.extensions["mongo_client"].drop_database(TestConfig.MONGO_DB_NAME)


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def registered_user(client):
    payload = {
        "full_name": "Reset Test User",
        "organisation_name": "Test Organisation",
        "email": "reset.user@example.com",
        "password": "OldPassword123!",
    }
    response = client.post("/api/signup", json=payload)
    assert response.status_code == 201
    return payload


@pytest.fixture()
def mocked_email():
    with patch("controllers.user_controller.send_password_reset_email") as sender:
        yield sender
