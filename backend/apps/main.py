"""Main application module."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from apps.core.config import settings
from apps.core.docs import custom_openapi

app = FastAPI(
    title=settings.API_TITLE,
    description=settings.API_DESCRIPTION,
    version=settings.API_VERSION,
    docs_url=settings.API_DOCS_URL,
    redoc_url=settings.API_REDOC_URL,
    openapi_url=settings.API_OPENAPI_URL,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_methods=settings.CORS_METHODS,
    allow_headers=settings.CORS_HEADERS,
    allow_credentials=True,
)

# Configure custom OpenAPI
app.openapi = custom_openapi


@app.get("/", tags=["root"])
async def root() -> dict[str, str]:
    """
    Root endpoint.

    Returns:
        dict: Basic application information
            - name: Application name
            - version: API version
            - environment: Current environment
    """
    return {
        "name": settings.APP_NAME,
        "version": settings.API_VERSION,
        "environment": settings.APP_ENV,
    }


@app.get("/api/v1/test", tags=["test"])
async def test_endpoint() -> dict[str, str]:
    """
    Test endpoint.

    Returns:
        dict: A simple test message
            - message: Welcome message
    """
    return {"message": "Hello from CodeWave!"}


@app.get("/health", tags=["health"])
async def health_check() -> dict[str, str]:
    """
    Health check endpoint.

    Returns:
        dict: Service health status
            - status: Current health status (ok/error)
    """
    return {"status": "ok"}
