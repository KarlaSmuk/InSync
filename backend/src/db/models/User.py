import uuid

from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import UUID, VARCHAR
from sqlalchemy.orm import relationship

from .Base import Base


class User(Base):
    __tablename__ = 'user'

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    email = Column(VARCHAR(320), unique=True, nullable=False)
    username = Column(VARCHAR(50), unique=True, nullable=False)
    passwordHash = Column(VARCHAR, nullable=False)
    fullName = Column(VARCHAR(225), nullable=False)

    # relationships
    assigned_tasks = relationship("AssigneeTask", back_populates="assignee")
    notifications = relationship("RecipientNotification", back_populates="recipient")
    workspace_memberships = relationship("WorkspaceUser", back_populates="user")
    created_notifications = relationship(
        "Notification",
        back_populates="creator",
        foreign_keys="[Notification.creatorId]",
    )
