"""Legacy SQLAlchemy profile models.

Authentication in the deployed application uses MongoDB. These models are kept
for compatibility with older branches and do not store password-reset tokens.
"""
from datetime import datetime, timezone

from extensions import db


class Organisation(db.Model):
    __tablename__ = "organisations"

    id = db.Column(db.String(36), primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))


class UserProfile(db.Model):
    __tablename__ = "user_profiles"

    id = db.Column(db.String(36), primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    full_name = db.Column(db.String(120), nullable=False)
    organisation_id = db.Column(
        db.String(36), db.ForeignKey("organisations.id"), nullable=True
    )
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    organisation = db.relationship("Organisation", lazy="joined")

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "full_name": self.full_name,
            "organisation_id": self.organisation_id,
        }
