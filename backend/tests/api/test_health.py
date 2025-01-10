"""Health check endpoint tests."""

import pytest
from fastapi.testclient import TestClient

from apps.main import app
from tests.constants import HTTP_200_OK


def test_health_check_sync(client: TestClient) -> None:
    """Test health check endpoint synchronously."""
    response = client.get("/health")
    assert response.status_code == HTTP_200_OK
    data = response.json()
    assert data["status"] == "ok"
    assert "version" in data


@pytest.mark.asyncio
async def test_health_check_async() -> None:
    """Test health check endpoint asynchronously."""
    with TestClient(app) as client:
        response = client.get("/health")
        assert response.status_code == HTTP_200_OK
        data = response.json()
        assert data["status"] == "ok"
        assert "version" in data
