"""Version tests."""

import sys

from tests.constants import PYTHON_MAJOR_VERSION, PYTHON_MINOR_VERSION


def test_python_version() -> None:
    """Test Python version."""
    assert sys.version_info.major == PYTHON_MAJOR_VERSION
    assert sys.version_info.minor == PYTHON_MINOR_VERSION
