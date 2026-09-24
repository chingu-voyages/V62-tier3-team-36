"""Request validation. Auth itself is done by Supabase, not here."""
from marshmallow import Schema, fields, validate


class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=1))


class RefreshSchema(Schema):
    refresh_token = fields.Str(required=True, validate=validate.Length(min=1))


def validate(schema_cls, payload):
    schema = schema_cls()
    errors = schema.validate(payload or {})
    if errors:
        return None, errors
    return schema.load(payload), None
