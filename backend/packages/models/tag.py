from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, TimestampMixin, UUIDMixin

if TYPE_CHECKING:
    from .snippet import Snippet


class Tag(Base, UUIDMixin, TimestampMixin):
    """标签模型"""

    __tablename__ = "tags"

    name: Mapped[str] = mapped_column(String(50), nullable=False, unique=True, index=True)

    # 关联关系
    snippet_tags: Mapped[list["SnippetTag"]] = relationship(
        "SnippetTag",
        back_populates="tag",
        cascade="all, delete-orphan",
        lazy="select",
    )

    def __repr__(self) -> str:
        return f"<Tag(id={self.id}, name='{self.name}')>"


class SnippetTag(Base, UUIDMixin, TimestampMixin):
    """代码片段-标签关联模型"""

    __tablename__ = "snippet_tags"
    __table_args__ = (UniqueConstraint("snippet_id", "tag_id"),)

    snippet_id: Mapped[UUID] = mapped_column(
        ForeignKey("snippets.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    tag_id: Mapped[UUID] = mapped_column(
        ForeignKey("tags.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # 关联关系
    snippet: Mapped["Snippet"] = relationship(
        "Snippet",
        back_populates="snippet_tags",
        lazy="select",
    )
    tag: Mapped["Tag"] = relationship(
        "Tag",
        back_populates="snippet_tags",
        lazy="select",
    )

    def __repr__(self) -> str:
        return f"<SnippetTag(snippet_id='{self.snippet_id}', tag_id='{self.tag_id}')>" 