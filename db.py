"""MongoDB client initialization and request-safe database access."""
from flask import current_app
from pymongo import MongoClient


def init_mongo(app):
    """Create one MongoClient and connection pool for the Flask app."""
    client_class = app.config.get("MONGO_CLIENT_CLASS", MongoClient)
    client = client_class(
        app.config["MONGO_URI"],
        serverSelectionTimeoutMS=5000,
        tz_aware=True,
    )
    app.extensions["mongo_client"] = client
    app.extensions["mongo_db"] = client[app.config["MONGO_DB_NAME"]]


def get_db():
    """Return the configured MongoDB database inside an app context."""
    return current_app.extensions["mongo_db"]
