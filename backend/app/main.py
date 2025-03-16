from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
import datetime
import time
from app.api import api_router
from app.core.config import settings
from app.core.errors import AppError, error_handler
from app.core.database import Base, engine
from app.core.limiter import limiter
from app.api.endpoints import game, auth, game_users

def create_app() -> FastAPI:
    app = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION)

    # Add rate limiter
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Security headers middleware
    class SecurityHeadersMiddleware(BaseHTTPMiddleware):
        async def dispatch(self, request: Request, call_next):
            response: Response = await call_next(request)
            response.headers["X-Content-Type-Options"] = "nosniff"
            response.headers["X-Frame-Options"] = "DENY"
            response.headers["X-XSS-Protection"] = "1; mode=block"
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
            response.headers["Content-Security-Policy"] = "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; connect-src 'self' https:; font-src 'self' data: https:;"
            response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
            response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=(), payment=()"
            return response

    app.add_middleware(SecurityHeadersMiddleware)

    # Add error handlers
    app.add_exception_handler(AppError, error_handler)

    # Include the API router
    app.include_router(api_router, prefix=settings.API_V1_STR)

    # Include routers
    app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
    app.include_router(game.router, prefix="/api/game", tags=["game"])
    app.include_router(game_users.router, prefix="/api/game-users", tags=["game-users"])

    # Create database tables
    Base.metadata.create_all(bind=engine)

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


START_TIME = time.time()


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


@app.get("/api/game")
async def list_games():
    return {"status": "ok", "games": []}  # TODO: Implement game listing
