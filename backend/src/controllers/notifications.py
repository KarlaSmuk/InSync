from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.db import get_db
from schemas.notifications import NotificationResponse
from services.notifications import NotificationService
from utils.auth import get_current_user

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


@router.get("/unread", response_model=List[NotificationResponse])
def list_unread_notifications(
        db: Session = Depends(get_db),
        current_user=Depends(get_current_user)
) -> List[NotificationResponse]:
    notificationService = NotificationService(db)
    return notificationService.list_notifications(current_user.id)


@router.patch("/{notification_id}/read", status_code=204)
def mark_notification_read(
        notification_id: UUID,
        db: Session = Depends(get_db),
        current_user=Depends(get_current_user)
) -> None:
    notificationService = NotificationService(db)
    result = notificationService.update_notification_read(notification_id, current_user.id)

    if result is None:
        raise HTTPException(status_code=404, detail="Notification not found")
