from fastapi.testclient import TestClient

import main

M = {"id": "1", "conversationId": "c", "createdAt": "now"}


def test_trim_drops_oldest_and_starts_with_user():
    msgs = [{"role": "user", "content": "a" * 400}, {"role": "assistant", "content": "b" * 400},
            {"role": "user", "content": "c" * 40}]
    out = main.trim(msgs, 120)
    assert [m["role"] for m in out] == ["user"] and out[0]["content"] == "c" * 40


def test_chat_streams_sse(monkeypatch):
    async def fake(messages, system):
        yield "Hel"
        yield "lo"

    monkeypatch.setattr(main, "generate", fake)
    r = TestClient(main.app).post("/v1/chat", headers={"X-User-Id": "u"},
                                  json={"messages": [{**M, "role": "user", "content": "hi"}]})
    assert r.text == 'data: {"delta": "Hel"}\n\ndata: {"delta": "lo"}\n\ndata: [DONE]\n\n'


def test_chat_requires_user_id_and_user_last():
    c = TestClient(main.app)
    body = {"messages": [{**M, "role": "assistant", "content": "x"}]}
    assert c.post("/v1/chat", json=body).status_code == 422
    assert c.post("/v1/chat", headers={"X-User-Id": "u"}, json=body).status_code == 422
