"""API documentation configuration."""

from typing import Any, Dict

from fastapi.openapi.utils import get_openapi

from apps.core.config import settings


def custom_openapi() -> Dict[str, Any]:
    """Generate custom OpenAPI schema."""
    if not settings.openapi_schema:
        openapi_schema = get_openapi(
            title=settings.API_TITLE,
            version=settings.API_VERSION,
            description=settings.API_DESCRIPTION,
            routes=[],  # Will be filled by FastAPI
            contact={
                "name": "CodeWave Team",
                "url": "https://github.com/your-username/codewave",
                "email": "your-email@example.com",
            },
            license_info={
                "name": "MIT",
                "url": "https://opensource.org/licenses/MIT",
            },
            tags=[
                {
                    "name": "health",
                    "description": "Health check endpoints",
                },
                {
                    "name": "snippets",
                    "description": "Code snippet management endpoints",
                },
                {
                    "name": "users",
                    "description": "User management endpoints",
                },
            ],
        )

        # Custom documentation settings
        openapi_schema["info"]["x-logo"] = {
            "url": "https://example.com/logo.png"
        }

        # Security schemes
        openapi_schema["components"] = {
            "securitySchemes": {
                "bearerAuth": {
                    "type": "http",
                    "scheme": "bearer",
                    "bearerFormat": "JWT",
                }
            }
        }

        settings.openapi_schema = openapi_schema

    return settings.openapi_schema 