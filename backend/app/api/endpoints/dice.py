from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.services.dice_service import DiceService
from app.schemas.dice import DiceRoll

router = APIRouter()


@router.post("/roll", response_model=DiceRoll)
async def roll_dice(game_id: Optional[str] = None, db: Session = Depends(get_db)):
    """
    Roll two six-sided dice and return their values.
    Args:
        game_id: Optional identifier for the game this roll belongs to
    Returns:
        A DiceRoll object containing the values of both dice and whether they are doubles.
    The roll is automatically stored in the database for historical tracking.
    """
    dice_service = DiceService(db)
    dice_values = dice_service.roll_dice(game_id)
    return DiceRoll.from_tuple(dice_values)


@router.get("/history", response_model=List[DiceRoll])
async def get_roll_history(
    limit: int = 10, game_id: Optional[str] = None, db: Session = Depends(get_db)
):
    """
    Get the most recent dice rolls from the history.
    Args:
        limit: Maximum number of rolls to return (default: 10)
        game_id: Optional game ID to filter rolls by
    Returns:
        List of dice rolls, ordered by most recent first
    """
    dice_service = DiceService(db)
    history = dice_service.get_roll_history(limit, game_id)
    return [
        DiceRoll(die1=roll.die1, die2=roll.die2, is_doubles=roll.is_doubles)
        for roll in history
    ]
