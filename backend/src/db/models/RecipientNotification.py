from sqlalchemy import Column, ForeignKey, BOOLEAN, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .Base import Base


class RecipientNotification(Base):
    __tablename__ = 'recipient_notification'

    recipientId = Column(UUID, ForeignKey("user.id"), primary_key=True)
    notificationId = Column(UUID, ForeignKey("notification.id", ondelete='CASCADE'), primary_key=True)
    isRead = Column(BOOLEAN, default=False)
    notifiedAt = Column(DateTime(timezone=True),
                        server_default=func.now(),
                        nullable=False)

    # relationships
    recipient = relationship("User", back_populates="notifications", passive_deletes=True)
    notification = relationship("Notification", back_populates="recipients")
