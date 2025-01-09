"""Test Python version."""

import platform

from tests.constants import PYTHON_MAJOR_VERSION, PYTHON_MINOR_VERSION


def test_python_version() -> None:
    """Test Python version."""
    version = platform.python_version_tuple()
    assert int(version[0]) == PYTHON_MAJOR_VERSION
    assert int(version[1]) == PYTHON_MINOR_VERSION
