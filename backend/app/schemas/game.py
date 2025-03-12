from pydantic import BaseModel
from datetime import datetime
from typing import Dict, Any, Literal


class GameCreate(BaseModel):
    state: Dict[str, Any]


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
