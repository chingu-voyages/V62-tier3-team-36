"""Auth guard: verifies Supabase JWT locally, attaches user to `flask.g`."""
from functools import wraps

import jwt
from flask import current_app, g, jsonify, request


def _decode(token):
    secret = current_app.config.get("SUPABASE_JWT_SECRET", "")
    if secret:
        return jwt.decode(
            token,
            secret,
            algorithms=["HS256"],
            options={"verify_aud": False},
        )
    # Dev fallback when no secret is configured (never use in prod).
    return jwt.decode(token, options={"verify_signature": False})


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
        g.user_id = claims.get("sub")
        g.token = token
        if not g.user_id:
            return jsonify({"error": "Unauthorized"}), 401
        return fn(*args, **kwargs)

    return wrapper
