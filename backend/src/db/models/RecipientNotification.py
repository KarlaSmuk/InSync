from sqlalchemy import Column, ForeignKey, BOOLEAN, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .Base import Base


class RecipientNotification(Base):
    __tablename__ = 'recipient_notification'

    recipientId = Column(UUID, ForeignKey("user.id"), primary_key=True)
    notificationId = Column(UUID, ForeignKey("notification.id"), primary_key=True)
    isRead = Column(BOOLEAN, default=False)
    notifiedAt = Column(TIMESTAMP, default=func.now())

    # relationships
    recipient = relationship("User", back_populates="notifications")
    notification = relationship("Notification", back_populates="recipients")
