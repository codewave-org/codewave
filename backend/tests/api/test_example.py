"""Example API test using the base test class."""

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from tests.api.base import BaseAPITest


@pytest.mark.asyncio
class TestExampleAPI(BaseAPITest):
    """Test example API endpoints."""

    async def test_health_check(self) -> None:
        """Test health check endpoint."""
        response = await self.client.get("/health")
        self.assert_status(response, 200)
        assert response.json() == {"status": "ok"}

    async def test_root_endpoint(self) -> None:
        """Test root endpoint."""
        response = await self.client.get("/")
        self.assert_status(response, 200)
        data = response.json()
        assert "name" in data
        assert "version" in data
        assert "environment" in data

    async def test_api_endpoint_without_auth(self) -> None:
        """Test API endpoint without authentication."""
        response = await self.client.get("/api/v1/test")
        self.assert_status(response, 200)
        assert response.json() == {"message": "Hello from CodeWave!"}

    @pytest.mark.parametrize(
        "path,expected_status",
        [
            ("/nonexistent", 404),
            ("/api/v1/nonexistent", 404),
        ],
    )
    async def test_nonexistent_endpoints(self, path: str, expected_status: int) -> None:
        """Test accessing nonexistent endpoints."""
        response = await self.client.get(path)
        self.assert_status(response, expected_status)
