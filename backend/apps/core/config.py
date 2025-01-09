"""Application configuration."""

from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings."""

    # Project
    PROJECT_NAME: str = "CodeWave"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = False

    # Database
    DB_DRIVER: str = "sqlite"
    DB_PATH: str = "./data/codewave.db"
    DB_ECHO: bool = True

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