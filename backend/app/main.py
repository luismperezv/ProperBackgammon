from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import datetime
import time
from app.api import api_router
from app.models import init_db
from app.core.config import settings
from app.core.errors import AppError, error_handler


def create_app() -> FastAPI:
    app = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION)

    # Initialize database
    init_db()

    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Add error handlers
    app.add_exception_handler(AppError, error_handler)

    # Include the API router
    app.include_router(api_router, prefix=settings.API_V1_STR)

    return app


app = create_app()


@app.get("/")
async def root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME}",
        "version": settings.VERSION,
    }


@app.get("/api")
async def api_root():
    return {
        "status": "ok",
        "version": settings.VERSION,
        "endpoints": ["/api/health", "/api/game"],
    }


@app.get("/api/health")
async def health_check():
    try:
        return {
            "status": "healthy",
            "timestamp": datetime.datetime.now().isoformat(),
            "uptime": time.time() - START_TIME,
            "version": settings.VERSION,
        }
    except Exception as e:
        raise AppError(
            status_code=500, message="Health check failed", details={"error": str(e)}
        )


START_TIME = time.time()


@app.get("/api/game")
async def list_games():
    return {"status": "ok", "games": []}  # TODO: Implement game listing
