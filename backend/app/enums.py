from enum import Enum


class Difficulty(str, Enum):
    """How hard a practice session is. Inheriting from `str` means these
    serialise to plain strings like "Beginner" in JSON."""

    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"


class Status(str, Enum):
    """Whether the user has finished the practice yet."""

    PENDING = "Pending"
    COMPLETED = "Completed"
