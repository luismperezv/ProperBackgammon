from sqlalchemy import Column, String, DateTime, JSON
from sqlalchemy.sql import func
from uuid import uuid4

from app.core.database import Base

class Game(Base):
    __tablename__ = "games"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid4()))
    state = Column(JSON, nullable=False)  # Current game state
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now()) 