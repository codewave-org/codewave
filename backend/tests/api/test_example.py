"""Example API test using the base test class."""

import pytest

from tests.api.base import BaseAPITest
from tests.constants import HTTP_200_OK, HTTP_404_NOT_FOUND


class TestExampleAPI(BaseAPITest):
    """Test example API endpoints."""

    def test_health_check(self) -> None:
        """Test health check endpoint."""
        response = self.client.get("/health")
        self.assert_status(response, HTTP_200_OK)
        assert response.json() == {"status": "ok"}

    def test_root_endpoint(self) -> None:
        """Test root endpoint."""
        response = self.client.get("/")
        self.assert_status(response, HTTP_200_OK)
        data = response.json()
        assert "name" in data
        assert "version" in data
        assert "environment" in data

    def test_api_endpoint_without_auth(self) -> None:
        """Test API endpoint without authentication."""
        response = self.client.get("/api/v1/test")
        self.assert_status(response, HTTP_200_OK)
        assert response.json() == {"message": "Hello from CodeWave!"}

    @pytest.mark.parametrize(
        "path,expected_status",
        [
            ("/nonexistent", HTTP_404_NOT_FOUND),
            ("/api/v1/nonexistent", HTTP_404_NOT_FOUND),
        ],
    )
    def test_nonexistent_endpoints(self, path: str, expected_status: int) -> None:
        """Test accessing nonexistent endpoints."""
        response = self.client.get(path)
        self.assert_status(response, expected_status)
