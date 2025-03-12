from sqlalchemy import Column, Integer, Boolean, DateTime, String
from sqlalchemy.sql import func

from app.core.database import Base


class DiceRollHistory(Base):
    __tablename__ = "dice_rolls"

    id = Column(Integer, primary_key=True, index=True)
    game_id = Column(
        String, index=True, nullable=True
    )  # Nullable for now until game system is implemented
    die1 = Column(Integer, nullable=False)
    die2 = Column(Integer, nullable=False)
    is_doubles = Column(Boolean, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
