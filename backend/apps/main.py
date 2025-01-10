"""Main application module."""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from apps.api.schemas import ErrorResponse, HealthCheck, RootResponse
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
app.openapi = custom_openapi  # type: ignore


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    """Handle HTTP exceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            detail=str(exc.detail),
            error_code=str(exc.status_code),
        ).model_dump(),
    )


@app.get(
    "/",
    tags=["root"],
    response_model=RootResponse,
    responses={
        200: {"description": "Successful response"},
        500: {
            "model": ErrorResponse,
            "description": "Internal server error",
        },
    },
)
async def root() -> RootResponse:
    """
    Root endpoint.

    Returns basic information about the application.

    Returns:
        RootResponse: Basic information including name, version, and environment.

    Raises:
        HTTPException: If there's an error retrieving application information.
    """
    try:
        return RootResponse(
            name=settings.APP_NAME,
            version=settings.API_VERSION,
            environment=settings.APP_ENV,
        )
    except Exception as e:
        msg = f"Error retrieving application information: {e!s}"
        raise HTTPException(status_code=500, detail=msg) from e


@app.get(
    "/api/v1/test",
    tags=["test"],
    responses={
        200: {
            "description": "Test message",
            "content": {
                "application/json": {"example": {"message": "Hello from CodeWave!"}}
            },
        },
        500: {
            "model": ErrorResponse,
            "description": "Internal server error",
        },
    },
)
async def test_endpoint() -> dict[str, str]:
    """
    Test endpoint.

    A simple endpoint for testing the API.

    Returns:
        dict: A welcome message.

    Raises:
        HTTPException: If there's an error processing the request.
    """
    try:
        return {"message": "Hello from CodeWave!"}
    except Exception as e:
        msg = f"Error processing request: {e!s}"
        raise HTTPException(status_code=500, detail=msg) from e


@app.get(
    "/health",
    tags=["health"],
    response_model=HealthCheck,
    responses={
        200: {"description": "Service is healthy"},
        503: {
            "model": ErrorResponse,
            "description": "Service is unhealthy",
        },
    },
)
async def health_check() -> HealthCheck:
    """
    Health check endpoint.

    Checks the health status of the service.

    Returns:
        HealthCheck: Current health status and version information.

    Raises:
        HTTPException: If the service is unhealthy.
    """
    try:
        return HealthCheck(status="ok", version=settings.API_VERSION)
    except Exception as e:
        msg = f"Service is unhealthy: {e!s}"
        raise HTTPException(status_code=503, detail=msg) from e
