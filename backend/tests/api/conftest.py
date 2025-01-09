"""API testing configuration and fixtures."""

import pytest
from typing import AsyncGenerator, Callable, Any
from httpx import AsyncClient
from fastapi import FastAPI
from sqlalchemy.ext.asyncio import AsyncSession

from apps.main import app
from tests.conftest import client

@pytest.fixture
def async_client(client) -> AsyncClient:
    """Create an async client for testing."""
    return AsyncClient(app=app, base_url="http://test")

@pytest.fixture
def api_url() -> Callable[[str], str]:
    """Create a function to generate API URLs."""
    def _make_url(path: str) -> str:
        """Generate a full API URL from a path."""
        # Remove leading slash if present
        path = path.lstrip("/")
        return f"/api/v1/{path}"
    return _make_url

@pytest.fixture
def auth_headers() -> dict[str, str]:
    """Create authentication headers for testing."""
    # TODO: Implement actual authentication
    return {"Authorization": "Bearer test-token"}

@pytest.fixture
async def test_data(db_session: AsyncSession) -> AsyncGenerator[dict[str, Any], None]:
    """Create test data for API tests."""
    data = {
        "user": {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpassword123"
        }
    }
    
    # TODO: Add test data setup logic here
    
    yield data
    
    # TODO: Add cleanup logic here 