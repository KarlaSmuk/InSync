from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.db import get_db  # Make sure to import your database session
from db.models import User
from schemas.user import UserUpdate, UserResponse, UserNotificationResponse, DashboardSummary
from services.user import UserService
from utils.auth import get_current_user

router = APIRouter(prefix="/api/user", tags=["user"])


@router.get("/all", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db)):
    user_service = UserService(db)
    users = user_service.get_users()
    return users


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: UUID, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    user_service = UserService(db)
    user = user_service.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: UUID, user_update: UserUpdate, db: Session = Depends(get_db)):
    user_service = UserService(db)
    updated_user = user_service.update_user(user_id, user_update)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user


@router.delete("/{user_id}", response_model=UserResponse)
def delete_user(user_id: UUID, db: Session = Depends(get_db)):
    user_service = UserService(db)
    deleted_user = user_service.delete_user(user_id)
    if not deleted_user:
        raise HTTPException(status_code=404, detail="User not found")
    return deleted_user


@router.get("/{user_id}/notifications", response_model=List[UserNotificationResponse])
def get_user_notifications(user_id: UUID, db: Session = Depends(get_db)):
    user_service = UserService(db)
    notifications = user_service.get_user_notifications(user_id)
    if not notifications:
        raise HTTPException(status_code=404, detail="User not found")
    return notifications


@router.get("/dashboard/summary", response_model=DashboardSummary)
def get_user_dashboard_summary(
        db: Session = Depends(get_db),
        user: User = Depends(get_current_user)
):
    user_service = UserService(db)
    summary = user_service.get_dashboard_summary(user.id)

    if not summary:
        raise HTTPException(status_code=404, detail="User not found")

    return summary
