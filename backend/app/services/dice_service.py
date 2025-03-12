from random import randint
from typing import Tuple, Optional
from sqlalchemy.orm import Session

from app.models.dice import DiceRollHistory


class DiceService:
    def __init__(self, db: Session):
        self.db = db

    def roll_dice(self, game_id: Optional[str] = None) -> Tuple[int, int]:
        """
        Roll two six-sided dice, store the result in the database, and return their values.
        Args:
            game_id: Optional identifier for the game this roll belongs to
        Returns:
            A tuple of (die1, die2) where each die is a number between 1 and 6.
        """
        die1 = randint(1, 6)
        die2 = randint(1, 6)

        # Store the roll in the database
        dice_roll = DiceRollHistory(
            game_id=game_id, die1=die1, die2=die2, is_doubles=die1 == die2
        )
        self.db.add(dice_roll)
        self.db.commit()

        return (die1, die2)

    def get_roll_history(
        self, limit: int = 10, game_id: Optional[str] = None
    ) -> list[DiceRollHistory]:
        """
        Get the most recent dice rolls.
        Args:
            limit: Maximum number of rolls to return
            game_id: Optional game ID to filter rolls by
        Returns:
            List of dice rolls, ordered by most recent first
        """
        query = self.db.query(DiceRollHistory)

        if game_id is not None:
            query = query.filter(DiceRollHistory.game_id == game_id)

        return query.order_by(DiceRollHistory.timestamp.desc()).limit(limit).all()
