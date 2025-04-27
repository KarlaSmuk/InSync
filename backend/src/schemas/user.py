from datetime import datetime, date
from uuid import UUID

from pydantic import BaseModel

from db.models.Notification import EventTypeEnum
from schemas.workspace import WorkspaceStatusResponse, WorkspaceResponse


class UserBase(BaseModel):
    email: str
    username: str
    fullName: str


class UserCreate(UserBase):
    password: str


class UserUpdate(UserBase):
    password: str = None


class UserResponse(UserBase):
    id: UUID

    class Config:
        from_attributes = True


class NotificationTaskResponse(BaseModel):
    id: UUID
    title: str
    description: str
    dueDate: date
    workspace: WorkspaceResponse
    status: WorkspaceStatusResponse

    class Config:
        from_attributes = True


class UserNotificationResponse(BaseModel):
    id: UUID
    message: str
    eventType: EventTypeEnum
    createdAt: datetime
    task: NotificationTaskResponse

    class Config:
        from_attributes = True
