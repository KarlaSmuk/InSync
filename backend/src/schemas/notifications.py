from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel


class EventTypeEnum(str, Enum):
    TASK_UPDATED = "TASK_UPDATED"  # for multiple attributes update
    TASK_ASSIGNED = "TASK_ASSIGNED"
    TASK_UNASSIGNED = "TASK_UNASSIGNED"
    TASK_TITLE_CHANGED = "TASK_TITLE_CHANGED"
    TASK_DELETED = "TASK_DELETED"
    TASK_STATUS_CHANGED = "TASK_STATUS_CHANGED"
    TASK_DUE_DATE_CHANGED = "TASK_DUE_DATE_CHANGED"
    TASK_COMPLETED = "TASK_COMPLETED"
    TASK_DESCRIPTION_CHANGED = "TASK_DESCRIPTION_CHANGED"


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
    taskName: str
    workspaceId: UUID
    workspaceName: str
    creatorId: UUID
    creatorName: str
    isRead: bool
    notifiedAt: datetime

    class Config:
        from_attributes = True
