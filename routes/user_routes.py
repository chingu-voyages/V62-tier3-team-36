"""Auth endpoints: /api/signup, /api/login, /api/logout, /api/refresh, /api/me."""
from flask import Blueprint, g, jsonify, request

from controllers.user_controller import (
    create_user,
    get_profile,
    login_user,
    logout_user,
    refresh_session,
)
from middlewares import require_auth
from schemas.user_schema import LoginSchema, RefreshSchema, SignupSchema, validate

auth_bp = Blueprint("auth", __name__, url_prefix="/api")


@auth_bp.post("/signup")
def signup():
    data, errors = validate(SignupSchema, request.get_json(silent=True))
    if errors:
        return jsonify({"error": "Invalid request", "details": errors}), 422
    payload, status = create_user(**data)
    return jsonify(payload), status


@auth_bp.post("/login")
def login():
    data, errors = validate(LoginSchema, request.get_json(silent=True))
    if errors:
        return jsonify({"error": "Invalid request", "details": errors}), 422
    payload, status = login_user(data["email"], data["password"])
    return jsonify(payload), status


@auth_bp.post("/logout")
@require_auth
def logout():
    payload, status = logout_user(g.token)
    return jsonify(payload), status


@auth_bp.post("/refresh")
def refresh():
    data, errors = validate(RefreshSchema, request.get_json(silent=True))
    if errors:
        return jsonify({"error": "Invalid request", "details": errors}), 422
    payload, status = refresh_session(data["refresh_token"])
    return jsonify(payload), status


@auth_bp.get("/me")
@require_auth
def me():
    payload, status = get_profile(g.user_id)
    return jsonify(payload), status
