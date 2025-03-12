from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from typing import Any, Dict, Optional


class AppError(HTTPException):
    def __init__(
        self, status_code: int, message: str, details: Optional[Dict[str, Any]] = None
    ) -> None:
        super().__init__(
            status_code=status_code, detail={"message": message, "details": details}
        )


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
    return JSONResponse(status_code=exc.status_code, content=exc.detail)
