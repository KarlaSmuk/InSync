import uuid

from sqlalchemy import Column, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, VARCHAR
from sqlalchemy.orm import relationship

from .Base import Base


class WorkspaceTaskStatus(Base):
    __tablename__ = 'workspaceTaskStatus'

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    name = Column(VARCHAR(225), nullable=False)

    # Foreign keys
    workspaceId = Column(UUID, ForeignKey('workspace.id'))

    # relationships
    workspace = relationship("Workspace", back_populates="taskStatuses")
    tasks = relationship("Task", back_populates="status")
