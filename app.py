"""Flask app factory."""
import os

from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS

load_dotenv()

from config import Config
from extensions import db
from routes.user_routes import auth_bp


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    CORS(app, origins=[app.config["FRONTEND_URL"]], supports_credentials=False)

    db.init_app(app)
    app.register_blueprint(auth_bp)

    @app.get("/health")
    def health():
        return jsonify({"ok": True})

    with app.app_context():
        from models import user_model  # noqa: F401  (register tables)

        db.create_all()

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "5000")), debug=True)
