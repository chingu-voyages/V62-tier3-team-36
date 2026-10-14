"""Authentication guard for application JWTs."""
from functools import wraps

import jwt
from bson import ObjectId
from flask import current_app, g, jsonify, request

from controllers.user_controller import workspace_of
from db import get_db

"""Auth guard: verifies application JWTs, attaches user to `flask.g`."""
from functools import wraps

import jwt
from flask import current_app, g, jsonify, request


def _decode(token):
    return jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])


def get_bearer_token():
    header = request.headers.get("Authorization", "")
    scheme, _, token = header.partition(" ")
    if scheme.lower() != "bearer" or not token.strip():
        return None
    return token.strip()


def require_auth(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        token = get_bearer_token()
        if not token:
            return jsonify({"error": "Unauthorized"}), 401
        try:
            claims = _decode(token)
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Session expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Unauthorized"}), 401
        if claims.get("type") != "access":
            return jsonify({"error": "Unauthorized"}), 401

        user_id = claims.get("sub")
        try:
            user = get_db().users.find_one({"_id": ObjectId(user_id)})
        except (TypeError, ValueError):
            user = None
        if user is None or claims.get("sv", 0) != user.get("session_version", 0):
            return jsonify({"error": "Session expired"}), 401

        g.user_id = user_id
        g.token = token
        g.user = user
        g.organisation_id, g.role = workspace_of(user)
        g.user_id = claims.get("sub")
        g.token = token
        if not g.user_id:
            return jsonify({"error": "Unauthorized"}), 401
        return fn(*args, **kwargs)

    return wrapper


def require_admin(fn):
    """Authenticate, then reject anyone who is not the Admin of their workspace."""

    @wraps(fn)
    @require_auth
    def wrapper(*args, **kwargs):
        if g.role != "ADMIN":
            return jsonify({"error": "Admin access required"}), 403
        return fn(*args, **kwargs)

    return wrapper
