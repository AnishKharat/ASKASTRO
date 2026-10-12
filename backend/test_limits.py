import pytest
from fastapi import HTTPException

import limits


@pytest.fixture(autouse=True)
def reset():
    limits._hits.clear()
    limits._spent["tokens"] = 0


def test_per_user_rate_limit(monkeypatch):
    monkeypatch.setenv("RATE_LIMIT_PER_MIN", "2")
    limits.check("a")
    limits.check("a")
    with pytest.raises(HTTPException) as e:
        limits.check("a")
    assert e.value.status_code == 429
    limits.check("b")  # other users unaffected


def test_daily_cap(monkeypatch):
    monkeypatch.setenv("DAILY_TOKEN_CAP", "10")
    limits.check("a")
    limits.record(400)
    with pytest.raises(HTTPException):
        limits.check("b")
