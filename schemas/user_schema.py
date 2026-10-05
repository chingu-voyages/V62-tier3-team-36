"""Request validation schemas for authentication endpoints."""
from marshmallow import Schema, fields, validate


class ForgotPasswordSchema(Schema):
    email = fields.Email(required=True)


class ResetPasswordSchema(Schema):
    token = fields.Str(required=True, validate=validate.Length(min=32, max=256))
    password = fields.Str(
        required=True,
        validate=validate.Length(min=8, max=128),
    )


class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=1))


class SignupSchema(Schema):
    full_name = fields.Str(required=True, validate=validate.Length(min=1, max=120))
    organisation_name = fields.Str(
        required=True, validate=validate.Length(min=1, max=120)
    )
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=8, max=128))


class RefreshSchema(Schema):
    refresh_token = fields.Str(required=True, validate=validate.Length(min=1))


def validate_request(schema_class, payload):
    schema = schema_class()
    errors = schema.validate(payload or {})
    if errors:
        return None, errors
    return schema.load(payload), None
