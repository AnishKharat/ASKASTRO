import asyncio

import pytest

import llm


def test_parsers():
    assert llm._delta_claude({"type": "content_block_delta", "delta": {"text": "hi"}}) == "hi"
    assert llm._delta_claude({"type": "message_start"}) == ""
    assert llm._delta_openai({"choices": [{"delta": {"content": "yo"}}]}) == "yo"
    assert llm._delta_openai({"choices": [{"delta": {}}]}) == ""


def test_unknown_provider(monkeypatch):
    monkeypatch.setenv("LLM_PROVIDER", "nope")

    async def run():
        async for _ in llm.generate([], ""):
            pass

    with pytest.raises(ValueError):
        asyncio.run(run())
