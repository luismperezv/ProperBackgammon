from pydantic import BaseModel, EmailStr, Field, HttpUrl
from datetime import datetime
from typing import Optional


class UserStatsBase(BaseModel):
    games_played: int = 0
    games_won: int = 0
    games_lost: int = 0
    elo_rating: float = 1000.0
    win_streak: int = 0


class UserStatsRead(UserStatsBase):
    id: int
    user_id: int
    join_date: datetime

    class Config:
        from_attributes = True


class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    display_name: Optional[str] = Field(None, min_length=2, max_length=50)
    avatar_url: Optional[HttpUrl] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)


class UserUpdate(BaseModel):
    display_name: Optional[str] = Field(None, min_length=2, max_length=50)
    avatar_url: Optional[HttpUrl] = None
    email: Optional[EmailStr] = None


class UserRead(UserBase):
    id: int
    created_at: datetime
    last_login: Optional[datetime] = None
    stats: Optional[UserStatsRead] = None

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str 