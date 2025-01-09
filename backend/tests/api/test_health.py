"""Health check endpoint tests."""

import pytest
from fastapi.testclient import TestClient
from httpx import AsyncClient

from tests.constants import HTTP_200_OK


def test_health_check_sync(client: TestClient) -> None:
    """Test health check endpoint synchronously."""
    response = client.get("/health")
    assert response.status_code == HTTP_200_OK
    assert response.json() == {"status": "ok"}


@pytest.mark.asyncio
async def test_health_check_async(async_client: AsyncClient) -> None:
    """Test health check endpoint asynchronously."""
    response = await async_client.get("/health")
    assert response.status_code == HTTP_200_OK
    assert response.json() == {"status": "ok"}
