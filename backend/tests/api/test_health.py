import pytest
from fastapi.testclient import TestClient
from httpx import AsyncClient

def test_health_check_sync(client: TestClient):
    """Test health check endpoint synchronously."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

@pytest.mark.asyncio
async def test_health_check_async(client: TestClient):
    """Test health check endpoint asynchronously."""
    async with AsyncClient(app=client.app, base_url="http://test") as ac:
        response = await ac.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"} 