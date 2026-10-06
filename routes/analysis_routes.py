"""Authenticated CSV upload and sales-analysis endpoints."""
from flask import Blueprint, current_app, g, jsonify, request
from werkzeug.utils import secure_filename

from controllers.analysis_controller import (
    CsvValidationError,
    get_upload,
    list_uploads,
    upload_csv,
)
from middlewares import require_auth

analysis_bp = Blueprint("analysis", __name__, url_prefix="/api/analysis")


@analysis_bp.post("/uploads")
@require_auth
def create_upload():
    uploaded_file = request.files.get("file")
    if uploaded_file is None:
        return jsonify({"error": "A CSV file is required in the 'file' field"}), 400
    filename = secure_filename(uploaded_file.filename or "")
    if not filename or not filename.lower().endswith(".csv"):
        return jsonify({"error": "Only .csv files are accepted"}), 415
    try:
        result, status = upload_csv(g.user_id, filename, uploaded_file.read())
    except CsvValidationError as error:
        return jsonify({"error": str(error)}), 422
    except Exception:
        current_app.logger.exception("CSV analysis failed")
        return jsonify({"error": "CSV analysis could not be completed"}), 500
    return jsonify(result), status


@analysis_bp.get("/uploads")
@require_auth
def uploads():
    result = list_uploads(g.user_id)
    if result is None:
        return jsonify({"error": "Unauthorized"}), 401
    return jsonify({"uploads": result}), 200


@analysis_bp.get("/uploads/<upload_id>")
@require_auth
def upload_detail(upload_id):
    result = get_upload(g.user_id, upload_id)
    if result is None:
        return jsonify({"error": "Upload not found"}), 404
    return jsonify(result), 200