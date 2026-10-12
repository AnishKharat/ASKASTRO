import uuid

from fastapi.testclient import TestClient

from main import app


def test_health():
    r = TestClient(app).get("/v1/health")
    assert r.status_code == 200 and r.json() == {"status": "ok"}


def test_session_unique_ids():
    c = TestClient(app)
    a, b = (c.post("/v1/session").json()["user_id"] for _ in range(2))
    assert a != b and uuid.UUID(a)
