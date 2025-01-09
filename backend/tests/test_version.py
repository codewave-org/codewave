"""Version information tests."""

def test_python_version():
    """Test Python version is 3.10.x."""
    import sys
    assert sys.version_info.major == 3
    assert sys.version_info.minor == 10 