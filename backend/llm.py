import json
import os
from typing import AsyncIterator

import httpx

MAX_TOKENS = int(os.getenv("LLM_MAX_TOKENS", "600"))


def _delta_claude(data: dict) -> str:
    return data["delta"].get("text", "") if data.get("type") == "content_block_delta" else ""


def _delta_openai(data: dict) -> str:
    return (data["choices"][0]["delta"].get("content") or "") if data.get("choices") else ""


async def _sse(client: httpx.AsyncClient, url: str, headers: dict, body: dict, parse) -> AsyncIterator[str]:
    async with client.stream("POST", url, headers=headers, json=body) as r:
        if r.status_code >= 400:
            await r.aread()
            r.raise_for_status()
        async for line in r.aiter_lines():
            if line.startswith("data: ") and line != "data: [DONE]":
                if text := parse(json.loads(line[6:])):
                    yield text


async def generate(messages: list[dict], system: str) -> AsyncIterator[str]:
    """Yield text deltas. messages: [{"role": "user"|"assistant", "content": str}]."""
    provider = os.getenv("LLM_PROVIDER", "claude")
    model = os.getenv("LLM_MODEL") or ("claude-sonnet-5-5" if provider == "claude" else "llama3.1")
    async with httpx.AsyncClient(timeout=60) as client:
        if provider == "claude":
            headers = {"x-api-key": os.environ["ANTHROPIC_API_KEY"], "anthropic-version": "2023-06-01"}
            body = {"model": model, "system": system, "messages": messages, "max_tokens": MAX_TOKENS, "stream": True}
            gen = _sse(client, "https://api.anthropic.com/v1/messages", headers, body, _delta_claude)
        elif provider == "ollama":
            base = os.getenv("OLLAMA_URL", "http://localhost:11434/v1")
            body = {"model": model, "messages": [{"role": "system", "content": system}, *messages],
                    "max_tokens": MAX_TOKENS, "stream": True}
            gen = _sse(client, f"{base}/chat/completions", {}, body, _delta_openai)
        else:
            raise ValueError(f"Unknown LLM_PROVIDER: {provider}")
        async for text in gen:
            yield text
