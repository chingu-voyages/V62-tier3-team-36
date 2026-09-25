from flask import current_app
from pymongo import MongoClient


def init_mongo(app):
    """Create one MongoClient for the whole app and its connection pool."""
    client = MongoClient(app.config["MONGO_URI"], serverSelectionTimeoutMS=5000)
    app.extensions["mongo_client"] = client
    app.extensions["mongo_db"] = client[app.config["MONGO_DB_NAME"]]


def get_db():
    """Use inside routes and services: db = get_db()."""
    return current_app.extensions["mongo_db"]