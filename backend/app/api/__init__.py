from fastapi import APIRouter
from app.api.endpoints import dice, game

api_router = APIRouter()

api_router.include_router(dice.router, prefix="/dice", tags=["dice"])
api_router.include_router(game.router, prefix="/game", tags=["game"]) 