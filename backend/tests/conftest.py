import pytest
from httpx import AsyncClient

from apps.main import app

@pytest.fixture
def client() -> AsyncClient:
    return AsyncClient(app=app, base_url="http://test")
