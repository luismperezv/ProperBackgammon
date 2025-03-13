from pydantic import BaseModel
from datetime import datetime
from typing import Dict, Any, Literal, Optional, Tuple


class Point(BaseModel):
    count: int
    color: Literal["white", "black"]


class DiceState(BaseModel):
    values: Optional[Tuple[int, int]] = None  # The current roll, None if dice haven't been rolled
    used_values: list[int] = []  # Track which dice values have been used for moves


class GameState(BaseModel):
    points: Dict[int, Point]
    bar: Dict[Literal["white", "black"], int]
    home: Dict[Literal["white", "black"], int]
    current_turn: Literal["white", "black"]  # Whose turn it is
    dice_state: DiceState  # Current dice roll state


class GameCreate(BaseModel):
    state: GameState


class MoveRequest(BaseModel):
    from_point: int
    to_point: int
    color: Literal["white", "black"]


class Game(GameCreate):
    id: str
    created_at: datetime
    updated_at: datetime | None

    class Config:
        from_attributes = True
