from datetime import date, datetime
from enum import Enum
from typing import Optional, List
from uuid import UUID

from pydantic import BaseModel


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    dueDate: Optional[date] = None
    workspaceId: UUID
    statusId: UUID
    assignees: List[UUID]


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    dueDate: Optional[date] = None
    workspaceId: Optional[UUID] = None
    statusId: Optional[UUID] = None
    assignee: Optional[UUID] = None


class TaskResponse(BaseModel):
    id: UUID
    title: str
    description: Optional[str]
    dueDate: Optional[date]
    workspaceId: UUID
    statusId: UUID
    assignees: List[UUID]

    class Config:
        from_attributes = True


# to assign user to task
class AssigneeTask(BaseModel):
    assigneeId: UUID
    taskId: UUID

    class Config:
        from_attributes = True


# to assign user/s to notification for task
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
    recipientIds: List[UUID]

    class Config:
        from_attributes = True
