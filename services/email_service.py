"""Transactional email delivery through Resend."""
from concurrent.futures import ThreadPoolExecutor
from html import escape

import resend
from flask import current_app


_email_executor = ThreadPoolExecutor(max_workers=2, thread_name_prefix="reset-email")


def send_password_reset_email(recipient, reset_url):
    """Send a one-time password reset link and return the Resend response."""
    api_key = current_app.config["RESEND_API_KEY"]
    if not api_key:
        raise RuntimeError("RESEND_API_KEY is not configured")

    resend.api_key = api_key
    safe_url = escape(reset_url, quote=True)
    ttl_minutes = current_app.config["RESET_TOKEN_TTL_MINUTES"]
    params: resend.Emails.SendParams = {
        "from": current_app.config["RESEND_FROM_EMAIL"],
        "to": [recipient],
        "subject": "Reset your Sales Dashboard password",
        "html": (
            "<h1>Reset your password</h1>"
            "<p>We received a request to reset your password.</p>"
            f'<p><a href="{safe_url}">Reset password</a></p>'
            f"<p>This link expires in {ttl_minutes} minutes. "
            "If you did not request it, you can ignore this email.</p>"
        ),
        "text": (
            "Reset your Sales Dashboard password by opening this link: "
            f"{reset_url}\n\nThis link expires in {ttl_minutes} minutes. "
            "If you did not request it, you can ignore this email."
        ),
    }
    return resend.Emails.send(params)


def _deliver_password_reset_email(app, recipient, reset_url):
    if not recipient or not reset_url:
        return None

    with app.app_context():
        try:
            return send_password_reset_email(recipient, reset_url)
        except Exception:
            app.logger.exception("Failed to send password reset email")
            return None


def enqueue_password_reset_email(recipient, reset_url):
    """Queue delivery so request timing does not reveal whether an account exists."""
    app = current_app._get_current_object()
    return _email_executor.submit(
        _deliver_password_reset_email, app, recipient, reset_url
    )
