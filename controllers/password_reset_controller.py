import os
from urllib.parse import urlencode

from werkzeug.security import generate_password_hash

from flask import current_app, jsonify, request

from models.reset_token_model import token_store
from utils.email_service import email_service

from db import get_db

RESET_TOKEN_TTL_MINUTES = int(os.getenv("RESET_TOKEN_TTL_MINUTES", "30"))
RESET_PASSWORD_URL = os.getenv("RESET_PASSWORD_URL", "http://localhost:3000/reset-password")
MIN_PASSWORD_LENGTH = 8


# ---------- نقاط الربط مع user_model (تُستبدل عند جاهزية طبقة المستخدمين) ----------
def _user_exists(email: str) -> bool:
    return get_db()["users"].find_one({"email": email}) is not None

def _update_user_password(email: str, new_password: str) -> None:
    hashed = generate_password_hash(new_password)  # نفس صيغة scrypt الموجودة عندكم
    get_db()["users"].update_one(
        {"email": email},
        {"$set": {"password_hash": hashed}},
    )


def forgot_password():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()

    if not email or "@" not in email:
        return jsonify({"error": "A valid email is required"}), 400

    if _user_exists(email):
        token = token_store.create(email, RESET_TOKEN_TTL_MINUTES)
        reset_link = f"{RESET_PASSWORD_URL}?{urlencode({'token': token})}"
        try:
            email_service.send_password_reset(email, reset_link, RESET_TOKEN_TTL_MINUTES)
        except Exception:
            current_app.logger.exception("Failed to send password reset email")

    # نفس الرد دائمًا حتى لا يمكن معرفة الإيميلات المسجلة (user enumeration)
    return jsonify({"message": "If that email exists, a reset link has been sent."}), 200


def validate_reset_token():
    token = request.args.get("token", "")
    if not token or not token_store.peek(token):
        return jsonify({"valid": False}), 400
    return jsonify({"valid": True}), 200


def reset_password():
    data = request.get_json(silent=True) or {}
    token = data.get("token", "")
    new_password = data.get("new_password", "")

    # نتحقق من كلمة المرور أولًا حتى لا يُستهلك الـ token بسبب مدخل خاطئ
    if len(new_password) < MIN_PASSWORD_LENGTH:
        return jsonify({"error": f"Password must be at least {MIN_PASSWORD_LENGTH} characters"}), 400

    email = token_store.consume(token) if token else None
    if not email:
        return jsonify({"error": "Invalid or expired token"}), 400

    _update_user_password(email, new_password)
    return jsonify({"message": "Password updated successfully"}), 200