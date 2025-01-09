from datetime import datetime
from typing import Any

from sqlalchemy import DateTime, func
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    """Base class for all database models."""

    @declared_attr.directive
    def __tablename__(cls) -> str:
        """Generate __tablename__ automatically from class name."""
        return cls.__name__.lower()

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
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
