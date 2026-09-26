"""Authentication and password-reset logic backed by MongoDB."""
import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from urllib.parse import urlencode

import jwt
from bson import ObjectId
from flask import current_app
from pymongo import ReturnDocument
from pymongo.errors import DuplicateKeyError
from werkzeug.security import check_password_hash, generate_password_hash

from db import get_db
from services.email_service import send_password_reset_email

PASSWORD_RESET_RESPONSE = {
    "message": (
        "If an account with that email exists, password reset instructions "
        "have been sent."
    )
}
INVALID_RESET_TOKEN_RESPONSE = {"error": "Invalid or expired password reset token"}


def create_user(full_name, organisation_name, email, password):
    """Create a MongoDB user with a one-way password hash."""
    user = {
        "full_name": full_name.strip(),
        "organisation_name": organisation_name.strip(),
        "email": email.strip().lower(),
        "password_hash": generate_password_hash(password),
        "role": "VIEWER",
        "session_version": 0,
        "created_at": datetime.now(timezone.utc),
    }
    try:
        result = get_db().users.insert_one(user)
    except DuplicateKeyError:
        return {"error": "Email already registered"}, 409

    return {
        "message": "User created",
        "user": {
            "id": str(result.inserted_id),
            "full_name": user["full_name"],
            "organisation_name": user["organisation_name"],
            "email": user["email"],
            "role": user["role"],
            "created_at": user["created_at"].isoformat(),
        },
    }, 201


def _user_payload(user):
    return {
        "id": str(user["_id"]),
        "full_name": user["full_name"],
        "organisation_name": user["organisation_name"],
        "email": user["email"],
        "role": user["role"],
    }


def _create_session_token(user, token_type, expires_in):
    now = datetime.now(timezone.utc)
    return jwt.encode(
        {
            "sub": str(user["_id"]),
            "type": token_type,
            "sv": user.get("session_version", 0),
            "iat": now,
            "exp": now + expires_in,
        },
        current_app.config["SECRET_KEY"],
        algorithm="HS256",
    )


def _session_payload(user):
    return {
        "access_token": _create_session_token(user, "access", timedelta(hours=1)),
        "refresh_token": _create_session_token(user, "refresh", timedelta(days=30)),
        "user": _user_payload(user),
    }


def login_user(email, password):
    """Return a session while using a generic 401 to prevent enumeration."""
    email = (email or "").strip().lower()
    if not email or not password:
        return {"error": "Email and password are required"}, 422
    user = get_db().users.find_one({"email": email})
    if not user or not check_password_hash(user["password_hash"], password):
        return {"error": "Invalid credentials"}, 401
    return _session_payload(user), 200


def logout_user(_token):
    """JWT logout is handled client-side by discarding the token."""
    return {"message": "Logged out"}, 200


def refresh_session(refresh_token):
    if not refresh_token:
        return {"error": "refresh_token is required"}, 422
    try:
        claims = jwt.decode(
            refresh_token,
            current_app.config["SECRET_KEY"],
            algorithms=["HS256"],
        )
        if claims.get("type") != "refresh":
            raise jwt.InvalidTokenError
        user = get_db().users.find_one({"_id": ObjectId(claims["sub"])})
    except (jwt.InvalidTokenError, TypeError, ValueError):
        return {"error": "Session expired"}, 401
    if user is None:
        return {"error": "Session expired"}, 401
    if claims.get("sv", 0) != user.get("session_version", 0):
        return {"error": "Session expired"}, 401
    return _session_payload(user), 200


def get_profile(user_id):
    try:
        user = get_db().users.find_one({"_id": ObjectId(user_id)})
    except (TypeError, ValueError):
        user = None
    if user is None:
        return {"error": "Workspace not assigned"}, 403
    return _user_payload(user), 200


def _hash_reset_token(token):
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def _process_password_reset(email):
    """Create and deliver a reset token inside a non-request worker."""
    database = get_db()
    user = database.users.find_one({"email": email})
    if user is None:
        return

    now = datetime.now(timezone.utc)
    cooldown = timedelta(
        seconds=current_app.config["RESET_REQUEST_COOLDOWN_SECONDS"]
    )
    token = secrets.token_urlsafe(32)
    expires_at = now + timedelta(
        minutes=current_app.config["RESET_TOKEN_TTL_MINUTES"]
    )

    # Claim the per-user cooldown atomically. The lock document uses the user id
    # as its MongoDB _id, so concurrent upserts cannot both succeed.
    try:
        database.password_reset_locks.find_one_and_update(
            {
                "_id": user["_id"],
                "$or": [
                    {"requested_at": {"$lt": now - cooldown}},
                    {"requested_at": {"$exists": False}},
                ],
            },
            {"$set": {"requested_at": now, "expires_at": now + cooldown}},
            upsert=True,
            return_document=ReturnDocument.AFTER,
        )
    except DuplicateKeyError:
        return

    token_record = {
        "user_id": user["_id"],
        "token_hash": _hash_reset_token(token),
        "created_at": now,
        "expires_at": expires_at,
    }

    database.password_reset_tokens.delete_many({"user_id": user["_id"]})
    database.password_reset_tokens.insert_one(token_record)

    query = urlencode({"token": token})
    reset_url = f'{current_app.config["FRONTEND_URL"]}/ResetPassword?{query}'
    try:
        send_password_reset_email(user["email"], reset_url)
    except Exception:
        current_app.logger.exception("Failed to send password reset email")


def _run_password_reset_job(app, email):
    with app.app_context():
        _process_password_reset(email)


def request_password_reset(email):
    """Queue reset work and immediately return the same response for every email."""
    app = current_app._get_current_object()
    normalized_email = email.strip().lower()

    try:
        if app.config.get("PASSWORD_RESET_SYNCHRONOUS", False):
            _process_password_reset(normalized_email)
        else:
            app.extensions["password_reset_executor"].submit(
                _run_password_reset_job, app, normalized_email
            )
    except Exception:
        app.logger.exception("Failed to queue password reset request")

    return PASSWORD_RESET_RESPONSE.copy(), 202


def reset_user_password(token, password):
    """Consume a valid token once, replace the hash, and invalidate reset links."""
    database = get_db()
    now = datetime.now(timezone.utc)
    reset_record = database.password_reset_tokens.find_one_and_update(
        {
            "token_hash": _hash_reset_token(token),
            "expires_at": {"$gt": now},
            "used_at": {"$exists": False},
        },
        {"$set": {"used_at": now}},
        return_document=ReturnDocument.AFTER,
    )
    if reset_record is None:
        return INVALID_RESET_TOKEN_RESPONSE.copy(), 400

    result = database.users.update_one(
        {"_id": reset_record["user_id"]},
        {
            "$set": {
                "password_hash": generate_password_hash(password),
                "password_changed_at": now,
            },
            "$inc": {"session_version": 1},
        },
    )
    if result.matched_count != 1:
        return INVALID_RESET_TOKEN_RESPONSE.copy(), 400

    database.password_reset_tokens.delete_many({"user_id": reset_record["user_id"]})
    return {
        "message": "Password has been reset successfully. You can now log in."
    }, 200
