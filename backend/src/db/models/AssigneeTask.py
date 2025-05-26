from sqlalchemy import Column, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from .Base import Base


class AssigneeTask(Base):
    __tablename__ = 'assignee_task'

    assigneeId = Column(UUID, ForeignKey("user.id"), primary_key=True)
    taskId = Column(UUID, ForeignKey("task.id", ondelete='CASCADE'), primary_key=True)

    # relationships
    assignee = relationship("User", back_populates="assigned_tasks")
    task = relationship("Task", back_populates="assignees", passive_deletes=True)
