from datetime import date
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
