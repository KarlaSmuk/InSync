from datetime import datetime
from enum import Enum
from typing import List
from uuid import UUID

from pydantic import BaseModel


class EventTypeEnum(str, Enum):
    TASK_CREATED = "TASK_CREATED"
    TASK_UPDATED = "TASK_UPDATED"
    TASK_ASSIGNED = "TASK_ASSIGNED"
    TASK_UNASSIGNED = "TASK_UNASSIGNED"
    TASK_DELETED = "TASK_DELETED"
    TASK_STATUS_CHANGED = "TASK_STATUS_CHANGED"
    TASK_DUE_SOON = "TASK_DUE_SOON"
    TASK_COMPLETED = "TASK_COMPLETED"


class NotificationCreate(BaseModel):
    message: str
    eventType: EventTypeEnum
    taskId: UUID


class NotificationResponse(BaseModel):
    id: UUID
    message: str
    eventType: EventTypeEnum
    createdAt: datetime
    taskId: UUID
    recipient_ids: List[UUID]

    class Config:
        from_attributes = True


# to assign user/s to notification
class RecipientNotification(BaseModel):
    recipient_id: UUID
    notification_id: UUID
    is_read: bool
    notified_at: datetime

    class Config:
        orm_mode = True
