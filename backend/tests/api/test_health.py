"""Test health check endpoint."""
import pytest
from httpx import AsyncClient
from starlette.testclient import TestClient


def test_health_check_sync(client: TestClient):
    """Test health check endpoint synchronously."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@pytest.mark.asyncio
async def test_health_check_async(client: TestClient):
    """Test health check endpoint asynchronously."""
    async with AsyncClient(base_url="http://test", follow_redirects=True) as ac:
        response = await ac.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"} 