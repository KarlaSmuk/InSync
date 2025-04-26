from uuid import UUID

from pydantic import BaseModel


class WorkspaceTaskStatusCreate(BaseModel):
    name: str
    workspaceId: UUID


class WorkspaceTaskStatusResponse(BaseModel):
    id: UUID
    name: str
    workspaceId: UUID

    class Config:
        from_attributes = True
