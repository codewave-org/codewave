"""Base class for API tests."""

from typing import Any

import pytest
from fastapi.testclient import TestClient
from httpx import Response
from sqlalchemy.ext.asyncio import AsyncSession


class BaseAPITest:
    """Base class for API tests."""

    @pytest.fixture(autouse=True)
    def _setup_client(
        self,
        client: TestClient,
        api_url: Any,
        auth_headers: dict[str, str],
        db_session: AsyncSession,
    ) -> None:
        """Set up test environment."""
        self.client = client
        self.api_url = api_url
        self.auth_headers = auth_headers
        self.db = db_session

    def get(
        self,
        path: str,
        *,
        authenticated: bool = True,
        params: dict[str, Any] | None = None,
    ) -> Response:
        """Send GET request."""
        headers = self.auth_headers if authenticated else {}
        return self.client.get(
            self.api_url(path),
            headers=headers,
            params=params,
        )

    def post(
        self,
        path: str,
        *,
        authenticated: bool = True,
        json: dict[str, Any] | None = None,
    ) -> Response:
        """Send POST request."""
        headers = self.auth_headers if authenticated else {}
        return self.client.post(
            self.api_url(path),
            headers=headers,
            json=json,
        )

    def put(
        self,
        path: str,
        *,
        authenticated: bool = True,
        json: dict[str, Any] | None = None,
    ) -> Response:
        """Send PUT request."""
        headers = self.auth_headers if authenticated else {}
        return self.client.put(
            self.api_url(path),
            headers=headers,
            json=json,
        )

    def delete(
        self,
        path: str,
        *,
        authenticated: bool = True,
    ) -> Response:
        """Send DELETE request."""
        headers = self.auth_headers if authenticated else {}
        return self.client.delete(
            self.api_url(path),
            headers=headers,
        )

    def patch(
        self,
        path: str,
        *,
        authenticated: bool = True,
        json: dict[str, Any] | None = None,
    ) -> Response:
        """Send PATCH request."""
        headers = self.auth_headers if authenticated else {}
        return self.client.patch(
            self.api_url(path),
            headers=headers,
            json=json,
        )

    def assert_status(self, response: Response, expected_status: int) -> None:
        """Assert response status code."""
        assert response.status_code == expected_status, (
            f"Expected status code {expected_status}, "
            f"but got {response.status_code}. "
            f"Response body: {response.text}"
        )

    def assert_error_response(
        self,
        response: Response,
        expected_status: int,
        expected_message: str | None = None,
    ) -> None:
        """Assert error response."""
        self.assert_status(response, expected_status)
        data = response.json()
        assert "error" in data
        if expected_message:
            assert data["error"] == expected_message
