"""Tests for snippet model."""

from datetime import datetime
from uuid import UUID

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from packages.models import Base, Snippet, SnippetTag, Tag, Version


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


@pytest.mark.model
class TestSnippet:
    """Test cases for Snippet model."""

    EXPECTED_TAG_COUNT = 2  # Number of tags we expect to be associated with the snippet

    def test_create_snippet(self, session: Session):
        """Test creating a new snippet."""
        snippet = Snippet(
            title="Test Snippet",
            description="A test snippet",
            content="print('Hello, World!')",
            language="python",
        )
        session.add(snippet)
        session.commit()

        assert isinstance(snippet.id, UUID)
        assert isinstance(snippet.created_at, datetime)
        assert isinstance(snippet.updated_at, datetime)
        assert snippet.title == "Test Snippet"
        assert snippet.description == "A test snippet"
        assert snippet.content == "print('Hello, World!')"
        assert snippet.language == "python"
        assert snippet.is_deleted is False
        assert len(snippet.versions) == 0
        assert len(snippet.tags) == 0

    def test_add_version(self, session: Session):
        """Test adding a version to a snippet."""
        snippet = Snippet(
            title="Test Snippet",
            content="print('Hello, World!')",
            language="python",
        )
        session.add(snippet)
        session.commit()

        version = Version(
            snippet=snippet,
            content="print('Hello, Python!')",
            version_number=1,
            metadata={"changes": ["Updated greeting"]},
        )
        session.add(version)
        session.commit()

        assert len(snippet.versions) == 1
        assert snippet.latest_version == version
        assert version.version_number == 1
        assert version.metadata == {"changes": ["Updated greeting"]}

    def test_add_tags(self, session: Session):
        """Test adding tags to a snippet."""
        snippet = Snippet(
            title="Test Snippet",
            content="print('Hello, World!')",
            language="python",
        )
        session.add(snippet)

        tag1 = Tag(name="python")
        tag2 = Tag(name="example")
        session.add_all([tag1, tag2])
        session.commit()

        snippet_tag1 = SnippetTag(snippet=snippet, tag=tag1)
        snippet_tag2 = SnippetTag(snippet=snippet, tag=tag2)
        session.add_all([snippet_tag1, snippet_tag2])
        session.commit()

        assert len(snippet.snippet_tags) == self.EXPECTED_TAG_COUNT
        assert len(snippet.tags) == self.EXPECTED_TAG_COUNT
        assert "python" in snippet.tags
        assert "example" in snippet.tags

    def test_soft_delete(self, session: Session):
        """Test soft deleting a snippet."""
        snippet = Snippet(
            title="Test Snippet",
            content="print('Hello, World!')",
            language="python",
        )
        session.add(snippet)
        session.commit()

        snippet.soft_delete()
        session.commit()

        assert snippet.is_deleted is True
        assert snippet.deleted_at is not None 