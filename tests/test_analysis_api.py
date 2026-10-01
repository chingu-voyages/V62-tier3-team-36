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