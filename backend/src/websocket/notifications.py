# app/notifications/notifications.py
from datetime import datetime
from typing import List, Set
from uuid import UUID

from db.models.Notification import EventTypeEnum
from .connection_manager import ConnectionManager


class NotificationManager:
    def __init__(self, manager: ConnectionManager):
        self.manager = manager

    async def notify_task_event(
            self,
            notification_id: UUID,
            task_id: UUID,
            task_name: str,
            workspace_id: UUID,
            workspace_name: str,
            event_type: EventTypeEnum,
            creator_id: UUID,
            creator_name: str,
            assignee_ids: List[UUID],
            notified_at: datetime,
    ):
        payload = {
            "id": str(notification_id),
            "taskId": str(task_id),
            "taskName": task_name,
            "workspaceId": str(workspace_id),
            "workspaceName": workspace_name,
            "eventType": event_type.value,
            "message": f"Task '{task_name}' was {event_type.value.lower().replace('_', ' ')}.",
            "creatorId": str(creator_id),
            "creatorName": creator_name,
            "notifiedAt": notified_at.isoformat(),
        }

        # Collect unique recipients
        recipients: Set[UUID] = set(assignee_ids)
        recipients.add(creator_id)

        # Send JSON to each
        for user_id in recipients:
            await self.manager.send_json(user_id, payload)
