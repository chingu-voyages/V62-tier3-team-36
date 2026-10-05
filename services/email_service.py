"""Transactional email delivery through Resend."""
from html import escape

import resend
from flask import current_app


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
