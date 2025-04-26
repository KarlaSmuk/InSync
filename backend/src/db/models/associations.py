# tables for many-to-many relationships

from sqlalchemy import Table, Column, ForeignKey, BOOLEAN, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID

from .Base import Base

assignee_task = Table(
    "assignee_task",
    Base.metadata,
    Column("assigneeId", UUID, ForeignKey("user.id"), primary_key=True),
    Column("taskId", UUID, ForeignKey("task.id"), primary_key=True)
)

recipient_notification = Table(
    "recipient_notification",
    Base.metadata,
    Column("recipient_id", UUID, ForeignKey("user.id"), primary_key=True),
    Column("notification_id", UUID, ForeignKey("notification.id"), primary_key=True),
    Column("is_read", BOOLEAN, default=False),
    Column("notified_at", TIMESTAMP)
)
