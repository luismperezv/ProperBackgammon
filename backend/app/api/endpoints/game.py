from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any

from app.core.database import get_db
from app.services.game_service import GameService
from app.schemas.game import Game, GameCreate, MoveRequest
from app.constants.game import INITIAL_POSITION

router = APIRouter()


@router.post("", response_model=Game)
async def create_game(db: Session = Depends(get_db)):
    """Create a new game with initial state."""
    game_service = GameService(db)
    game_data = GameCreate(state=INITIAL_POSITION)
    return game_service.create_game(game_data)


@router.get("/{game_id}", response_model=Game)
async def get_game(game_id: str, db: Session = Depends(get_db)):
    """Get a game by its ID."""
    game_service = GameService(db)
    game = game_service.get_game(game_id)
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    return game


@router.post("/{game_id}/move", response_model=Game)
async def make_move(game_id: str, move: MoveRequest, db: Session = Depends(get_db)):
    """Validate and execute a move in the game."""
    game_service = GameService(db)
    game = game_service.make_move(game_id, move)
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    return game


@router.put("/{game_id}/state", response_model=Game)
async def update_game_state(
    game_id: str, state: Dict[str, Any], db: Session = Depends(get_db)
):
    """Update the state of an existing game."""
    game_service = GameService(db)
    game = game_service.update_game_state(game_id, state)
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    return game
