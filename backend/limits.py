import os
import time
from collections import defaultdict, deque
from datetime import date

from fastapi import HTTPException

# shortcut: in-memory, single process; resets on restart. Move to Redis/Postgres when running >1 worker.
_hits: dict[str, deque] = defaultdict(deque)
_spent = {"day": date.today(), "tokens": 0}


def check(user_id: str) -> None:
    """Raise 429 if the user is over the per-minute limit or the global daily token cap is hit."""
    now = time.monotonic()
    q = _hits[user_id]
    while q and now - q[0] > 60:
        q.popleft()
    if len(q) >= int(os.getenv("RATE_LIMIT_PER_MIN", "10")):
        raise HTTPException(429, "Too many requests, slow down")
    if _spent["day"] != date.today():
        _spent.update(day=date.today(), tokens=0)
    if _spent["tokens"] >= int(os.getenv("DAILY_TOKEN_CAP", "500000")):
        raise HTTPException(429, "Daily limit reached, try again tomorrow")
    q.append(now)


def record(chars: int) -> None:
    """Add usage (~4 chars/token) toward the daily cap."""
    _spent["tokens"] += chars // 4 + 1
