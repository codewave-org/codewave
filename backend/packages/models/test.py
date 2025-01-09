"""Test model for migration verification."""

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base, TimestampMixin, UUIDMixin


class TestModel(Base, UUIDMixin, TimestampMixin):
    """Test model for migration verification."""

    __tablename__ = "test_model"

    name: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[str] = mapped_column(String(200))
