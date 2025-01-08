from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from apps.core.config import settings

app = FastAPI(
    title=settings.API_TITLE,
    description=settings.API_DESCRIPTION,
    version=settings.API_VERSION,
    docs_url=settings.API_DOCS_URL,
    redoc_url=settings.API_REDOC_URL,
    openapi_url=settings.API_OPENAPI_URL,
)

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_methods=settings.CORS_METHODS,
    allow_headers=settings.CORS_HEADERS,
    allow_credentials=True,
)

@app.get("/")
async def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.API_VERSION,
        "environment": settings.APP_ENV,
    } 