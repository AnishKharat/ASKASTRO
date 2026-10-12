import json
import os
import uuid
from pathlib import Path
from typing import Literal

from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from llm import generate

load_dotenv()

_prompt = Path(__file__).parent / "prompts" / "system.md"
# shortcut: inline fallback until prompts/system.md exists (next feature).
SYSTEM = _prompt.read_text(encoding="utf-8") if _prompt.exists() else "You are AskAstro, a warm astrology guide."

app = FastAPI(title="AskAstro API")

# shortcut: CORS origins come from env, default "*" for dev; set real origins before deploying.
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

v1 = APIRouter(prefix="/v1")


@v1.get("/health")
def health():
    return {"status": "ok"}


@v1.post("/session")
def session():
    return {"user_id": str(uuid.uuid4())}


class Message(BaseModel):
    id: str
    conversationId: str
    role: Literal["user", "assistant"]
    content: str
    createdAt: str


class ChatRequest(BaseModel):
    messages: list[Message]


def trim(messages: list[dict], budget: int) -> list[dict]:
    """Keep the newest messages within budget (~4 chars/token); history must start with a user turn."""
    kept, used = [], 0
    for m in reversed(messages):
        used += len(m["content"]) // 4 + 1
        if used > budget and kept:
            break
        kept.append(m)
    kept.reverse()
    while kept and kept[0]["role"] != "user":
        kept.pop(0)
    return kept


@v1.post("/chat")
async def chat(req: ChatRequest, x_user_id: str = Header()):
    msgs = trim([{"role": m.role, "content": m.content} for m in req.messages],
                int(os.getenv("CHAT_TOKEN_BUDGET", "3000")))
    if not msgs or msgs[-1]["role"] != "user":
        raise HTTPException(422, "Last message must be from the user")

    async def events():
        try:
            async for text in generate(msgs, SYSTEM):
                yield f"data: {json.dumps({'delta': text})}\n\n"
        except Exception:
            yield f"data: {json.dumps({'error': 'generation_failed'})}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(events(), media_type="text/event-stream")


app.include_router(v1)
