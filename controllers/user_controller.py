"""Authentication logic backed by MongoDB."""
from datetime import datetime, timedelta, timezone

import jwt
from pymongo.errors import DuplicateKeyError
from bson import ObjectId
from flask import current_app
from werkzeug.security import check_password_hash, generate_password_hash

from db import get_db


def create_user(full_name, organisation_name, email, password, role):
    """Create a MongoDB user with a one-way password hash."""
    user = {
        "full_name": full_name.strip(),
        "organisation_name": organisation_name.strip(),
        "email": email.strip().lower(),
        "password_hash": generate_password_hash(password),
        "role": role,
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


def _create_token(user_id, token_type, expires_in):
    now = datetime.now(timezone.utc)
    return jwt.encode(
        {"sub": str(user_id), "type": token_type, "iat": now, "exp": now + expires_in},
        current_app.config["SECRET_KEY"],
        algorithm="HS256",
    )


def _session_payload(user):
    return {
        "access_token": _create_token(user["_id"], "access", timedelta(hours=1)),
        "refresh_token": _create_token(user["_id"], "refresh", timedelta(days=30)),
        "user": _user_payload(user),
    }


def login_user(email, password):
    """Returns (payload, status). Generic 401 to avoid user enumeration."""
    email = (email or "").strip().lower()
    if not email or not password:
        return {"error": "Email and password are required"}, 422
    user = get_db().users.find_one({"email": email})
    if not user or not check_password_hash(user["password_hash"], password):
        return {"error": "Invalid credentials"}, 401
    return _session_payload(user), 200


def logout_user(token):
    """JWT logout is handled client-side by discarding the token."""
    return {"message": "Logged out"}, 200


def refresh_session(refresh_token):
    if not refresh_token:
        return {"error": "refresh_token is required"}, 422
    try:
        claims = jwt.decode(refresh_token, current_app.config["SECRET_KEY"], algorithms=["HS256"])
        if claims.get("type") != "refresh":
            raise jwt.InvalidTokenError
        user = get_db().users.find_one({"_id": ObjectId(claims["sub"])})
    except (jwt.InvalidTokenError, TypeError, ValueError):
        return {"error": "Session expired"}, 401
    if user is None:
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
