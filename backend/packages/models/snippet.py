from typing import TYPE_CHECKING, Optional

from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, SoftDeleteMixin, TimestampMixin, UUIDMixin

if TYPE_CHECKING:
    from .tag import SnippetTag
    from .version import Version


class Snippet(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    """代码片段模型"""

    __tablename__ = "snippets"

    title: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    language: Mapped[str] = mapped_column(String(50), nullable=False, index=True)

    # 关联关系
    versions: Mapped[list["Version"]] = relationship(
        "Version",
        back_populates="snippet",
        cascade="all, delete-orphan",
        lazy="select",
    )
    snippet_tags: Mapped[list["SnippetTag"]] = relationship(
        "SnippetTag",
        back_populates="snippet",
        cascade="all, delete-orphan",
        lazy="select",
    )

    @property
    def tags(self) -> list[str]:
        """获取标签列表"""
        return [st.tag.name for st in self.snippet_tags]

    @property
    def latest_version(self) -> Optional["Version"]:
        """获取最新版本"""
        if not self.versions:
            return None
        return max(self.versions, key=lambda v: v.version_number)

    def __repr__(self) -> str:
        return (
            f"<Snippet(id={self.id}, title='{self.title}', language='{self.language}')>"
        )
