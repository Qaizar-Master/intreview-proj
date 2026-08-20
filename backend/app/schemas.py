from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.enums import Difficulty, Status


class PracticeBase(BaseModel):
    """Fields the client sends. Pydantic validates these before the code runs,
    so an empty title or a negative duration is rejected with a 422 automatically."""

    title: str = Field(min_length=1, max_length=200)
    description: str = Field(default="", max_length=5000)
    duration_minutes: int = Field(gt=0, le=1440, description="Duration in minutes")
    difficulty: Difficulty = Difficulty.BEGINNER
    status: Status = Status.PENDING


class PracticeCreate(PracticeBase):
    """Body of POST /practices."""


class PracticeUpdate(PracticeBase):
    """Body of PUT /practices/{id}."""


class PracticeOut(PracticeBase):
    """What the API sends back."""

    # Lets Pydantic build this straight from a SQLAlchemy row object.
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
