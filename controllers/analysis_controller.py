"""CSV validation, persistence, and sales analysis."""
import csv
import io
import math
from collections import defaultdict
from datetime import date, datetime, timezone
from decimal import Decimal, InvalidOperation

from bson import ObjectId
from bson.errors import InvalidId
from db import get_db

REQUIRED_COLUMNS = ("order_id", "order_date", "product", "category", "region", "units", "revenue")
MAX_ROW_ERRORS = 100


class CsvValidationError(ValueError):
    """Raised when a CSV cannot be interpreted as a sales dataset."""


def parse_sales_csv(content):
    """Return validated records and row errors from UTF-8 CSV bytes."""
    try:
        text = content.decode("utf-8-sig")
    except UnicodeDecodeError as error:
        raise CsvValidationError("CSV must use UTF-8 encoding") from error

    reader = csv.DictReader(io.StringIO(text, newline=""), strict=True)
    try:
        fieldnames = reader.fieldnames
    except csv.Error as error:
        raise CsvValidationError("CSV could not be parsed") from error
    if not fieldnames:
        raise CsvValidationError("CSV is empty or has no header row")

    columns = [column.strip().lower() for column in fieldnames]
    if len(columns) != len(set(columns)):
        raise CsvValidationError("CSV contains duplicate column names")
    missing = sorted(set(REQUIRED_COLUMNS) - set(columns))
    if missing:
        raise CsvValidationError("Missing required columns: " + ", ".join(missing))

    reader.fieldnames = columns
    records, errors, invalid_count = [], [], 0
    try:
        for row_number, row in enumerate(reader, start=2):
            try:
                if None in row:
                    raise ValueError("row has more values than the header")
                records.append(_validate_row(row))
            except (ValueError, InvalidOperation) as error:
                invalid_count += 1
                if len(errors) < MAX_ROW_ERRORS:
                    errors.append({"row": row_number, "error": str(error)})
    except csv.Error as error:
        raise CsvValidationError("CSV could not be parsed") from error
    return records, errors, invalid_count


def _validate_row(row):
    record = {}
    for column in REQUIRED_COLUMNS:
        value = (row.get(column) or "").strip()
        if not value:
            raise ValueError(f"{column} is required")
        if column in ("order_id", "product", "category", "region") and len(value) > 255:
            raise ValueError(f"{column} must be at most 255 characters")
        record[column] = value

    try:
        parsed_date = date.fromisoformat(record["order_date"])
    except ValueError as error:
        raise ValueError("order_date must use YYYY-MM-DD format") from error

    try:
        units = int(record["units"])
    except ValueError as error:
        raise ValueError("units must be a whole number") from error
    if not 0 <= units <= 2147483647:
        raise ValueError("units must be between 0 and 2147483647")

    try:
        revenue = Decimal(record["revenue"])
    except InvalidOperation as error:
        raise ValueError("revenue must be a number") from error
    if not revenue.is_finite() or revenue < 0 or not math.isfinite(float(revenue)):
        raise ValueError("revenue must be a finite non-negative number")

    record["order_date"] = datetime.combine(parsed_date, datetime.min.time(), tzinfo=timezone.utc)
    record["units"] = units
    record["revenue"] = float(revenue)
    return record


def build_summary(records):
    """Calculate dashboard metrics from validated sales records."""
    revenue_by_category = defaultdict(lambda: {"revenue": 0.0, "units": 0})
    revenue_by_region = defaultdict(lambda: {"revenue": 0.0, "units": 0})
    revenue_by_product = defaultdict(lambda: {"revenue": 0.0, "units": 0})
    revenue_by_month = defaultdict(float)
    total_revenue = 0.0
    total_units = 0
    order_ids = set()

    for record in records:
        revenue = record["revenue"]
        units = record["units"]
        total_revenue += revenue
        total_units += units
        order_ids.add(record["order_id"])
        for grouping, key in (
            (revenue_by_category, record["category"]),
            (revenue_by_region, record["region"]),
            (revenue_by_product, record["product"]),
        ):
            grouping[key]["revenue"] += revenue
            grouping[key]["units"] += units
        revenue_by_month[record["order_date"].strftime("%Y-%m")] += revenue

    def ranked(grouping, name):
        return [
            {name: key, "revenue": round(values["revenue"], 2), "units": values["units"]}
            for key, values in sorted(grouping.items(), key=lambda item: (-item[1]["revenue"], item[0]))
        ]

    months = sorted(revenue_by_month.items())
    growth = 0.0
    if len(months) >= 2 and months[-2][1] > 0:
        growth = ((months[-1][1] - months[-2][1]) / months[-2][1]) * 100

    return {
        "total_revenue": round(total_revenue, 2),
        "total_units": total_units,
        "total_orders": len(order_ids),
        "aov": round(total_revenue / len(order_ids), 2) if order_ids else 0.0,
        "growth": round(growth, 2),
        "revenue_by_category": ranked(revenue_by_category, "category"),
        "revenue_by_region": ranked(revenue_by_region, "region"),
        "revenue_trend": [
            {"month": month, "revenue": round(revenue, 2)} for month, revenue in months
        ],
        "top_products": ranked(revenue_by_product, "product")[:10],
        "generated_at": datetime.now(timezone.utc),
    }


def upload_csv(user_id, filename, content):
    """Validate, save, and analyze one user's CSV upload."""
    records, row_errors, invalid_count = parse_sales_csv(content)
    if not records:
        return {
            "error": "CSV contains no valid sales rows",
            "valid_rows": 0,
            "invalid_rows": invalid_count,
            "row_errors": row_errors,
        }, 422

    try:
        owner_id = ObjectId(user_id)
    except (InvalidId, TypeError, ValueError):
        return {"error": "Unauthorized"}, 401

    db = get_db()
    upload_id = db.csv_uploads.insert_one({
        "user_id": owner_id,
        "file_name": filename,
        "status": "PROCESSING",
        "valid_rows": len(records),
        "invalid_rows": invalid_count,
        "row_errors": row_errors,
        "uploaded_at": datetime.now(timezone.utc),
    }).inserted_id

    try:
        stored_records = [
            {**record, "user_id": owner_id, "csv_upload_id": upload_id}
            for record in records
        ]
        db.sales_records.insert_many(stored_records)
        summary = build_summary(records)
        summary.update({"user_id": owner_id, "csv_upload_id": upload_id})
        db.analysis_summaries.insert_one(summary)
        db.csv_uploads.update_one({"_id": upload_id}, {"$set": {"status": "COMPLETED"}})
    except Exception:
        db.sales_records.delete_many({"csv_upload_id": upload_id})
        db.analysis_summaries.delete_one({"csv_upload_id": upload_id})
        db.csv_uploads.update_one({"_id": upload_id}, {"$set": {"status": "FAILED"}})
        raise

    return {
        "upload_id": str(upload_id),
        "file_name": filename,
        "status": "COMPLETED",
        "valid_rows": len(records),
        "invalid_rows": invalid_count,
        "row_errors": row_errors,
        "analysis": _serialize_summary(summary),
    }, 201


def list_uploads(user_id):
    try:
        owner_id = ObjectId(user_id)
    except (InvalidId, TypeError, ValueError):
        return None
    uploads = get_db().csv_uploads.find({"user_id": owner_id}).sort("uploaded_at", -1).limit(50)
    return [_serialize_upload(upload) for upload in uploads]


def get_upload(user_id, upload_id):
    try:
        owner_id, parsed_upload_id = ObjectId(user_id), ObjectId(upload_id)
    except (InvalidId, TypeError, ValueError):
        return None
    db = get_db()
    upload = db.csv_uploads.find_one({"_id": parsed_upload_id, "user_id": owner_id})
    if upload is None:
        return None
    summary = db.analysis_summaries.find_one({"csv_upload_id": parsed_upload_id, "user_id": owner_id})
    result = _serialize_upload(upload)
    result["analysis"] = _serialize_summary(summary) if summary else None
    return result


def _serialize_upload(upload):
    return {
        "upload_id": str(upload["_id"]),
        "file_name": upload["file_name"],
        "status": upload["status"],
        "valid_rows": upload["valid_rows"],
        "invalid_rows": upload["invalid_rows"],
        "row_errors": upload.get("row_errors", []),
        "uploaded_at": upload["uploaded_at"].isoformat(),
    }


def _serialize_summary(summary):
    return {
        key: value.isoformat() if isinstance(value, datetime) else value
        for key, value in summary.items()
        if key not in ("_id", "user_id", "csv_upload_id")
    }