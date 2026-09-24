"""App configuration. All secrets come from environment (see .env)."""
import os


class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///dev.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Supabase Auth (managed provider per project mandate — no local passwords).
    SUPABASE_URL = os.getenv("SUPABASE_URL", "")
    SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")
    SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    # Legacy HS256 JWT secret (Supabase Dashboard → Auth → JWT). If empty,
    # tokens are decoded without signature check (dev only, never prod).
    SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "")

    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
