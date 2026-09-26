"""Authentication guard for application JWTs."""
from functools import wraps

import jwt
from bson import ObjectId
from flask import current_app, g, jsonify, request

from db import get_db


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
        return fn(*args, **kwargs)

    return wrapper
