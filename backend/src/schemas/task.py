from datetime import date
from typing import Optional, List
from uuid import UUID

from pydantic import BaseModel

from schemas.user import UserResponse
from schemas.workspace import WorkspaceStatusResponse


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
    statusId: Optional[UUID] = None
    assignees: Optional[List[UUID]] = None


class TaskCreateResponse(BaseModel):
    id: UUID
    title: str
    description: Optional[str]
    dueDate: Optional[date]
    workspaceId: UUID
    statusId: UUID
    assigneesIds: List[UUID]

    class Config:
        from_attributes = True


class TaskResponse(BaseModel):
    id: UUID
    title: str
    description: Optional[str]
    dueDate: Optional[date]
    workspaceId: UUID
    status: WorkspaceStatusResponse
    assignees: List[UserResponse]

    class Config:
        from_attributes = True


# to assign user to task
class AssigneeTask(BaseModel):
    assigneeId: UUID
    taskId: UUID

    class Config:
        from_attributes = True
