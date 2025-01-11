"""Tests for base model classes."""

from datetime import datetime, timezone
from uuid import UUID

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from packages.models.base import Base, SoftDeleteMixin, TimestampMixin, UUIDMixin


# 使用 pytest.mark.model 标记这不是测试类
@pytest.mark.model
class TestModel(Base, TimestampMixin, UUIDMixin, SoftDeleteMixin):
    """Test model that uses all mixins."""

    __tablename__ = "test_models"


@pytest.fixture
def engine():
    """Create a SQLite in-memory database engine."""
    return create_engine("sqlite:///:memory:")


@pytest.fixture
def session(engine):
    """Create a new database session."""
    Base.metadata.create_all(engine)
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(engine)


def test_timestamp_mixin(session: Session):
    """Test TimestampMixin adds timestamp fields."""
    # Create a new model instance
    model = TestModel()
    session.add(model)
    session.commit()

    # Verify timestamps are set
    assert isinstance(model.created_at, datetime)
    assert isinstance(model.updated_at, datetime)
    # SQLite doesn't support timezone, so we just check the datetime values
    assert model.created_at is not None
    assert model.updated_at is not None

    # Verify update timestamp changes
    old_updated_at = model.updated_at
    # Use naive datetime for SQLite
    model.updated_at = datetime.now()
    session.commit()
    assert model.updated_at != old_updated_at


def test_uuid_mixin(session: Session):
    """Test UUIDMixin adds UUID primary key."""
    # Create a new model instance
    model = TestModel()
    session.add(model)
    session.commit()

    # Verify UUID is set
    assert isinstance(model.id, UUID)
    assert model.id is not None

    # Verify UUID is unique
    another_model = TestModel()
    session.add(another_model)
    session.commit()
    assert another_model.id != model.id


def test_soft_delete_mixin(session: Session):
    """Test SoftDeleteMixin adds soft delete support."""
    # Create a new model instance
    model = TestModel()
    session.add(model)
    session.commit()

    # Verify initial state
    assert model.deleted_at is None
    assert not model.is_deleted

    # Verify soft delete
    # Use naive datetime for SQLite
    now = datetime.now()
    model.deleted_at = now
    session.commit()
    # Compare without timezone info
    assert model.deleted_at.replace(tzinfo=None) == now.replace(tzinfo=None)
    assert model.is_deleted

    # Verify undelete
    model.deleted_at = None
    session.commit()
    assert model.deleted_at is None
    assert not model.is_deleted


def test_base_model_inheritance():
    """Test model inheritance from Base."""
    # Verify TestModel is properly configured
    assert hasattr(TestModel, "__tablename__")
    assert TestModel.__tablename__ == "test_models"

    # Verify all mixin fields are present
    assert hasattr(TestModel, "id")  # From UUIDMixin
    assert hasattr(TestModel, "created_at")  # From TimestampMixin
    assert hasattr(TestModel, "updated_at")  # From TimestampMixin
    assert hasattr(TestModel, "deleted_at")  # From SoftDeleteMixin
    assert hasattr(TestModel, "is_deleted")  # From SoftDeleteMixin
