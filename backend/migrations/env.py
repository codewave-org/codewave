"""Alembic environment configuration."""

import os
import sys
from logging.config import fileConfig

from alembic import context
from sqlalchemy import URL, MetaData, create_engine, pool
from sqlalchemy.engine import Connection

# Add the project root directory to the Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
project_dir = os.path.dirname(current_dir)
sys.path.append(project_dir)

from apps.core.config import settings  # noqa: E402

# Import all models to ensure they are registered with SQLAlchemy
from packages.models import Base  # noqa: E402
from packages.models.test import TestModel  # noqa: E402

print("Loaded models:", Base.metadata.tables.keys())

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# 设置数据库 URL
db_url = settings.database_url
print("Using database URL:", db_url)
config.set_main_option("sqlalchemy.url", db_url)

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
target_metadata = Base.metadata
print("Target metadata tables:", target_metadata.tables.keys())
print("Target metadata table details:")
for table_name, table in target_metadata.tables.items():
    print(f"  - {table_name}:")
    for column in table.columns:
        print(f"    - {column.name}: {column.type}")


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
        compare_server_default=True,
        include_schemas=True,
        render_as_batch=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    print("Starting online migrations")
    try:
        # Create the engine
        url = config.get_main_option("sqlalchemy.url")
        if url is None:
            raise ValueError("Database URL is not configured")
        connectable = create_engine(url)
        print("Created engine:", connectable)

        with connectable.connect() as connection:
            print("Running migrations with connection:", connection)
            context.configure(
                connection=connection,
                target_metadata=target_metadata,
                compare_type=True,
                compare_server_default=True,
                include_schemas=True,
                render_as_batch=True,
                transaction_per_migration=True,
                include_object=lambda obj, name, type_, reflected, compare_to: True,
            )

            with context.begin_transaction():
                context.run_migrations()

        print("Migrations completed successfully")
    except Exception as e:
        print("Error during migrations:", str(e))
        raise


if context.is_offline_mode():
    print("Running migrations offline")
    run_migrations_offline()
else:
    print("Running migrations online")
    run_migrations_online()
