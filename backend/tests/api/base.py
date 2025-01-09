"""Base class for API tests."""

from typing import Any, Optional

import pytest
from httpx import AsyncClient, Response
from sqlalchemy.ext.asyncio import AsyncSession


class BaseAPITest:
    """Base class for API tests."""

    @pytest.fixture(autouse=True)
    def _setup_client(
        self,
        async_client: AsyncClient,
        api_url: Any,
        auth_headers: dict[str, str],
        db_session: AsyncSession,
    ) -> None:
        """Set up test environment."""
        self.client = async_client
        self.api_url = api_url
        self.auth_headers = auth_headers
        self.db = db_session

    async def get(
        self,
        path: str,
        *,
        authenticated: bool = True,
        params: Optional[dict[str, Any]] = None,
    ) -> Response:
        """Send GET request."""
        headers = self.auth_headers if authenticated else {}
        return await self.client.get(
            self.api_url(path),
            headers=headers,
            params=params,
        )

    async def post(
        self,
        path: str,
        *,
        authenticated: bool = True,
        json: Optional[dict[str, Any]] = None,
    ) -> Response:
        """Send POST request."""
        headers = self.auth_headers if authenticated else {}
        return await self.client.post(
            self.api_url(path),
            headers=headers,
            json=json,
        )

    async def put(
        self,
        path: str,
        *,
        authenticated: bool = True,
        json: Optional[dict[str, Any]] = None,
    ) -> Response:
        """Send PUT request."""
        headers = self.auth_headers if authenticated else {}
        return await self.client.put(
            self.api_url(path),
            headers=headers,
            json=json,
        )

    async def delete(
        self,
        path: str,
        *,
        authenticated: bool = True,
    ) -> Response:
        """Send DELETE request."""
        headers = self.auth_headers if authenticated else {}
        return await self.client.delete(
            self.api_url(path),
            headers=headers,
        )

    async def patch(
        self,
        path: str,
        *,
        authenticated: bool = True,
        json: Optional[dict[str, Any]] = None,
    ) -> Response:
        """Send PATCH request."""
        headers = self.auth_headers if authenticated else {}
        return await self.client.patch(
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
        expected_message: Optional[str] = None,
    ) -> None:
        """Assert error response."""
        self.assert_status(response, expected_status)
        data = response.json()
        assert "error" in data
        if expected_message:
            assert data["error"] == expected_message
