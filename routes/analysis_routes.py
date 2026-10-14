"""Authenticated CSV upload and sales-analysis endpoints."""
from flask import Blueprint, current_app, g, jsonify, request
from werkzeug.utils import secure_filename

from controllers.analysis_controller import (
    CsvValidationError,
    get_insight_context,
    get_upload,
    list_uploads,
    upload_csv,
)
from middlewares import require_admin, require_auth
from services.openrouter_service import OpenRouterError, generate_insights

analysis_bp = Blueprint("analysis", __name__, url_prefix="/api/analysis")


@analysis_bp.post("/uploads")
@require_admin
def create_upload():
    uploaded_file = request.files.get("file")
    if uploaded_file is None:
        return jsonify({"error": "A CSV file is required in the 'file' field"}), 400
    filename = secure_filename(uploaded_file.filename or "")
    if not filename or not filename.lower().endswith(".csv"):
        return jsonify({"error": "Only .csv files are accepted"}), 415
    try:
        result, status = upload_csv(g.organisation_id, filename, uploaded_file.read())
    except CsvValidationError as error:
        return jsonify({"error": str(error)}), 422
    except Exception:
        current_app.logger.exception("CSV analysis failed")
        return jsonify({"error": "CSV analysis could not be completed"}), 500
    return jsonify(result), status


@analysis_bp.get("/uploads")
@require_auth
def uploads():
    result = list_uploads(g.organisation_id)
    if result is None:
        return jsonify({"error": "Unauthorized"}), 401
    return jsonify({"uploads": result}), 200


@analysis_bp.get("/uploads/<upload_id>")
@require_auth
def upload_detail(upload_id):
    result = get_upload(g.organisation_id, upload_id)
    if result is None:
        return jsonify({"error": "Upload not found"}), 404
    return jsonify(result), 200


@analysis_bp.post("/uploads/<upload_id>/insights")
@require_auth
def upload_insights(upload_id):
    context = get_insight_context(g.organisation_id, upload_id)
    if context is None:
        return jsonify({"error": "Upload not found"}), 404
    if not context:
        return jsonify({"error": "Analysis is not available for this upload"}), 409

    api_key = current_app.config.get("OPENROUTER_API_KEY", "")
    if not api_key:
        return jsonify({"error": "AI insights are not configured"}), 503

    try:
        insights = generate_insights(
            context,
            api_key=api_key,
            model=current_app.config.get("OPENROUTER_MODEL", "openai/gpt-4o-mini"),
        )
    except OpenRouterError:
        current_app.logger.exception("OpenRouter insights request failed")
        return jsonify({"error": "AI insights could not be generated"}), 502
    return jsonify(insights), 200