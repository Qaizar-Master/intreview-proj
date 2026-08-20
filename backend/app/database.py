from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import settings

# The engine owns the pool of real connections to Postgres.
engine = create_engine(settings.database_url, pool_pre_ping=True)

# A Session is one unit of work: you open it, run queries, commit, close it.
SessionLocal = sessionmaker(bind=engine, autoflush=False)


class Base(DeclarativeBase):
    """Parent class for every table model."""


def get_db() -> Generator[Session, None, None]:
 
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
