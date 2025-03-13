import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from datetime import datetime
import time

from app.core.database import Base, get_db
from app.core.test_config import (
    test_engine,
    override_get_db,
    test_settings
)
from app.main import create_app

def setup_test_app():
    """Create a test app with test database and settings"""
    Base.metadata.create_all(bind=test_engine)
    app = create_app()
    app.dependency_overrides[get_db] = override_get_db
    return app

def test_registration_rate_limit():
    """Test registration endpoint rate limiting (100/minute in test config)"""
    print(f"\nTesting registration rate limit at {datetime.now()}")
    
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
        elapsed = time.time() - start_time
        
        print(f"Request {i+1}: Status {response.status_code}, Time: {elapsed:.2f}s")
        responses.append(response.status_code)
        
        if response.status_code == 429:
            print("Rate limit exceeded as expected!")
            break
            
        time.sleep(0.1)  # Small delay between requests
    
    # Verify that we hit the rate limit
    assert 429 in responses, "Rate limit was not triggered"
    
def test_login_rate_limit():
    """Test login endpoint rate limiting (100/minute in test config)"""
    print(f"\nTesting login rate limit at {datetime.now()}")
    
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
        elapsed = time.time() - start_time
        
        print(f"Request {i+1}: Status {response.status_code}, Time: {elapsed:.2f}s")
        responses.append(response.status_code)
        
        if response.status_code == 429:
            print("Rate limit exceeded as expected!")
            break
            
        time.sleep(0.1)  # Small delay between requests
    
    # Verify that we hit the rate limit
    assert 429 in responses, "Rate limit was not triggered" 