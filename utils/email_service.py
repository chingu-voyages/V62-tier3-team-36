import html
import os
import smtplib
from email.message import EmailMessage
from typing import Optional

from dotenv import load_dotenv

load_dotenv()


class EmailService:
    def __init__(self, host, port, username, password, sender):
        self.host = host
        self.port = int(port) if port else 587
        self.username = username
        self.password = password
        self.sender = sender

    @classmethod
    def from_env(cls) -> "EmailService":
        return cls(
            host=os.getenv("SMTP_HOST"),
            port=os.getenv("SMTP_PORT", "587"),
            username=os.getenv("SMTP_USERNAME"),
            password=os.getenv("SMTP_PASSWORD"),
            sender=os.getenv("MAIL_FROM", "no-reply@example.com"),
        )

    @property
    def is_configured(self) -> bool:
        return bool(self.host)

    def send(self, to: str, subject: str, text_body: str, html_body: Optional[str] = None) -> None:
        msg = EmailMessage()
        msg["From"] = self.sender
        msg["To"] = to
        msg["Subject"] = subject
        msg.set_content(text_body)
        if html_body:
            msg.add_alternative(html_body, subtype="html")

        # وضع التطوير: لا يوجد SMTP، نطبع الإيميل بدل إرساله
        if not self.is_configured:
            print("\n===== [DEV EMAIL - not sent] =====")
            print(f"To: {to}\nSubject: {subject}\n\n{text_body}")
            print("==================================\n")
            return

        if self.port == 465:
            with smtplib.SMTP_SSL(self.host, self.port, timeout=10) as server:
                if self.username:
                    server.login(self.username, self.password)
                server.send_message(msg)
        else:
            with smtplib.SMTP(self.host, self.port, timeout=10) as server:
                server.starttls()
                if self.username:
                    server.login(self.username, self.password)
                server.send_message(msg)

    def send_password_reset(self, to: str, reset_link: str, expires_minutes: int) -> None:
        subject = "Reset your RetailInsight password"
        text = (
            "We received a request to reset your password.\n\n"
            f"Use the link below to choose a new password (valid for {expires_minutes} minutes):\n"
            f"{reset_link}\n\n"
            "If you didn't request this, you can safely ignore this email."
        )
        safe_link = html.escape(reset_link, quote=True)
        html_body = f"""
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto">
          <h2>Reset your password</h2>
          <p>We received a request to reset your password.</p>
          <p>
            <a href="{safe_link}"
               style="background:#00684a;color:#fff;padding:12px 20px;
                      border-radius:6px;text-decoration:none">Reset password</a>
          </p>
          <p>This link is valid for {expires_minutes} minutes.</p>
          <p style="color:#888">If you didn't request this, you can ignore this email.</p>
        </div>
        """
        self.send(to, subject, text, html_body)


email_service = EmailService.from_env()