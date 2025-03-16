from fastapi import Request
from fastapi.responses import JSONResponse
from typing import Any, Dict, Optional
from app.core.config import settings


class AppError(Exception):
    def __init__(self, status_code: int, message: str, details: dict = None):
        self.status_code = status_code
        self.message = message
        self.details = details or {}


class GameError(AppError):
    """Base exception for game-related errors"""

    pass


class InvalidMoveError(GameError):
    def __init__(
        self, message: str = "Invalid move", details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(status_code=400, message=message, details=details)


class GameNotFoundError(GameError):
    def __init__(
        self, message: str = "Game not found", details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(status_code=404, message=message, details=details)


async def error_handler(request: Request, exc: AppError) -> JSONResponse:
    response = JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.message,
            "details": exc.details,
        },
    )
    # Add CORS headers to error responses
    response.headers["Access-Control-Allow-Origin"] = ", ".join(settings.BACKEND_CORS_ORIGINS)
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response
