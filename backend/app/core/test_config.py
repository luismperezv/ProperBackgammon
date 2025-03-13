from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings

# Use SQLite for testing
TEST_SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

# Create test engine
test_engine = create_engine(
    TEST_SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}  # Needed for SQLite
)

# Create test SessionLocal
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

def override_get_db() -> Generator[Session, None, None]:
    """Dependency to get test database session."""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

# Test settings
test_settings = settings.model_copy(update={
    "DATABASE_URL": TEST_SQLALCHEMY_DATABASE_URL,
    "EMAIL_ENABLED": False,  # Disable email sending in tests
    "REGISTER_RATE_LIMIT": "100/minute",  # Higher rate limits for testing
    "LOGIN_RATE_LIMIT": "100/minute",
    # Email settings
    "MAIL_USERNAME": "test@example.com",
    "MAIL_PASSWORD": "test_password",
    "MAIL_FROM": "test@example.com",
    "MAIL_PORT": 587,
    "MAIL_SERVER": "smtp.example.com",
    "MAIL_SSL_TLS": True,
    "MAIL_STARTTLS": True,
    "FRONTEND_URL": "http://localhost:3000"
}) 