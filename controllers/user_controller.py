"""Thin auth logic: delegate credential/session handling to Supabase Auth."""
from extensions import get_supabase_admin_client, get_supabase_client
from models.user_model import UserProfile


def _session_payload(auth_response):
    session = getattr(auth_response, "session", None)
    user = getattr(auth_response, "user", None)
    if not session or not user:
        return None
    return {
        "access_token": session.access_token,
        "refresh_token": session.refresh_token,
        "user": {"id": user.id, "email": user.email},
    }


def login_user(email, password):
    """Returns (payload, status). Generic 401 to avoid user enumeration."""
    email = (email or "").strip().lower()
    if not email or not password:
        return {"error": "Email and password are required"}, 422
    try:
        response = get_supabase_client().auth.sign_in_with_password(
            {"email": email, "password": password}
        )
    except Exception:
        return {"error": "Invalid credentials"}, 401

    payload = _session_payload(response)
    if not payload:
        return {"error": "Invalid credentials"}, 401

    profile = UserProfile.query.get(payload["user"]["id"])
    if profile is None:
        return {"error": "Workspace not assigned"}, 403
    payload["user"].update(profile.to_dict())
    return payload, 200


def logout_user(token):
    """Revoke via provider; always 200 so callers can't probe token validity."""
    try:
        get_supabase_admin_client().auth.admin.sign_out(token)
    except Exception:
        pass
    return {"message": "Logged out"}, 200


def refresh_session(refresh_token):
    if not refresh_token:
        return {"error": "refresh_token is required"}, 422
    try:
        response = get_supabase_client().auth.refresh_session(refresh_token)
    except Exception:
        return {"error": "Session expired"}, 401
    payload = _session_payload(response)
    if not payload:
        return {"error": "Session expired"}, 401
    return payload, 200


def get_profile(user_id):
    profile = UserProfile.query.get(user_id)
    if profile is None:
        return {"error": "Workspace not assigned"}, 403
    return profile.to_dict(), 200
