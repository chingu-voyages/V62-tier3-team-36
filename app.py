"""Flask app factory."""
import os

from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS

load_dotenv()

from config import Config
from db import get_db, init_mongo
from init_db import setup_database
from routes.user_routes import auth_bp


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    CORS(app, origins=[app.config["FRONTEND_URL"]], supports_credentials=False)

    init_mongo(app)
    app.register_blueprint(auth_bp)

    @app.cli.command("init-db")
    def init_db_command():
        setup_database(get_db())

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
