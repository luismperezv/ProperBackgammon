from pydantic import BaseModel
from datetime import datetime
from typing import Dict, Any, Literal


class Point(BaseModel):
    count: int
    color: Literal["white", "black"]


class GameState(BaseModel):
    points: Dict[int, Point]
    bar: Dict[Literal["white", "black"], int]
    home: Dict[Literal["white", "black"], int]


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
