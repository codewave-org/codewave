"""Test health check endpoint."""
import pytest
from httpx import AsyncClient
from starlette.testclient import TestClient
from typing import AsyncGenerator


def test_health_check_sync(client: TestClient):
    """Test health check endpoint synchronously."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@pytest.mark.asyncio
async def test_health_check_async(async_client: AsyncGenerator[AsyncClient, None]):
    """Test health check endpoint asynchronously."""
    client = await anext(async_client)
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"} 