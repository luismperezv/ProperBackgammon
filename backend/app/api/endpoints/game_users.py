from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.api.endpoints.auth import get_current_user
from app.services.game_service import GameService
from app.models.user import User, PieceColor
from app.schemas.user import UserRead

router = APIRouter()

@router.post("/{game_id}/join", response_model=UserRead)
async def join_game(
    game_id: str,
    color: PieceColor,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Join a game with specified color."""
    # Check if game exists
    game_service = GameService(db)
    game = game_service.get_game(game_id)
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")

    # Check if user is already in a game
    if current_user.current_game_id:
        raise HTTPException(
            status_code=400,
            detail="User is already in a game. Leave current game first."
        )

    # Check if color is already taken in this game
    existing_players = db.query(User).filter(User.current_game_id == game_id).all()
    for player in existing_players:
        if player.piece_color == color:
            raise HTTPException(
                status_code=400,
                detail=f"Color {color.value} is already taken in this game"
            )

    # Check if game is full
    if len(existing_players) >= 2:
        raise HTTPException(
            status_code=400,
            detail="Game is full"
        )

    # Join the game
    current_user.current_game_id = game_id
    current_user.piece_color = color
    db.commit()
    db.refresh(current_user)

    return current_user


@router.post("/{game_id}/leave", response_model=UserRead)
async def leave_game(
    game_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Leave the current game."""
    # Check if user is in this game
    if current_user.current_game_id != game_id:
        raise HTTPException(
            status_code=400,
            detail="User is not in this game"
        )

    # Leave the game
    current_user.current_game_id = None
    current_user.piece_color = None
    db.commit()
    db.refresh(current_user)

    return current_user


@router.get("/{game_id}/players", response_model=List[UserRead])
async def get_game_players(
    game_id: str,
    db: Session = Depends(get_db)
):
    """Get all players in a game."""
    # Check if game exists
    game_service = GameService(db)
    game = game_service.get_game(game_id)
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")

    # Get players
    players = db.query(User).filter(User.current_game_id == game_id).all()
    return players 