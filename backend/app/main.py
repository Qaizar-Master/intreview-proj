from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import practices


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Practice Sessions API",
    description="Manage communication practice sessions.",
    version="1.0.0",
    lifespan=lifespan,
)

# The mobile app is served from a different origin than this API, so the browser
# preview needs CORS. Wide open is fine for a local dev project.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(practices.router)


@app.get("/health", tags=["health"])
def health() -> dict[str, str]:
    """Quick check that the API is reachable which is handy from the phone's browser."""
    return {"status": "ok"}
