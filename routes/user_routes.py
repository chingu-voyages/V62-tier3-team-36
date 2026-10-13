"""Authentication endpoints."""
from flask import Blueprint, g, jsonify, request

from controllers.user_controller import (
    create_user,
    get_profile,
    list_members,
    login_user,
    logout_user,
    refresh_session,
    request_password_reset,
    reset_user_password,
)
from middlewares import require_admin, require_auth
from schemas.user_schema import (
    ForgotPasswordSchema,
    LoginSchema,
    MemberSchema,
    RefreshSchema,
    ResetPasswordSchema,
    SignupSchema,
    validate_request,
)

auth_bp = Blueprint("auth", __name__, url_prefix="/api")


@auth_bp.post("/signup")
def signup():
    data, errors = validate_request(SignupSchema, request.get_json(silent=True))
    if errors:
        return jsonify({"error": "Invalid request", "details": errors}), 422
    payload, status = create_user(**data)
    return jsonify(payload), status


@auth_bp.post("/login")
def login():
    data, errors = validate_request(LoginSchema, request.get_json(silent=True))
    if errors:
        return jsonify({"error": "Invalid request", "details": errors}), 422
    payload, status = login_user(data["email"], data["password"])
    return jsonify(payload), status


@auth_bp.post("/forgot_password")
def forgot_password():
    data, errors = validate_request(
        ForgotPasswordSchema, request.get_json(silent=True)
    )
    if errors:
        return jsonify({"error": "Invalid request", "details": errors}), 422
    payload, status = request_password_reset(data["email"])
    return jsonify(payload), status


@auth_bp.post("/reset_password")
def reset_password():
    data, errors = validate_request(
        ResetPasswordSchema, request.get_json(silent=True)
    )
    if errors:
        return jsonify({"error": "Invalid request", "details": errors}), 422
    payload, status = reset_user_password(data["token"], data["password"])
    return jsonify(payload), status


@auth_bp.post("/logout")
@require_auth
def logout():
    payload, status = logout_user(g.token)
    return jsonify(payload), status


@auth_bp.post("/refresh")
def refresh():
    data, errors = validate_request(RefreshSchema, request.get_json(silent=True))
    if errors:
        return jsonify({"error": "Invalid request", "details": errors}), 422
    payload, status = refresh_session(data["refresh_token"])
    return jsonify(payload), status


@auth_bp.get("/me")
@require_auth
def me():
    payload, status = get_profile(g.user_id)
    return jsonify(payload), status


@auth_bp.get("/members")
@require_admin
def members():
    return jsonify({"members": list_members(g.organisation_id)}), 200


@auth_bp.post("/members")
@require_admin
def add_member():
    data, errors = validate_request(MemberSchema, request.get_json(silent=True))
    if errors:
        return jsonify({"error": "Invalid request", "details": errors}), 422
    payload, status = create_user(
        organisation_name=g.user["organisation_name"],
        organisation_id=g.organisation_id,
        **data,
    )
    return jsonify(payload), status
