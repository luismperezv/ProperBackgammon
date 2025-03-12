from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    PROJECT_NAME: str = "Backgammon Game API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # CORS Configuration
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]
    
    # Database
    DATABASE_URL: str = "sqlite:///backgammon.db"
    
    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings() 