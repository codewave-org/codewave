"""Tests for tag models."""

from datetime import datetime
from uuid import UUID

import pytest
from sqlalchemy import create_engine
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, sessionmaker

from packages.models import Base, Snippet, SnippetTag, Tag


@pytest.fixture
def engine():
    """Create a new database engine."""
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    return engine


@pytest.fixture
def session(engine):
    """Create a new database session."""
    session_local = sessionmaker(bind=engine)
    session = session_local()
    yield session
    session.close()


@pytest.fixture
def snippet(session: Session):
    """Create a test snippet."""
    snippet = Snippet(
        title="Test Snippet",
        content="print('Hello, World!')",
        language="python",
    )
    session.add(snippet)
    session.commit()
    return snippet


@pytest.mark.model
class TestTag:
    """Test cases for Tag model."""

    def test_create_tag(self, session: Session):
        """Test creating a new tag."""
        tag = Tag(name="python")
        session.add(tag)
        session.commit()

        assert isinstance(tag.id, UUID)
        assert isinstance(tag.created_at, datetime)
        assert isinstance(tag.updated_at, datetime)
        assert tag.name == "python"
        assert len(tag.snippet_tags) == 0

    def test_unique_tag_name(self, session: Session):
        """Test that tag names must be unique."""
        tag1 = Tag(name="python")
        session.add(tag1)
        session.commit()

        tag2 = Tag(name="python")
        session.add(tag2)
        with pytest.raises(
            IntegrityError, match="UNIQUE constraint failed"
        ):  # SQLite raises IntegrityError
            session.commit()
        session.rollback()


@pytest.mark.model
class TestSnippetTag:
    """Test cases for SnippetTag model."""

    def test_create_snippet_tag(self, session: Session, snippet: Snippet):
        """Test creating a new snippet-tag relationship."""
        tag = Tag(name="python")
        session.add(tag)
        session.commit()

        snippet_tag = SnippetTag(snippet=snippet, tag=tag)
        session.add(snippet_tag)
        session.commit()

        assert isinstance(snippet_tag.id, UUID)
        assert isinstance(snippet_tag.created_at, datetime)
        assert isinstance(snippet_tag.updated_at, datetime)
        assert snippet_tag.snippet_id == snippet.id
        assert snippet_tag.tag_id == tag.id
        assert snippet_tag.snippet == snippet
        assert snippet_tag.tag == tag

    def test_unique_snippet_tag_pair(self, session: Session, snippet: Snippet):
        """Test that snippet-tag pairs must be unique."""
        tag = Tag(name="python")
        session.add(tag)
        session.commit()

        snippet_tag1 = SnippetTag(snippet=snippet, tag=tag)
        session.add(snippet_tag1)
        session.commit()

        snippet_tag2 = SnippetTag(snippet=snippet, tag=tag)
        session.add(snippet_tag2)
        with pytest.raises(
            IntegrityError, match="UNIQUE constraint failed"
        ):  # SQLite raises IntegrityError
            session.commit()
        session.rollback()

    def test_cascade_delete(self, session: Session, snippet: Snippet):
        """Test cascade delete behavior."""
        tag = Tag(name="python")
        session.add(tag)
        session.commit()

        snippet_tag = SnippetTag(snippet=snippet, tag=tag)
        session.add(snippet_tag)
        session.commit()

        # Test cascade delete from snippet
        session.delete(snippet)
        session.commit()
        assert session.query(SnippetTag).count() == 0

        # Test cascade delete from tag
        tag2 = Tag(name="example")
        snippet2 = Snippet(
            title="Test Snippet 2",
            content="print('Hello!')",
            language="python",
        )
        session.add_all([tag2, snippet2])
        session.commit()

        snippet_tag2 = SnippetTag(snippet=snippet2, tag=tag2)
        session.add(snippet_tag2)
        session.commit()

        session.delete(tag2)
        session.commit()
        assert session.query(SnippetTag).count() == 0
