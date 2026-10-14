from io import BytesIO

from test_rbac import ADMIN, VIEWER, _login

OTHER_ADMIN = {
    "full_name": "Olga Other",
    "organisation_name": "Other Retail",
    "email": "olga@example.com",
    "password": "OtherPassword123!",
}
CSV = (
    b"order_id,order_date,product,category,region,units,revenue\n"
    b"1,2026-01-05,Widget,Hardware,North,2,30.50\n"
)


def test_uploads_are_shared_inside_a_workspace_and_hidden_from_others(client):
    for account in (ADMIN, OTHER_ADMIN):
        assert client.post("/api/signup", json=account).status_code == 201
    _, admin_headers = _login(client, ADMIN)
    client.post("/api/members", json=VIEWER, headers=admin_headers)
    _, viewer_headers = _login(client, VIEWER)
    _, other_headers = _login(client, OTHER_ADMIN)

    uploaded = client.post(
        "/api/analysis/uploads",
        data={"file": (BytesIO(CSV), "sales.csv")},
        headers=admin_headers,
    )
    assert uploaded.status_code == 201
    detail_url = "/api/analysis/uploads/" + uploaded.get_json()["upload_id"]

    viewer_list = client.get("/api/analysis/uploads", headers=viewer_headers)
    assert len(viewer_list.get_json()["uploads"]) == 1
    viewer_detail = client.get(detail_url, headers=viewer_headers)
    assert viewer_detail.get_json()["analysis"]["total_revenue"] == 30.5

    other_list = client.get("/api/analysis/uploads", headers=other_headers)
    assert other_list.get_json()["uploads"] == []
    assert client.get(detail_url, headers=other_headers).status_code == 404
    assert client.post(detail_url + "/insights", headers=other_headers).status_code == 404
