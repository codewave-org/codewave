"""Alembic environment configuration."""

from logging.config import fileConfig

from alembic import context

from apps.core.config import get_settings
from apps.db.base import Base

config = context.config
settings = get_settings()

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata
