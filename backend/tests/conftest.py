import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from typing import Generator

from app.core.database import Base, get_db
from app.core.test_config import (
    TEST_SQLALCHEMY_DATABASE_URL,
    test_engine,
    override_get_db,
    test_settings
)
from app.main import create_app
from app.core.config import settings

@pytest.fixture(scope="session")
def app():
    """Create a fresh database on each test case"""
    Base.metadata.create_all(bind=test_engine)
    app = create_app()
    # Override dependencies
    app.dependency_overrides[get_db] = override_get_db
    yield app
    Base.metadata.drop_all(bind=test_engine)

@pytest.fixture(scope="session")
def client(app) -> Generator:
    """Create a test client using the test database"""
    client = TestClient(app)
    yield client

@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database session for each test"""
    connection = test_engine.connect()
    transaction = connection.begin()
    session = sessionmaker(bind=connection)()

    yield session

    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture(scope="function")
def client_and_db(client, db_session):
    """Return both client and db session"""
    return client, db_session 