import os
import pytest
import asyncio
from typing import AsyncGenerator, Generator, Any
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    create_async_engine,
    async_sessionmaker,
    AsyncEngine,
)

from apps.main import app
from apps.db.base import Base

# Test database URL
TEST_DATABASE_URL = os.getenv("TEST_DATABASE_URL", "sqlite+aiosqlite:///./test.db")

# Create async engine for tests
engine: AsyncEngine = create_async_engine(
    TEST_DATABASE_URL, echo=True, connect_args={"check_same_thread": False}
)

# Create async session factory
async_session_factory = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


async def get_test_db() -> AsyncGenerator[AsyncSession, None]:
    """Get test database session."""
    async with async_session_factory() as session:
        try:
            yield session
        finally:
            await session.close()


@pytest.fixture(scope="session")
async def test_db_setup() -> AsyncGenerator[None, None]:
    """Setup test database."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture
async def db_session(test_db_setup) -> AsyncGenerator[AsyncSession, None]:
    """Create a fresh database session for each test."""
    async with async_session_factory() as session:
        try:
            yield session
        finally:
            await session.close()


@pytest.fixture
def client() -> TestClient:
    """Create a test client."""
    return TestClient(app)


@pytest.fixture
def test_user() -> dict[str, str]:
    """Create a test user fixture."""
    return {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpassword123",
    }
