from enum import Enum
from uuid import UUID

from pydantic import BaseModel


class WorkspaceStatusEnum(str, Enum):
    ACTIVE = "ACTIVE"
    PLANNING = "PLANNING"
    ON_HOLD = "ON_HOLD"
    COMPLETED = "COMPLETED"


class WorkspaceCreate(BaseModel):
    name: str
    description: str
    status: WorkspaceStatusEnum
    ownerId: UUID

    class Config:
        from_attributes = True
        use_enum_values = True


class WorkspaceResponse(BaseModel):
    id: UUID
    name: str
    description: str
    status: WorkspaceStatusEnum
    ownerId: UUID

    class Config:
        from_attributes = True


class WorkspaceStatusResponse(BaseModel):
    id: UUID
    name: str

    class Config:
        from_attributes = True
