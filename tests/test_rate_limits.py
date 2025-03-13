from datetime import datetime
import time
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from fastapi_mail import ConnectionConfig, FastMail

def setup_test_app():
    """Set up a test FastAPI application with test configuration"""
    from app.main import app
    from app.core.config import Settings

    # Override settings for testing
    app.dependency_overrides[Settings] = lambda: Settings(
        DATABASE_URL="sqlite:///./test.db",
        SECRET_KEY="test_secret_key",
        LOGIN_RATE_LIMIT="100/minute",  # Higher limit for testing
        REGISTER_RATE_LIMIT="100/minute",  # Higher limit for testing
        MAIL_USERNAME="test@example.com",
        MAIL_PASSWORD="test_password",
        MAIL_FROM="test@example.com",
        MAIL_PORT=587,
        MAIL_SERVER="smtp.example.com",
        MAIL_SSL_TLS=True,
        MAIL_STARTTLS=True,
        USE_CREDENTIALS=True
    )
    
    return app

@patch('app.services.email_service.FastMail')
@patch('app.services.email_service.ConnectionConfig')
def test_registration_rate_limit(mock_connection_config, mock_fastmail):
    """Test registration endpoint rate limiting (100/minute in test config)"""
    print(f"\nTesting registration rate limit at {datetime.now()}")

    # Mock the email service components
    mock_config = MagicMock()
    mock_connection_config.return_value = mock_config
    mock_fastmail_instance = MagicMock()
    mock_fastmail.return_value = mock_fastmail_instance
    mock_fastmail_instance.send_message = MagicMock()

    # Create a test database
    from sqlalchemy import create_engine
    from app.core.database import Base
    engine = create_engine("sqlite:///./test.db")
    Base.metadata.create_all(bind=engine)

    app = setup_test_app()
    client = TestClient(app)

    # Test data
    test_user_template = {
        "email": "test{}@example.com",
        "username": "testuser{}",
        "password": "Test123!@#"
    }

    # Make requests (should succeed until rate limit)
    responses = []
    for i in range(101):  # Try one more than the limit
        test_user = {
            "email": test_user_template["email"].format(i),
            "username": test_user_template["username"].format(i),
            "password": test_user_template["password"]
        }

        start_time = time.time()
        response = client.post("/api/auth/register", json=test_user)
        end_time = time.time()

        responses.append({
            "status_code": response.status_code,
            "response_time": end_time - start_time
        })

        # Check if we hit the rate limit
        if response.status_code == 429:
            print(f"Rate limit hit after {i + 1} requests")
            break

    # Clean up test database
    import os
    if os.path.exists("test.db"):
        os.remove("test.db")

    # Verify rate limiting behavior
    assert any(r["status_code"] == 429 for r in responses), "Rate limit was never hit"
    success_count = sum(1 for r in responses if r["status_code"] == 200)
    assert success_count == 100, f"Expected 100 successful requests before rate limit, got {success_count}"

@patch('app.services.email_service.FastMail')
@patch('app.services.email_service.ConnectionConfig')
def test_login_rate_limit(mock_connection_config, mock_fastmail):
    """Test login endpoint rate limiting (100/minute in test config)"""
    print(f"\nTesting login rate limit at {datetime.now()}")

    # Mock the email service components
    mock_config = MagicMock()
    mock_connection_config.return_value = mock_config
    mock_fastmail_instance = MagicMock()
    mock_fastmail.return_value = mock_fastmail_instance
    mock_fastmail_instance.send_message = MagicMock()

    # Create a test database
    from sqlalchemy import create_engine
    from app.core.database import Base
    engine = create_engine("sqlite:///./test.db")
    Base.metadata.create_all(bind=engine)

    app = setup_test_app()
    client = TestClient(app)

    # Test credentials
    test_creds = {
        "username": "test@example.com",
        "password": "wrongpassword"
    }

    # Make requests (should succeed until rate limit)
    responses = []
    for i in range(101):  # Try one more than the limit
        start_time = time.time()
        response = client.post("/api/auth/token", data=test_creds)
        end_time = time.time()

        responses.append({
            "status_code": response.status_code,
            "response_time": end_time - start_time
        })

        # Check if we hit the rate limit
        if response.status_code == 429:
            print(f"Rate limit hit after {i + 1} requests")
            break

    # Clean up test database
    import os
    if os.path.exists("test.db"):
        os.remove("test.db")

    # Verify rate limiting behavior
    assert any(r["status_code"] == 429 for r in responses), "Rate limit was never hit"
    attempts_before_limit = sum(1 for r in responses if r["status_code"] in [200, 401])
    assert attempts_before_limit == 100, f"Expected 100 attempts before rate limit, got {attempts_before_limit}" 