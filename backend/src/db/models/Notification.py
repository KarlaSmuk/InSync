import uuid
from enum import Enum

from sqlalchemy import Column, ForeignKey
from sqlalchemy.dialects.postgresql import ENUM, UUID, TEXT, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .Base import Base


class EventTypeEnum(Enum):
    TASK_CREATED = "TASK_CREATED"
    TASK_UPDATED = "TASK_UPDATED"
    TASK_ASSIGNED = "TASK_ASSIGNED"
    TASK_UNASSIGNED = "TASK_UNASSIGNED"
    TASK_DELETED = "TASK_DELETED"
    TASK_STATUS_CHANGED = "TASK_STATUS_CHANGED"
    TASK_DUE_SOON = "TASK_DUE_SOON"
    TASK_COMPLETED = "TASK_COMPLETED"


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
    recipients = relationship("RecipientNotification", back_populates="notification")
