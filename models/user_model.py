"""DB models. Auth truth lives in Supabase; here is only the profile mirror."""
from datetime import datetime, timezone

from extensions import db


class Organisation(db.Model):
    __tablename__ = "organisations"

    id = db.Column(db.String(36), primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))


class UserProfile(db.Model):
    """One row per Supabase user (created at US-01 registration). No passwords."""

    __tablename__ = "user_profiles"

    id = db.Column(db.String(36), primary_key=True)  # = supabase user uuid
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    full_name = db.Column(db.String(120), nullable=False)
    organisation_id = db.Column(db.String(36), db.ForeignKey("organisations.id"), nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    organisation = db.relationship("Organisation", lazy="joined")

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "full_name": self.full_name,
            "organisation_id": self.organisation_id,
        }
