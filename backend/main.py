import os
import uuid

from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

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


app.include_router(v1)
