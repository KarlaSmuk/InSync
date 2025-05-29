from typing import List
from uuid import UUID

from sqlalchemy.orm import Session

from db.models import Notification, RecipientNotification
from schemas.notifications import NotificationResponse


class NotificationService:
    def __init__(self, db: Session):
        self.db = db

    def list_notifications(self, user_id: UUID) -> List[NotificationResponse]:
        # join Notification ← RecipientNotification
        results = (
            self.db.query(Notification, RecipientNotification)
            .join(
                RecipientNotification,
                Notification.id == RecipientNotification.notificationId
            )
            .filter(RecipientNotification.recipientId == user_id)
            .filter(RecipientNotification.isRead == False)
            .order_by(Notification.createdAt.desc())
            .all()
        )

        out: List[NotificationResponse] = []

        for notif, rn in results:
            task = notif.task  # relationship on Notification
            workspace = task.workspace  # relationship on Task
            creator = notif.creator  # relationship on Task

            out.append(NotificationResponse(
                id=notif.id,
                message=notif.message,
                eventType=notif.eventType,
                createdAt=notif.createdAt,
                taskId=notif.taskId,
                taskName=task.title,
                workspaceId=workspace.id,
                workspaceName=workspace.name,
                creatorId=creator.id,
                creatorName=creator.fullName,
                isRead=rn.isRead,
                notifiedAt=rn.notifiedAt,
            ))

        return out

    def update_notification_read(self, notification_id: UUID, user_id: UUID):
        rn = (
            self.db.query(RecipientNotification)
            .filter_by(
                recipientId=user_id,
                notificationId=notification_id
            )
            .first()
        )
        if not rn:
            return None

        rn.isRead = True
        self.db.commit()

        return rn

    def get_unred_notifications_count(self, user_id: UUID):
        unread_notifications = (
            self.db
            .query(RecipientNotification)
            .filter_by(recipientId=user_id, isRead=False)
            .count()
        )

        return unread_notifications
