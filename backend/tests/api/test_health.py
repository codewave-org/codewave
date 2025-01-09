"""Health check API tests."""

import pytest
from httpx import AsyncClient

from tests.constants import HTTP_200_OK


@pytest.mark.asyncio
async def test_health_check(client: AsyncClient) -> None:
    """Test health check endpoint."""
    response = await client.get("/health")
    assert response.status_code == HTTP_200_OK
    assert response.json() == {"status": "ok"}


@pytest.mark.asyncio
async def test_root_endpoint(client: AsyncClient) -> None:
    """Test root endpoint."""
    response = await client.get("/")
    assert response.status_code == HTTP_200_OK
    data = response.json()
    assert "version" in data
    assert "status" in data
