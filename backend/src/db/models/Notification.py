import uuid
from enum import Enum

from sqlalchemy import Column, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import ENUM, UUID, TEXT
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
    TASK_DUE_DATE_CHANGED = "TASK_DUE_DATE_CHANGED"
    TASK_DESCRIPTION_CHANGED = "TASK_DESCRIPTION_CHANGED"
    TASK_TITLE_CHANGED = "TASK_TITLE_CHANGED"


class Notification(Base):
    __tablename__ = 'notification'

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    message = Column(TEXT, nullable=False)
    eventType = Column(ENUM(EventTypeEnum), nullable=False)
    createdAt = Column(DateTime(timezone=True),
                       server_default=func.now(),
                       default=func.now(),
                       nullable=False)

    # Foreign keys
    taskId = Column(UUID(as_uuid=True), ForeignKey('task.id', ondelete='CASCADE'))
    creatorId = Column(UUID(as_uuid=True), ForeignKey("user.id", ondelete="SET NULL"), nullable=True)

    # Relationship
    task = relationship("Task", back_populates="notifications")
    recipients = relationship("RecipientNotification", back_populates="notification", passive_deletes=True)
    creator = relationship("User", back_populates="created_notifications")
