"""Create MongoDB collections, validators, and indexes.

Safe to run multiple times with: ``flask --app app init-db``.
"""
from pymongo import ASCENDING, DESCENDING, MongoClient
from pymongo.errors import CollectionInvalid, OperationFailure

from config import Config

USERS = {
    "bsonType": "object",
    "required": [
        "full_name",
        "organisation_name",
        "email",
        "password_hash",
        "role",
        "created_at",
    ],
    "properties": {
        "full_name": {"bsonType": "string"},
        "organisation_name": {"bsonType": "string"},
        "email": {"bsonType": "string"},
        "password_hash": {"bsonType": "string"},
        "role": {"enum": ["ADMIN", "ANALYST", "VIEWER"]},
        "created_at": {"bsonType": "date"},
        "password_changed_at": {"bsonType": "date"},
    },
}

PASSWORD_RESET_TOKENS = {
    "bsonType": "object",
    "required": ["user_id", "token_hash", "created_at", "expires_at"],
    "properties": {
        "user_id": {"bsonType": "objectId"},
        "token_hash": {"bsonType": "string"},
        "created_at": {"bsonType": "date"},
        "expires_at": {"bsonType": "date"},
        "used_at": {"bsonType": "date"},
    },
}

PASSWORD_RESET_LOCKS = {
    "bsonType": "object",
    "required": ["requested_at", "expires_at"],
    "properties": {
        "requested_at": {"bsonType": "date"},
        "expires_at": {"bsonType": "date"},
    },
}

CSV_UPLOADS = {
    "bsonType": "object",
    "required": [
        "user_id",
        "file_name",
        "status",
        "valid_rows",
        "invalid_rows",
        "uploaded_at",
    ],
    "properties": {
        "user_id": {"bsonType": "objectId"},
        "file_name": {"bsonType": "string"},
        "status": {"enum": ["PROCESSING", "COMPLETED", "FAILED"]},
        "valid_rows": {"bsonType": "int"},
        "invalid_rows": {"bsonType": "int"},
        "uploaded_at": {"bsonType": "date"},
    },
}

SALES_RECORDS = {
    "bsonType": "object",
    "required": [
        "user_id",
        "csv_upload_id",
        "order_id",
        "order_date",
        "product",
        "category",
        "region",
        "units",
        "revenue",
    ],
    "properties": {
        "user_id": {"bsonType": "objectId"},
        "csv_upload_id": {"bsonType": "objectId"},
        "order_id": {"bsonType": "string"},
        "order_date": {"bsonType": "date"},
        "product": {"bsonType": "string"},
        "category": {"bsonType": "string"},
        "region": {"bsonType": "string"},
        "units": {"bsonType": "int", "minimum": 0},
        "revenue": {"bsonType": ["double", "int", "decimal"], "minimum": 0},
    },
}

ANALYSIS_SUMMARIES = {
    "bsonType": "object",
    "required": [
        "user_id",
        "csv_upload_id",
        "total_revenue",
        "total_units",
        "aov",
        "growth",
        "generated_at",
    ],
    "properties": {
        "user_id": {"bsonType": "objectId"},
        "csv_upload_id": {"bsonType": "objectId"},
        "total_revenue": {"bsonType": ["double", "int", "decimal"]},
        "total_units": {"bsonType": "int"},
        "aov": {"bsonType": ["double", "int", "decimal"]},
        "growth": {"bsonType": ["double", "int", "decimal"]},
        "revenue_by_category": {"bsonType": "array"},
        "revenue_by_region": {"bsonType": "array"},
        "revenue_trend": {"bsonType": "array"},
        "top_products": {"bsonType": "array"},
        "generated_at": {"bsonType": "date"},
    },
}

COLLECTIONS = {
    "users": USERS,
    "password_reset_tokens": PASSWORD_RESET_TOKENS,
    "password_reset_locks": PASSWORD_RESET_LOCKS,
    "csv_uploads": CSV_UPLOADS,
    "sales_records": SALES_RECORDS,
    "analysis_summaries": ANALYSIS_SUMMARIES,
}


def _ensure_collection(db, name, schema):
    validator = {"$jsonSchema": schema}
    try:
        db.create_collection(name, validator=validator)
        print(f"  created collection: {name}")
    except CollectionInvalid:
        try:
            db.command("collMod", name, validator=validator)
            print(f"  updated validator:  {name}")
        except OperationFailure as error:
            if error.code != 13:
                raise
            # Application users normally have readWrite rather than dbAdmin.
            # Existing validators can remain unchanged; indexes are still applied.
            print(f"  validator unchanged (insufficient dbAdmin permission): {name}")


def _create_indexes(db):
    db.users.create_index([("email", ASCENDING)], unique=True)

    db.password_reset_tokens.create_index([("token_hash", ASCENDING)], unique=True)
    db.password_reset_tokens.create_index([("user_id", ASCENDING)])
    db.password_reset_tokens.create_index(
        [("expires_at", ASCENDING)], expireAfterSeconds=0
    )
    db.password_reset_locks.create_index(
        [("expires_at", ASCENDING)], expireAfterSeconds=0
    )

    db.csv_uploads.create_index([("user_id", ASCENDING), ("uploaded_at", DESCENDING)])
    db.sales_records.create_index([("csv_upload_id", ASCENDING)])
    db.sales_records.create_index([("user_id", ASCENDING), ("order_date", ASCENDING)])
    db.sales_records.create_index([("user_id", ASCENDING), ("category", ASCENDING)])
    db.sales_records.create_index([("user_id", ASCENDING), ("region", ASCENDING)])
    db.analysis_summaries.create_index([("csv_upload_id", ASCENDING)], unique=True)
    db.analysis_summaries.create_index([("user_id", ASCENDING)])
    print("  indexes ready")


def setup_database(db):
    print(f"Setting up database '{db.name}'...")
    for name, schema in COLLECTIONS.items():
        _ensure_collection(db, name, schema)
    _create_indexes(db)
    print("Done.")


if __name__ == "__main__":
    client = MongoClient(Config.MONGO_URI, serverSelectionTimeoutMS=5000, tz_aware=True)
    setup_database(client[Config.MONGO_DB_NAME])
