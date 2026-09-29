from io import BytesIO
from types import SimpleNamespace
from unittest.mock import patch

import jwt
from bson import ObjectId

from app import create_app
from controllers.analysis_controller import build_summary, parse_sales_csv, upload_csv


class TestConfig:
    SECRET_KEY = "test-secret-key-with-at-least-32-bytes"
    FRONTEND_URL = "http://localhost:3000"
    MONGO_URI = "mongodb://localhost:27017"
    MONGO_DB_NAME = "test"
    TESTING = True


def _token(user_id="507f1f77bcf86cd799439011"):
    return jwt.encode({"sub": user_id, "type": "access"}, TestConfig.SECRET_KEY, algorithm="HS256")


def test_csv_parser_keeps_valid_rows_and_reports_bad_rows():
    content = (
        b"order_id,order_date,product,category,region,units,revenue\n"
        b"1,2026-01-05,Widget,Hardware,North,2,30.50\n"
        b"2,not-a-date,Widget,Hardware,North,1,10\n"
    )

    records, errors, invalid_count = parse_sales_csv(content)

    assert len(records) == 1
    assert records[0]["revenue"] == 30.5
    assert invalid_count == 1
    assert errors[0]["row"] == 3


def test_csv_parser_rejects_missing_required_columns():
    content = b"order_id,product\n1,Widget\n"

    try:
        parse_sales_csv(content)
    except ValueError as error:
        assert "Missing required columns" in str(error)
    else:
        raise AssertionError("Expected missing CSV columns to be rejected")


def test_csv_parser_counts_all_invalid_rows_but_caps_diagnostics():
    header = b"order_id,order_date,product,category,region,units,revenue\n"
    content = header + (b"bad,not-a-date,Widget,Hardware,North,1,10\n" * 105)

    records, errors, invalid_count = parse_sales_csv(content)

    assert records == []
    assert invalid_count == 105
    assert len(errors) == 100


def test_summary_calculates_totals_monthly_growth_and_rankings():
    records, _, _ = parse_sales_csv(
        b"order_id,order_date,product,category,region,units,revenue\n"
        b"1,2026-01-05,Widget,Hardware,North,2,100\n"
        b"2,2026-02-05,Gadget,Accessories,South,3,150\n"
    )

    summary = build_summary(records)

    assert summary["total_revenue"] == 250
    assert summary["total_units"] == 5
    assert summary["total_orders"] == 2
    assert summary["aov"] == 125
    assert summary["growth"] == 50
    assert summary["revenue_trend"] == [
        {"month": "2026-01", "revenue": 100},
        {"month": "2026-02", "revenue": 150},
    ]
    assert summary["top_products"][0]["product"] == "Gadget"


def test_analysis_routes_require_an_access_token():
    app = create_app(TestConfig)
    client = app.test_client()

    responses = [
        client.post("/api/analysis/uploads"),
        client.get("/api/analysis/uploads"),
        client.get("/api/analysis/uploads/not-an-id"),
    ]

    assert [response.status_code for response in responses] == [401, 401, 401]


def test_upload_history_rejects_malformed_authenticated_user_id():
    app = create_app(TestConfig)
    client = app.test_client()

    response = client.get(
        "/api/analysis/uploads",
        headers={"Authorization": f"Bearer {_token('not-an-object-id')}"},
    )

    assert response.status_code == 401


def test_authenticated_upload_rejects_invalid_csv_before_database_access():
    app = create_app(TestConfig)
    client = app.test_client()

    response = client.post(
        "/api/analysis/uploads",
        headers={"Authorization": f"Bearer {_token()}"},
        data={"file": (BytesIO(b"order_id,product\n1,Widget\n"), "sales.csv")},
    )

    assert response.status_code == 422
    assert "Missing required columns" in response.get_json()["error"]


def test_upload_persists_records_and_analysis_under_authenticated_owner():
    class Collection:
        def __init__(self):
            self.documents = []

        def insert_one(self, document):
            document.setdefault("_id", object_id)
            self.documents.append(document)
            return SimpleNamespace(inserted_id=document["_id"])

        def insert_many(self, documents):
            self.documents.extend(documents)

        def update_one(self, query, update):
            for document in self.documents:
                if document.get("_id") == query["_id"]:
                    document.update(update["$set"])

    object_id = ObjectId()
    fake_db = SimpleNamespace(
        csv_uploads=Collection(),
        sales_records=Collection(),
        analysis_summaries=Collection(),
    )
    content = (
        b"order_id,order_date,product,category,region,units,revenue\n"
        b"1,2026-01-05,Widget,Hardware,North,2,30.50\n"
    )

    with patch("controllers.analysis_controller.get_db", return_value=fake_db):
        result, status = upload_csv("507f1f77bcf86cd799439011", "sales.csv", content)

    assert status == 201
    assert result["analysis"]["total_revenue"] == 30.5
    assert fake_db.csv_uploads.documents[0]["status"] == "COMPLETED"
    assert fake_db.sales_records.documents[0]["user_id"] == fake_db.csv_uploads.documents[0]["user_id"]
    assert fake_db.analysis_summaries.documents[0]["user_id"] == fake_db.csv_uploads.documents[0]["user_id"]