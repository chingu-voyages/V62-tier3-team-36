"""Shared SQLAlchemy and lazy Supabase clients used by existing branches."""
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

_supabase_client = None
_supabase_admin_client = None


def _create_client(url, key):
    from supabase import create_client

    return create_client(url, key)


def get_supabase_client():
    global _supabase_client
    if _supabase_client is None:
        from flask import current_app

        url = current_app.config["SUPABASE_URL"]
        key = current_app.config["SUPABASE_ANON_KEY"]
        if not url or not key:
            raise RuntimeError("SUPABASE_URL / SUPABASE_ANON_KEY not configured")
        _supabase_client = _create_client(url, key)
    return _supabase_client


def get_supabase_admin_client():
    global _supabase_admin_client
    if _supabase_admin_client is None:
        from flask import current_app

        url = current_app.config["SUPABASE_URL"]
        key = (
            current_app.config["SUPABASE_SERVICE_ROLE_KEY"]
            or current_app.config["SUPABASE_ANON_KEY"]
        )
        if not url or not key:
            raise RuntimeError("SUPABASE_URL / service key not configured")
        _supabase_admin_client = _create_client(url, key)
    return _supabase_admin_client
