import json
from datetime import datetime, timedelta, timezone
from io import BytesIO
from types import SimpleNamespace
from unittest.mock import patch
from urllib.error import HTTPError

import jwt
import mongomock
import pytest
from bson import ObjectId

from app import create_app
from db import get_db
from controllers.analysis_controller import (
    build_summary,
    get_insight_context,
    get_saved_insights,
    parse_sales_csv,
    save_upload_insights,
    upload_csv,
)
from services.openrouter_service import OpenRouterError, generate_insights


class TestConfig:
    SECRET_KEY = "test-secret-key-with-at-least-32-bytes"
    FRONTEND_URL = "http://localhost:3000"
    MONGO_URI = "mongodb://localhost:27017"
    MONGO_DB_NAME = "test"
    TESTING = True
    OPENROUTER_API_KEY = "test-openrouter-key"
    OPENROUTER_MODEL = "test/model"


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
        client.post("/api/analysis/uploads/not-an-id/insights"),
    ]

    assert [response.status_code for response in responses] == [401, 401, 401, 401]


def test_upload_detail_route_returns_saved_dashboard_analysis():
    app = create_app(TestConfig)
    client = app.test_client()
    upload = {
        "upload_id": "507f1f77bcf86cd799439012",
        "file_name": "sales.csv",
        "status": "COMPLETED",
        "analysis": {
            "total_customers": 2,
            "total_units": 8,
            "profit_margin": 25.0,
            "growth": 10.0,
            "revenue_by_category": [
                {"category": "Hardware", "revenue": 100.0, "units": 8}
            ],
            "revenue_by_segment": [
                {"customer_segment": "VIP", "revenue": 100.0, "units": 8}
            ],
            "revenue_by_region": [
                {"region": "North", "revenue": 100.0, "units": 8}
            ],
            "top_products": [
                {"product": "Widget", "revenue": 100.0, "units": 8}
            ],
            "top_customers": [
                {"customer_id": "customer-1", "revenue": 100.0, "units": 8}
            ],
        },
    }
    user_db = SimpleNamespace(
        users=SimpleNamespace(find_one=lambda query: {"_id": query["_id"]})
    )

    with (
        patch("middlewares.get_db", return_value=user_db),
        patch("routes.analysis_routes.get_upload", return_value=upload),
    ):
        response = client.get(
            "/api/analysis/uploads/507f1f77bcf86cd799439012",
            headers={"Authorization": f"Bearer {_token()}"},
        )

    assert response.status_code == 200
    assert response.get_json()["analysis"] == upload["analysis"]


def test_insights_route_generates_ai_insights_for_the_selected_upload():
    app = create_app(TestConfig)
    client = app.test_client()
    context = [{"file_name": "sales.csv", "analysis": {"total_revenue": 100}}]
    user_db = SimpleNamespace(
        users=SimpleNamespace(find_one=lambda query: {"_id": query["_id"]})
    )

    with (
        patch("middlewares.get_db", return_value=user_db),
        patch("routes.analysis_routes.get_saved_insight_record", return_value=None),
        patch("routes.analysis_routes.get_insight_context", return_value=context),
        patch("routes.analysis_routes.save_upload_insights") as save,
        patch(
            "routes.analysis_routes.generate_insights",
            return_value=[{
                "type": "trend",
                "title": "Revenue increased",
                "description": "Revenue grew compared with the previous period.",
                "recommendation": "Maintain inventory for the strongest categories.",
            }],
        ) as generate,
    ):
        response = client.post(
            "/api/analysis/uploads/507f1f77bcf86cd799439012/insights",
            headers={"Authorization": f"Bearer {_token()}"},
        )

    assert response.status_code == 200
    assert response.get_json() == [{
            "type": "trend",
            "title": "Revenue increased",
            "description": "Revenue grew compared with the previous period.",
            "recommendation": "Maintain inventory for the strongest categories.",
        }]
    generate.assert_called_once_with(
        context, api_key="test-openrouter-key", model="test/model"
    )
    save.assert_called_once_with(
        ObjectId("507f1f77bcf86cd799439011"),
        "507f1f77bcf86cd799439012",
        response.get_json(),
    )


def test_saved_insights_route_returns_persisted_insights():
    app = create_app(TestConfig)
    client = app.test_client()
    insights = [{
        "type": "trend",
        "title": "Revenue increased",
        "description": "Revenue grew compared with the previous period.",
        "recommendation": "Maintain inventory for the strongest categories.",
    }]
    user_db = SimpleNamespace(
        users=SimpleNamespace(find_one=lambda query: {"_id": query["_id"]})
    )

    with (
        patch("middlewares.get_db", return_value=user_db),
        patch("routes.analysis_routes.get_saved_insights", return_value=insights),
    ):
        response = client.get(
            "/api/analysis/uploads/507f1f77bcf86cd799439011/insights",
            headers={"Authorization": f"Bearer {_token()}"},
        )

    assert response.status_code == 200
    assert response.get_json() == insights


def test_insights_are_saved_and_reused_without_another_provider_call():
    class MongoTestConfig(TestConfig):
        MONGO_CLIENT_CLASS = mongomock.MongoClient
        MONGO_DB_NAME = "ai_insights_persistence_test"

    app = create_app(MongoTestConfig)
    client = app.test_client()
    owner_id = ObjectId("507f1f77bcf86cd799439011")
    upload_id = ObjectId("507f1f77bcf86cd799439012")
    generated = [{
        "type": "trend",
        "title": "Revenue increased",
        "description": "Revenue grew compared with the previous period.",
        "recommendation": "Maintain inventory for the strongest categories.",
    }]

    with app.app_context():
        database = get_db()
        database.users.insert_one({"_id": owner_id})
        database.csv_uploads.insert_one({
            "_id": upload_id,
            "user_id": owner_id,
            "file_name": "sales.csv",
            "status": "COMPLETED",
            "valid_rows": 1,
            "invalid_rows": 0,
            "uploaded_at": datetime.now(timezone.utc),
        })
        database.analysis_summaries.insert_one({
            "csv_upload_id": upload_id,
            "user_id": owner_id,
            "total_revenue": 100,
            "top_customers": [],
        })

    auth_headers = {"Authorization": f"Bearer {_token(str(owner_id))}"}
    insights_url = f"/api/analysis/uploads/{upload_id}/insights"
    with patch("routes.analysis_routes.generate_insights", return_value=generated) as generate:
        first_generation = client.post(insights_url, headers=auth_headers)
        retrieval = client.get(insights_url, headers=auth_headers)
        repeated_generation = client.post(insights_url, headers=auth_headers)

    assert first_generation.status_code == 200
    assert retrieval.status_code == 200
    assert repeated_generation.status_code == 200
    assert first_generation.get_json() == generated
    assert retrieval.get_json() == generated
    assert repeated_generation.get_json() == generated
    generate.assert_called_once()

    with app.app_context():
        saved = get_db().analysis_summaries.find_one({
            "user_id": owner_id,
            "csv_upload_id": upload_id,
        })
        assert saved["ai_insights"] == generated
        assert isinstance(saved["ai_insights_generated_at"], datetime)
        app.extensions["mongo_client"].close()


def test_generated_insights_are_saved_and_retrievable_for_their_upload():
    owner_id = ObjectId("507f1f77bcf86cd799439011")
    upload_id = ObjectId("507f1f77bcf86cd799439012")
    insights = [{
        "type": "trend",
        "title": "Revenue increased",
        "description": "Revenue grew compared with the previous period.",
        "recommendation": "Maintain inventory for the strongest categories.",
    }]

    class Collection:
        def __init__(self, documents=None):
            self.documents = documents or []

        def find_one(self, query):
            return next(
                (
                    document
                    for document in self.documents
                    if all(document.get(key) == value for key, value in query.items())
                ),
                None,
            )

        def update_one(self, query, update, upsert=False):
            document = self.find_one(query)
            if document is None:
                if not upsert:
                    return SimpleNamespace(matched_count=0)
                document = dict(query)
                self.documents.append(document)
            document.update(update["$set"])
            return SimpleNamespace(matched_count=1)

    fake_db = SimpleNamespace(
        csv_uploads=Collection([{
            "_id": upload_id,
            "user_id": owner_id,
            "status": "COMPLETED",
        }]),
        analysis_summaries=Collection([{
            "csv_upload_id": upload_id,
            "user_id": owner_id,
            "total_revenue": 100,
        }]),
    )

    with patch("controllers.analysis_controller.get_db", return_value=fake_db):
        save_upload_insights(str(owner_id), str(upload_id), insights)
        retrieved = get_saved_insights(str(owner_id), str(upload_id))

    assert retrieved == insights
    assert len(fake_db.analysis_summaries.documents) == 1
    assert fake_db.analysis_summaries.documents[0]["user_id"] == owner_id
    assert fake_db.analysis_summaries.documents[0]["csv_upload_id"] == upload_id
    assert fake_db.analysis_summaries.documents[0]["ai_insights"] == insights
    assert isinstance(
        fake_db.analysis_summaries.documents[0]["ai_insights_generated_at"],
        datetime,
    )


def test_insights_route_reports_missing_openrouter_configuration():
    class UnconfiguredTestConfig(TestConfig):
        OPENROUTER_API_KEY = ""

    app = create_app(UnconfiguredTestConfig)
    client = app.test_client()
    user_db = SimpleNamespace(
        users=SimpleNamespace(find_one=lambda query: {"_id": query["_id"]})
    )
    with (
        patch("middlewares.get_db", return_value=user_db),
        patch("routes.analysis_routes.get_saved_insight_record", return_value=None),
        patch("routes.analysis_routes.get_insight_context", return_value=[{}]),
    ):
        response = client.post(
            "/api/analysis/uploads/507f1f77bcf86cd799439011/insights",
            headers={"Authorization": f"Bearer {_token()}"},
        )

    assert response.status_code == 503
    assert response.get_json()["error"] == "AI insights are not configured"


def test_insight_context_includes_prior_user_analyses_without_customer_ids():
    user_id = ObjectId("507f1f77bcf86cd799439011")
    other_user_id = ObjectId("507f1f77bcf86cd799439012")
    upload_ids = [ObjectId() for _ in range(3)]
    uploaded_at = datetime(2026, 1, 3, tzinfo=timezone.utc)

    class Cursor:
        def __init__(self, documents):
            self.documents = documents

        def sort(self, field, direction):
            self.documents.sort(key=lambda document: document[field], reverse=direction < 0)
            return self

        def limit(self, count):
            self.documents = self.documents[:count]
            return self

        def __iter__(self):
            return iter(self.documents)

    class Collection:
        def __init__(self, documents):
            self.documents = documents

        def find_one(self, query):
            return next(
                (doc for doc in self.documents if matches(doc, query)),
                None,
            )

        def find(self, query):
            return Cursor([doc for doc in self.documents if matches(doc, query)])

    def matches(document, query):
        for key, expected in query.items():
            value = document.get(key)
            if isinstance(expected, dict):
                if "$lt" in expected and not value < expected["$lt"]:
                    return False
            elif value != expected:
                return False
        return True

    uploads = [
        {
            "_id": upload_id,
            "user_id": user_id,
            "file_name": f"sales-{index}.csv",
            "status": "COMPLETED",
            "uploaded_at": uploaded_at + timedelta(days=index),
        }
        for index, upload_id in enumerate(upload_ids)
    ]
    uploads.append({
        **uploads[0],
        "_id": ObjectId(),
        "user_id": other_user_id,
        "file_name": "other-user.csv",
    })
    summaries = [
        {
            "csv_upload_id": upload_id,
            "user_id": user_id,
            "total_revenue": index * 100,
            "top_customers": [{"customer_id": "private-id", "revenue": 100}],
        }
        for index, upload_id in enumerate(upload_ids)
    ]
    fake_db = SimpleNamespace(
        csv_uploads=Collection(uploads),
        analysis_summaries=Collection(summaries),
    )

    with patch("controllers.analysis_controller.get_db", return_value=fake_db):
        context = get_insight_context(str(user_id), str(upload_ids[2]))

    assert [item["analysis"]["total_revenue"] for item in context] == [0, 100, 200]
    assert all("top_customers" not in item["analysis"] for item in context)


def test_openrouter_service_sends_configured_model_and_returns_insight_objects():
    class Response:
        def __enter__(self):
            return self

        def __exit__(self, *_args):
            return False

        def read(self):
            content = json.dumps({"insights": [{
                "type": "trend",
                "title": "Revenue rose",
                "description": "Revenue increased from the previous period.",
                "recommendation": "Monitor demand before increasing stock.",
            }]})
            return json.dumps({
                "choices": [{"message": {"content": content}}]
            }).encode()

    with patch("services.openrouter_service.urlopen", return_value=Response()) as request:
        result = generate_insights(
            [{"analysis": {"total_revenue": 100}}],
            api_key="test-key",
            model="test/model",
        )

    assert result == [{
        "type": "trend",
        "title": "Revenue rose",
        "description": "Revenue increased from the previous period.",
        "recommendation": "Monitor demand before increasing stock.",
    }]
    sent_request = request.call_args.args[0]
    assert sent_request.get_header("Authorization") == "Bearer test-key"
    payload = json.loads(sent_request.data)
    assert payload["model"] == "test/model"
    assert payload["response_format"] == {"type": "json_object"}
    assert payload["max_tokens"] == 1800
    assert "2-4 sentences" in payload["messages"][0]["content"]


def test_openrouter_service_rejects_invalid_insight_response_shape():
    class Response:
        def __enter__(self):
            return self

        def __exit__(self, *_args):
            return False

        def read(self):
            content = json.dumps({
                "insights": [{"type": "trend", "title": "Missing fields"}]
            })
            return json.dumps({
                "choices": [{"message": {"content": content}}]
            }).encode()

    with patch("services.openrouter_service.urlopen", return_value=Response()):
        with pytest.raises(OpenRouterError, match="invalid insight object"):
            generate_insights([], api_key="test-key", model="test/model")


def test_openrouter_service_rejects_non_array_response():
    class Response:
        def __enter__(self):
            return self

        def __exit__(self, *_args):
            return False

        def read(self):
            content = json.dumps({"unexpected": []})
            return json.dumps({
                "choices": [{"message": {"content": content}}]
            }).encode()

    with patch("services.openrouter_service.urlopen", return_value=Response()):
        with pytest.raises(OpenRouterError, match="must contain an insights array"):
            generate_insights([], api_key="test-key", model="test/model")


def test_openrouter_service_includes_provider_error_without_exposing_api_key():
    error = HTTPError(
        "https://openrouter.ai/api/v1/chat/completions",
        400,
        "Bad Request",
        hdrs=None,
        fp=BytesIO(json.dumps({
            "error": {
                "message": "Invalid request with test-key: unsupported response format"
            }
        }).encode()),
    )

    with patch("services.openrouter_service.urlopen", side_effect=error):
        with pytest.raises(OpenRouterError) as raised:
            generate_insights([], api_key="test-key", model="test/model")

    assert "HTTP 400" in str(raised.value)
    assert "unsupported response format" in str(raised.value)
    assert "test-key" not in str(raised.value)


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


NEW_COLUMNS_HEADER = (
    b"order_id,order_date,product,category,region,units,revenue,"
    b"product_id,customer_id,customer_segment,unit_price,unit_cost,profit\n"
)


def test_csv_parser_stores_optional_columns_when_present():
    content = (
        b"Order_ID,Order_Date,Product,Category,Region,Units,Revenue,"
        b" Product_ID ,Customer_ID,Customer_Segment,Unit_Price,Unit_Cost,Profit\n"
        b"1,2026-01-05,Widget,Hardware,North,2,120.00,SKU-1,C-01,VIP,60.00,40.00,40.00\n"
    )

    records, errors, invalid_count = parse_sales_csv(content)

    assert errors == [] and invalid_count == 0
    assert records[0]["product_id"] == "SKU-1"
    assert records[0]["customer_id"] == "C-01"
    assert records[0]["customer_segment"] == "VIP"
    assert records[0]["unit_price"] == 60.0
    assert records[0]["unit_cost"] == 40.0
    assert records[0]["profit"] == 40.0


def test_csv_parser_old_format_has_no_optional_fields():
    records, errors, _ = parse_sales_csv(
        b"order_id,order_date,product,category,region,units,revenue\n"
        b"1,2026-01-05,Widget,Hardware,North,2,30.50\n"
    )

    assert errors == []
    for column in ("product_id", "customer_id", "customer_segment", "unit_price", "unit_cost", "profit"):
        assert column not in records[0]


def test_csv_parser_skips_blank_optional_cells():
    records, errors, _ = parse_sales_csv(
        NEW_COLUMNS_HEADER
        + b"1,2026-01-05,Widget,Hardware,North,2,100,,,,,,\n"
        + b"2,2026-01-06,Widget,Hardware,North,1,50,SKU-1,C-02,New,50,,\n"
    )

    assert errors == []
    assert "customer_id" not in records[0] and "profit" not in records[0]
    assert records[1]["customer_segment"] == "New"
    assert "unit_cost" not in records[1] and "profit" not in records[1]


def test_csv_parser_derives_profit_from_unit_cost_and_allows_losses():
    records, errors, _ = parse_sales_csv(
        NEW_COLUMNS_HEADER
        + b"1,2026-01-05,Widget,Hardware,North,2,120,,,,60,40,\n"
        + b"2,2026-01-06,Widget,Hardware,North,2,50,,,,25,40,\n"
        + b"3,2026-01-07,Widget,Hardware,North,1,10,,,,10,,-5.5\n"
    )

    assert errors == []
    assert records[0]["profit"] == 40.0
    assert records[1]["profit"] == -30.0
    assert records[2]["profit"] == -5.5


def test_csv_parser_rejects_invalid_optional_values_row_by_row():
    long_value = b"x" * 256
    content = (
        NEW_COLUMNS_HEADER
        + b"1,2026-01-05,Widget,Hardware,North,1,10,,,,abc,,\n"
        + b"2,2026-01-05,Widget,Hardware,North,1,10,,,,-1,,\n"
        + b"3,2026-01-05,Widget,Hardware,North,1,10,,,,,-4,\n"
        + b"4,2026-01-05,Widget,Hardware,North,1,10,,,,,,nan\n"
        + b"5,2026-01-05,Widget,Hardware,North,1,10,,,,,,1e999\n"
        + b"6,2026-01-05,Widget,Hardware,North,1,10,," + long_value + b",,,,\n"
        + b"7,2026-01-05,Widget,Hardware,North,1,10,SKU-1,C-1,VIP,10,4,6\n"
    )

    records, errors, invalid_count = parse_sales_csv(content)

    assert len(records) == 1 and records[0]["order_id"] == "7"
    assert invalid_count == 6
    assert [error["row"] for error in errors] == [2, 3, 4, 5, 6, 7]
    assert "unit_price must be a number" in errors[0]["error"]
    assert "unit_price must be a non-negative number" in errors[1]["error"]
    assert "unit_cost must be a non-negative number" in errors[2]["error"]
    assert "profit must be a finite number" in errors[3]["error"]
    assert "profit must be a finite number" in errors[4]["error"]
    assert "customer_id must be at most 255 characters" in errors[5]["error"]


def test_summary_includes_segment_customer_and_profit_metrics():
    records, _, _ = parse_sales_csv(
        NEW_COLUMNS_HEADER
        + b"1,2026-01-05,Widget,Hardware,North,2,120,SKU-1,C-01,VIP,60,40,\n"
        + b"2,2026-01-06,Gadget,Accessories,South,1,80,SKU-2,C-02,New,80,,30\n"
        + b"3,2026-01-07,Widget,Hardware,North,1,60,SKU-1,C-01,VIP,60,40,\n"
        + b"4,2026-01-08,Gadget,Accessories,South,1,20,,,,,,\n"
    )

    summary = build_summary(records)

    assert summary["revenue_by_segment"] == [
        {"customer_segment": "VIP", "revenue": 180, "units": 3},
        {"customer_segment": "New", "revenue": 80, "units": 1},
    ]
    assert summary["total_customers"] == 2
    assert summary["top_customers"][0] == {"customer_id": "C-01", "revenue": 180, "units": 3}
    # Profit only counts rows that have it: 40 + 30 + 20 = 90 on revenue 120 + 80 + 60 = 260.
    assert summary["total_profit"] == 90
    assert summary["profit_margin"] == round(90 / 260 * 100, 2)
    # The original metrics still include every row.
    assert summary["total_revenue"] == 280
    assert summary["total_orders"] == 4


def test_summary_new_metrics_are_empty_when_file_has_no_optional_columns():
    records, _, _ = parse_sales_csv(
        b"order_id,order_date,product,category,region,units,revenue\n"
        b"1,2026-01-05,Widget,Hardware,North,2,100\n"
    )

    summary = build_summary(records)

    assert summary["revenue_by_segment"] == []
    assert summary["total_customers"] == 0
    assert summary["top_customers"] == []
    assert summary["total_profit"] is None
    assert summary["profit_margin"] is None


def test_upload_persists_and_returns_the_new_columns():
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
        NEW_COLUMNS_HEADER
        + b"1,2026-01-05,Widget,Hardware,North,2,120,SKU-1,C-01,VIP,60,40,\n"
    )

    with patch("controllers.analysis_controller.get_db", return_value=fake_db):
        result, status = upload_csv("507f1f77bcf86cd799439011", "sales.csv", content)

    stored = fake_db.sales_records.documents[0]
    assert status == 201
    assert stored["product_id"] == "SKU-1"
    assert stored["customer_id"] == "C-01"
    assert stored["customer_segment"] == "VIP"
    assert stored["unit_price"] == 60.0
    assert stored["unit_cost"] == 40.0
    assert stored["profit"] == 40.0
    assert result["analysis"]["total_profit"] == 40
    assert result["analysis"]["revenue_by_segment"][0]["customer_segment"] == "VIP"
    assert fake_db.analysis_summaries.documents[0]["total_customers"] == 1


def test_database_schema_declares_the_new_optional_fields():
    from init_db import ANALYSIS_SUMMARIES, SALES_RECORDS

    for column in ("product_id", "customer_id", "customer_segment", "unit_price", "unit_cost", "profit"):
        assert column in SALES_RECORDS["properties"]
        assert column not in SALES_RECORDS["required"]
    for key in ("revenue_by_segment", "total_customers", "top_customers", "total_profit", "profit_margin"):
        assert key in ANALYSIS_SUMMARIES["properties"]
        assert key not in ANALYSIS_SUMMARIES["required"]