from app.core.database import Base, engine
from app.models.dice import DiceRollHistory


# Create all tables
def init_db():
    Base.metadata.create_all(bind=engine)


# Import all models here
__all__ = ["DiceRollHistory"]
