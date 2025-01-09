"""Database session configuration."""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from apps.core.config import settings

engine = create_engine(
    settings.database_url,
    echo=settings.DB_ECHO,
    connect_args={"check_same_thread": False} if settings.DB_DRIVER == "sqlite" else {},
)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
) 