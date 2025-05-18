import uuid
from enum import Enum

from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import ENUM, UUID, TEXT, VARCHAR
from sqlalchemy.orm import relationship

from .Base import Base


class WorkspaceStatusEnum(Enum):
    ACTIVE = "ACTIVE"
    PLANNING = "PLANNING"
    ON_HOLD = "ON_HOLD"
    COMPLETED = "COMPLETED"


class Workspace(Base):
    __tablename__ = 'workspace'

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    name = Column(VARCHAR(225), nullable=False)
    description = Column(TEXT)
    status = Column(ENUM(WorkspaceStatusEnum), nullable=False, default=WorkspaceStatusEnum.ACTIVE)

    # relationships
    owner = relationship("User", back_populates="workspaces")
    tasks = relationship("Task", back_populates="workspace", cascade="all, delete-orphan")
    taskStatuses = relationship("WorkspaceTaskStatus", back_populates="workspace", cascade="all, delete-orphan")
    memberships = relationship("WorkspaceUser", back_populates="workspace", cascade="all, delete-orphan")
