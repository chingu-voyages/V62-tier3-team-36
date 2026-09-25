"""Request validation for authentication endpoints."""
from marshmallow import Schema, fields, validate


class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=1))


class SignupSchema(Schema):
    full_name = fields.Str(required=True, validate=validate.Length(min=1, max=120))
    organisation_name = fields.Str(required=True, validate=validate.Length(min=1, max=120))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=8))
    role = fields.Str(load_default="VIEWER", validate=validate.OneOf(["ADMIN", "ANALYST", "VIEWER"]))


class RefreshSchema(Schema):
    refresh_token = fields.Str(required=True, validate=validate.Length(min=1))


def validate(schema_cls, payload):
    schema = schema_cls()
    errors = schema.validate(payload or {})
    if errors:
        return None, errors
    return schema.load(payload), None
