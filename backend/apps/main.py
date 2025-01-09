"""Main application module."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse

from apps.core.config import get_settings

settings = get_settings()

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
    allow_credentials=True,
    allow_methods=settings.CORS_METHODS,
    allow_headers=settings.CORS_HEADERS,
)


@app.get("/")
async def root() -> JSONResponse:
    """Root endpoint."""
    return JSONResponse(
        {
            "name": settings.PROJECT_NAME,
            "version": settings.VERSION,
            "environment": settings.APP_ENV,
        }
    )


@app.get("/health")
async def health_check() -> JSONResponse:
    """Health check endpoint."""
    return JSONResponse({"status": "ok"})


@app.get("/api/v1/test")
async def test_endpoint() -> JSONResponse:
    """Test endpoint."""
    return JSONResponse({"message": "Hello from CodeWave!"})
