from sqlalchemy import Column, String, DateTime, JSON, Boolean, ForeignKey
from sqlalchemy.sql import func
from uuid import uuid4
from sqlalchemy.orm import relationship

from app.core.database import Base


class Game(Base):
    __tablename__ = "games"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid4()))
    state = Column(JSON, nullable=False)  # Current game state
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_local = Column(Boolean, nullable=False, default=False)
    creator_id = Column(String, ForeignKey("users.id"), nullable=True)
    white_player_id = Column(String, ForeignKey("users.id"), nullable=True)
    black_player_id = Column(String, ForeignKey("users.id"), nullable=True)

    # Relationships
    creator = relationship("User", foreign_keys=[creator_id], back_populates="created_games")
    white_player = relationship("User", foreign_keys=[white_player_id], back_populates="games_as_white")
    black_player = relationship("User", foreign_keys=[black_player_id], back_populates="games_as_black")
