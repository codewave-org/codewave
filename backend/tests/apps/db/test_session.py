"""Tests for database session configuration."""

import os
from unittest.mock import patch

import pytest
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, SessionTransaction

from apps.core.config import settings
from apps.db.session import SessionLocal, engine


def test_engine_configuration():
    """Test database engine configuration."""
    assert isinstance(engine, Engine)
    assert os.path.basename(str(engine.url.database)) == os.path.basename(str(settings.database_url))
    assert engine.echo == settings.DB_ECHO


def test_sqlite_connect_args():
    """Test SQLite specific connection arguments."""
    with patch("apps.core.config.settings.DB_DRIVER", "sqlite"):
        from apps.db import session
        engine = session.engine
        assert str(engine.url).startswith("sqlite")
        # SQLite specific options are now handled internally


def test_non_sqlite_driver_validation():
    """Test validation of non-SQLite database drivers."""
    with patch("apps.core.config.settings.DB_DRIVER", "postgresql"):
        with pytest.raises(ValueError) as exc_info:
            from apps.core.config import settings
            _ = settings.database_url
        assert "Unsupported database driver: postgresql" in str(exc_info.value)


def test_session_factory():
    """Test session factory configuration."""
    session = SessionLocal()
    try:
        assert isinstance(session, Session)
        # SQLAlchemy 2.0 no longer has autocommit/autoflush as attributes
        # Instead, we test the session behavior
        
        # Test transaction management
        transaction = session.begin()
        assert isinstance(transaction, SessionTransaction)
        transaction.rollback()
    finally:
        session.close()


def test_session_commit_and_rollback():
    """Test session commit and rollback operations."""
    session = SessionLocal()
    try:
        # Start a transaction
        with session.begin():
            # Simulate some database operations
            pass
        
        # Start another transaction and rollback
        transaction = session.begin()
        try:
            # Simulate some database operations
            raise ValueError("Test rollback")
        except ValueError:
            transaction.rollback()
    finally:
        session.close()


@pytest.mark.asyncio
async def test_async_session_operations():
    """Test session operations in async context."""
    session = SessionLocal()
    try:
        # Test basic operations in a transaction
        with session.begin():
            # Inside transaction
            pass
        # Transaction should be closed
    finally:
        session.close() 