from flask import Blueprint

from controllers.password_reset_controller import (
    forgot_password,
    reset_password,
    validate_reset_token,
)

password_reset_bp = Blueprint("password_reset", __name__, url_prefix="/api/auth")

password_reset_bp.add_url_rule("/forgot-password", view_func=forgot_password, methods=["POST"])
password_reset_bp.add_url_rule("/reset-password/validate", view_func=validate_reset_token, methods=["GET"])
password_reset_bp.add_url_rule("/reset-password", view_func=reset_password, methods=["POST"])