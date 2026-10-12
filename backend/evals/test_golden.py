import asyncio
import os
import re

import pytest

from evals.golden import GOLDEN
from llm import generate
from main import SYSTEM

# Real LLM calls cost money: opt in with RUN_EVALS=1 (needs the provider configured in .env).
pytestmark = pytest.mark.skipif(not os.getenv("RUN_EVALS"), reason="set RUN_EVALS=1 to run LLM evals")


async def _reply(prompt: str) -> str:
    return "".join([t async for t in generate([{"role": "user", "content": prompt}], SYSTEM)])


@pytest.mark.parametrize("case", GOLDEN, ids=[g[0] for g in GOLDEN])
def test_golden(case):
    _, prompt, must, must_not = case
    text = asyncio.run(_reply(prompt))
    if must:
        assert re.search(must, text, re.I), text
    for bad in must_not:
        assert not re.search(bad, text, re.I), text
