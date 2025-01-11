"""Base model for all database models."""

from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import Boolean, DateTime, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    """Base class for all database models."""


class TimestampMixin:
    """Mixin to add timestamp fields to models."""

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


class UUIDMixin:
    """Mixin to add UUID primary key to models."""

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
        nullable=False,
    )


class SoftDeleteMixin:
    """软删除混入类"""

    deleted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        default=None,
    )

    _is_deleted: Mapped[bool] = mapped_column(
        "is_deleted",
        Boolean,
        nullable=False,
        default=False,
    )

    @property
    def is_deleted(self) -> bool:
        """Check if the record is soft deleted."""
        return self._is_deleted

    def soft_delete(self) -> None:
        """软删除记录"""
        self._is_deleted = True
        self.deleted_at = datetime.now()
