"""Application configuration."""

from typing import Any, Dict, Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings."""

    # Project
    PROJECT_NAME: str = "CodeWave"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = False

    # Application
    APP_NAME: str = "CodeWave"
    APP_ENV: str = "development"
    APP_DEBUG: bool = True
    APP_PORT: int = 8000
    APP_HOST: str = "0.0.0.0"
    APP_BASE_URL: str = "http://localhost:8000"
    APP_SECRET_KEY: str = "your-secret-key-here"

    # API
    API_V1_PREFIX: str = "/api/v1"
    API_TITLE: str = "CodeWave API"
    API_DESCRIPTION: str = "CodeWave backend API"
    API_VERSION: str = "0.1.0"
    API_DOCS_URL: str = "/docs"
    API_REDOC_URL: str = "/redoc"
    API_OPENAPI_URL: str = "/openapi.json"
    openapi_schema: Optional[Dict[str, Any]] = None

    # Database
    DB_DRIVER: str = "sqlite"
    DB_PATH: str = "./data/codewave.db"
    DB_ECHO: bool = True

    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]
    CORS_METHODS: list[str] = ["*"]
    CORS_HEADERS: list[str] = ["*"]

    @property
    def database_url(self) -> str:
        """Get database URL."""
        if self.DB_DRIVER == "sqlite":
            return f"sqlite:///{self.DB_PATH}"
        raise ValueError(f"Unsupported database driver: {self.DB_DRIVER}")

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="allow",
    )


settings = Settings()
