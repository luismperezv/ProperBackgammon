from pydantic import BaseModel

class DiceRoll(BaseModel):
    die1: int
    die2: int
    is_doubles: bool

    @classmethod
    def from_tuple(cls, dice_tuple: tuple[int, int]) -> "DiceRoll":
        die1, die2 = dice_tuple
        return cls(
            die1=die1,
            die2=die2,
            is_doubles=die1 == die2
        ) 