from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app import database, schemas, crud, auth_utils

router = APIRouter(
    prefix="/matches",
    tags=["Matches"]
)

@router.get("", response_model=List[schemas.MatchResponse])
def get_all_matches(
    sport_id: Optional[int] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(database.get_db)
):
    return crud.get_matches(db, sport_id=sport_id, status=status)

@router.post("", response_model=schemas.MatchResponse, status_code=status.HTTP_201_CREATED)
def create_new_match(
    match_data: schemas.MatchCreate,
    current_user = Depends(auth_utils.get_current_user),
    db: Session = Depends(database.get_db)
):
    return crud.create_match(db, host_id=current_user.id, match=match_data)

@router.get("/{id}", response_model=schemas.MatchResponse)
def get_match_by_id(id: int, db: Session = Depends(database.get_db)):
    match = crud.get_match_by_id(db, match_id=id)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    return match

@router.post("/{id}/join", response_model=schemas.MatchParticipantResponse)
def join_existing_match(
    id: int,
    current_user = Depends(auth_utils.get_current_user),
    db: Session = Depends(database.get_db)
):
    # Check if match exists
    match = crud.get_match_by_id(db, match_id=id)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    if match.status in ["FULL", "FINISHED", "CANCELLED"]:
        raise HTTPException(status_code=400, detail=f"Cannot join match in status {match.status}")
        
    return crud.join_match(db, match_id=id, user_id=current_user.id)

@router.post("/{id}/leave")
def leave_existing_match(
    id: int,
    current_user = Depends(auth_utils.get_current_user),
    db: Session = Depends(database.get_db)
):
    # Check if match exists
    match = crud.get_match_by_id(db, match_id=id)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
        
    success = crud.leave_match(db, match_id=id, user_id=current_user.id)
    if not success:
        raise HTTPException(status_code=400, detail="You are not a participant in this match")
        
    return {"message": "Successfully left the match"}
