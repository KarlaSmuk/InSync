import uuid

from sqlalchemy import Column, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, TEXT, VARCHAR, TIMESTAMP
from sqlalchemy.orm import relationship

from .Base import Base
from .associations import assignee_task


class Task(Base):
    __tablename__ = 'task'

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    title = Column(VARCHAR(225), nullable=False)
    description = Column(TEXT)
    dueDate = Column(TIMESTAMP)

    # Foreign keys
    workspaceId = Column(UUID, ForeignKey('workspace.id'))
    statusId = Column(UUID, ForeignKey('workspaceTaskStatus.id'))

    # relationships
    workspace = relationship("Workspace", back_populates="tasks")
    status = relationship("WorkspaceTaskStatus", back_populates="tasks")

    assignees = relationship(
        "User",
        secondary=assignee_task,
        back_populates="assigned_tasks"
    )
