from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any, Optional

from app.core.database import get_db
from app.services.game_service import GameService
from app.schemas.game import Game, GameCreate, GameState, MoveRequest
from app.constants.game import INITIAL_POSITION

router = APIRouter()


@router.post("", response_model=Game)
async def create_game(game_id: Optional[str] = None, db: Session = Depends(get_db)):
    """Create a new game with initial state."""
    game_service = GameService(db)
    # Convert INITIAL_POSITION to GameState
    initial_state = GameState(**INITIAL_POSITION)
    game_data = GameCreate(state=initial_state)
    return game_service.create_game(game_data, game_id)


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
