from typing import TYPE_CHECKING, Optional
from uuid import UUID

from sqlalchemy import JSON, ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, TimestampMixin, UUIDMixin

if TYPE_CHECKING:
    from .snippet import Snippet


class Version(Base, UUIDMixin, TimestampMixin):
    """代码片段版本模型"""

    __tablename__ = "versions"

    snippet_id: Mapped[UUID] = mapped_column(
        ForeignKey("snippets.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    content: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    version_number: Mapped[int] = mapped_column(Integer, nullable=False)
    parent_version_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("versions.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    version_metadata: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)

    # 关联关系
    snippet: Mapped["Snippet"] = relationship(
        "Snippet",
        back_populates="versions",
        lazy="select",
    )
    parent_version: Mapped[Optional["Version"]] = relationship(
        "Version",
        remote_side="Version.id",
        lazy="select",
    )
    child_versions: Mapped[list["Version"]] = relationship(
        "Version",
        back_populates="parent_version",
        lazy="select",
    )

    def __repr__(self) -> str:
        return (
            f"<Version(id={self.id}, "
            f"snippet_id='{self.snippet_id}', "
            f"version_number={self.version_number})>"
        ) 