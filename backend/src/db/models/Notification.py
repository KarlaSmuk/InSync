import uuid
from enum import Enum

from sqlalchemy import Column, ForeignKey
from sqlalchemy.dialects.postgresql import ENUM, UUID, TEXT, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .Base import Base
from .associations import recipient_notification


class EventTypeEnum(Enum):
    TASK_CREATED = "Task created"
    TASK_UPDATED = "Task updated"
    TASK_ASSIGNED = "Task assigned"
    TASK_UNASSIGNED = "Task unassigned"
    TASK_DELETED = "Task deleted"
    TASK_STATUS_CHANGED = "Task status changed"
    TASK_DUE_SOON = "Task due soon"
    TASK_COMPLETED = "Task completed"


class Notification(Base):
    __tablename__ = 'notification'

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    message = Column(TEXT, nullable=False)
    eventType = Column(ENUM(EventTypeEnum), nullable=False)
    createdAt = Column(TIMESTAMP, default=func.now())

    # Foreign keys
    taskId = Column(UUID(as_uuid=True), ForeignKey('task.id', ondelete='CASCADE'))

    # Relationship
    task = relationship("Task", back_populates="notifications")

    recipients = relationship(
        "User",
        secondary=recipient_notification,
        back_populates="notifications"
    )
