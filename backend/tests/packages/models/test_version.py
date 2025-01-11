"""Tests for version model."""

from datetime import datetime
from uuid import UUID

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from packages.models import Base, Snippet, Version


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
class TestVersion:
    """Test cases for Version model."""

    EXPECTED_VERSION_COUNT = 3  # Number of versions we expect to create in the test

    def test_create_version(self, session: Session, snippet: Snippet):
        """Test creating a new version."""
        version = Version(
            snippet=snippet,
            content="print('Hello, Python!')",
            version_number=1,
            metadata={"changes": ["Updated greeting"]},
        )
        session.add(version)
        session.commit()

        assert isinstance(version.id, UUID)
        assert isinstance(version.created_at, datetime)
        assert isinstance(version.updated_at, datetime)
        assert version.snippet_id == snippet.id
        assert version.content == "print('Hello, Python!')"
        assert version.version_number == 1
        assert version.metadata == {"changes": ["Updated greeting"]}
        assert version.parent_version_id is None

    def test_version_tree(self, session: Session, snippet: Snippet):
        """Test version tree relationships."""
        version1 = Version(
            snippet=snippet,
            content="print('Hello, World!')",
            version_number=1,
            metadata={"changes": ["Initial version"]},
        )
        session.add(version1)
        session.commit()

        version2 = Version(
            snippet=snippet,
            content="print('Hello, Python!')",
            version_number=2,
            parent_version=version1,
            metadata={"changes": ["Updated greeting"]},
        )
        session.add(version2)
        session.commit()

        version3 = Version(
            snippet=snippet,
            content="print('Hello, Programming!')",
            version_number=3,
            parent_version=version2,
            metadata={"changes": ["Updated greeting again"]},
        )
        session.add(version3)
        session.commit()

        # Test parent-child relationships
        assert version1.parent_version is None
        assert len(version1.child_versions) == 1
        assert version1.child_versions[0] == version2

        assert version2.parent_version == version1
        assert len(version2.child_versions) == 1
        assert version2.child_versions[0] == version3

        assert version3.parent_version == version2
        assert len(version3.child_versions) == 0

        # Test snippet relationship
        assert version1.snippet == snippet
        assert version2.snippet == snippet
        assert version3.snippet == snippet
        assert len(snippet.versions) == self.EXPECTED_VERSION_COUNT
        assert snippet.latest_version == version3 