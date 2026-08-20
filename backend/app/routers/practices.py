from fastapi import APIRouter, Depends, HTTPException, status as http_status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.enums import Status
from app.models import Practice
from app.schemas import PracticeCreate, PracticeOut, PracticeUpdate

router = APIRouter(prefix="/practices", tags=["practices"])


def _get_or_404(db: Session, practice_id: int) -> Practice:
    """Fetch one practice or raise a clean 404. Shared by every by-id route."""
    practice = db.get(Practice, practice_id)
    if practice is None:
        raise HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail=f"Practice {practice_id} not found",
        )
    return practice


@router.post("", response_model=PracticeOut, status_code=http_status.HTTP_201_CREATED)
def create_practice(payload: PracticeCreate, db: Session = Depends(get_db)) -> Practice:
    """Create a practice session."""
    practice = Practice(**payload.model_dump())
    db.add(practice)
    db.commit()
    db.refresh(practice)  # reload so id/created_at are populated from the DB
    return practice


@router.get("", response_model=list[PracticeOut])
def list_practices(db: Session = Depends(get_db)) -> list[Practice]:
    """List all practice sessions, newest first."""
    return list(db.scalars(select(Practice).order_by(Practice.created_at.desc())))


@router.put("/{practice_id}", response_model=PracticeOut)
def update_practice(
    practice_id: int, payload: PracticeUpdate, db: Session = Depends(get_db)
) -> Practice:
    """Replace every editable field of an existing practice."""
    practice = _get_or_404(db, practice_id)
    for field, value in payload.model_dump().items():
        setattr(practice, field, value)
    db.commit()
    db.refresh(practice)
    return practice


@router.patch("/{practice_id}/complete", response_model=PracticeOut)
def complete_practice(practice_id: int, db: Session = Depends(get_db)) -> Practice:
    """Mark a practice as completed. Idempotent — calling it twice is harmless."""
    practice = _get_or_404(db, practice_id)
    practice.status = Status.COMPLETED
    db.commit()
    db.refresh(practice)
    return practice


@router.delete("/{practice_id}", status_code=http_status.HTTP_204_NO_CONTENT)
def delete_practice(practice_id: int, db: Session = Depends(get_db)) -> None:
    """Delete a practice. Returns 204 with an empty body."""
    practice = _get_or_404(db, practice_id)
    db.delete(practice)
    db.commit()
