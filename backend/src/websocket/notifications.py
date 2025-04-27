from typing import List
from uuid import UUID

from db.models.Notification import EventTypeEnum
from .connection_manager import ConnectionManager


class NotificationManager:
    def __init__(self, manager: ConnectionManager):
        self.manager = manager

    async def notify_users(self, task_id: UUID, event_type: EventTypeEnum, assignee_ids: List[UUID]):
        # Notify all assignees of the task about the update or creation
        for assignee_id in assignee_ids:
            message = f"Task {task_id} has been {event_type}."
            await self.manager.send_message(assignee_id, message)
