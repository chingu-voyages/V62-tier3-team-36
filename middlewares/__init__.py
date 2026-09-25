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
        g.user_id = claims.get("sub")
        g.token = token
        if not g.user_id:
            return jsonify({"error": "Unauthorized"}), 401
        return fn(*args, **kwargs)

    return wrapper
