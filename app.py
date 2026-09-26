"""Flask application factory for the Sales Dashboard API."""
from concurrent.futures import ThreadPoolExecutor
import os

from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS

load_dotenv(".env.local")
load_dotenv()

from config import Config
from db import get_db, init_mongo
from init_db import setup_database
from routes.user_routes import auth_bp


INSECURE_SECRET_KEYS = {
    None,
    "",
    "dev-secret-change-me",
    "replace-with-a-long-random-secret",
}


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    secret_key = app.config.get("SECRET_KEY")
    if (
        secret_key in INSECURE_SECRET_KEYS
        or not isinstance(secret_key, str)
        or len(secret_key) < 32
    ):
        raise RuntimeError(
            "SECRET_KEY must be set to a strong, private value before startup"
        )
    CORS(app, origins=[app.config["FRONTEND_URL"]], supports_credentials=False)

    init_mongo(app)
    if not app.config.get("PASSWORD_RESET_SYNCHRONOUS", False):
        app.extensions["password_reset_executor"] = ThreadPoolExecutor(
            max_workers=2, thread_name_prefix="password-reset"
        )
    app.register_blueprint(auth_bp)

    @app.cli.command("init-db")
    def init_db_command():
        """Create or update MongoDB validators and indexes."""
        setup_database(get_db())

    @app.get("/")
    def index():
        return (
            "<main><h1>Welcome to Our Platform Backend</h1>"
            "<p>Your backend service is running.</p>"
            "<p><a href='/health'>Check service health</a></p></main>"
        )

    @app.get("/health")
    def health():
        try:
            get_db().command("ping")
            return jsonify(status="ok", database=get_db().name)
        except Exception as error:
            return jsonify(status="error", message=str(error)), 500

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "5000")), debug=True)
