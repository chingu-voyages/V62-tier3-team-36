from unittest.mock import patch

from services.email_service import send_password_reset_email


def test_resend_payload(app):
    with app.app_context(), patch("services.email_service.resend.Emails.send") as send:
        send.return_value = {"id": "email-id"}
        result = send_password_reset_email(
            "reset.user@example.com",
            "http://localhost:3000/ResetPassword?token=secure-token",
        )

    assert result == {"id": "email-id"}
    params = send.call_args.args[0]
    assert params["to"] == ["reset.user@example.com"]
    assert "secure-token" in params["html"]
    assert params["subject"] == "Reset your Sales Dashboard password"
