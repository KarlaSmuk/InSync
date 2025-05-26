import uuid

from sqlalchemy import Column, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, TEXT, VARCHAR, DATE
from sqlalchemy.orm import relationship

from .Base import Base


class Task(Base):
    __tablename__ = 'task'

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    title = Column(VARCHAR(225), nullable=False)
    description = Column(TEXT)
    dueDate = Column(DATE)

    # Foreign keys
    workspaceId = Column(UUID, ForeignKey('workspace.id', ondelete='CASCADE'))
    statusId = Column(UUID, ForeignKey('workspaceTaskStatus.id'))

    # relationships
    workspace = relationship("Workspace", back_populates="tasks")
    status = relationship("WorkspaceTaskStatus", back_populates="tasks")
    notifications = relationship("Notification", back_populates="task", cascade="all, delete-orphan")
    assignees = relationship("AssigneeTask", back_populates="task", cascade="all, delete-orphan", passive_deletes=True)
