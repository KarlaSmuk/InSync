from typing import List, Tuple
from uuid import UUID

from sqlalchemy.orm import Session

from db.models import Task, Notification, User, RecipientNotification, AssigneeTask, WorkspaceTaskStatus
from schemas.notifications import EventTypeEnum
from schemas.task import TaskCreate, TaskUpdate
from websocket import notification_manager


class TaskService:
    def __init__(self, db: Session):
        self.db = db

    # tasks
    async def create_task(self, task_create: TaskCreate, creatorId: UUID):
        # Create a task
        task = Task(
            title=task_create.title,
            description=task_create.description,
            workspaceId=task_create.workspaceId,
            dueDate=task_create.dueDate,
            statusId=task_create.statusId
        )

        # Assign assignees to task
        for assignee_id in task_create.assignees:
            user = self.db.query(User).filter(User.id == assignee_id).first()
            if not user:
                return f"User with id {assignee_id} not found"
            task.assignees.append(AssigneeTask(assigneeId=user.id, taskId=task.id))

        self.db.add(task)
        self.db.commit()
        self.db.refresh(task)

        return task

    async def update_task(self, task_id: UUID, update_data: TaskUpdate, updatedBy: UUID):
        task = self.db.query(Task).filter(Task.id == task_id).first()
        if not task:
            return None

        # for saving events
        events: List[Tuple[EventTypeEnum, str]] = []

        if update_data.title is not None and update_data.title != task.title:
            old = task.title
            task.title = update_data.title
            events.append((
                EventTypeEnum.TASK_TITLE_CHANGED,
                f"Title changed from “{old}” to “{task.title}”"
            ))

        if update_data.description is not None and update_data.description != task.description:
            task.description = update_data.description
            events.append((
                EventTypeEnum.TASK_DESCRIPTION_CHANGED,
                "Description updated"
            ))

        if update_data.dueDate is not None and update_data.dueDate != task.dueDate:
            old = task.dueDate.isoformat() if task.dueDate else None
            task.dueDate = update_data.dueDate
            if old is None:
                events.append((
                    EventTypeEnum.TASK_DUE_DATE_CHANGED,
                    f"Due date set to {task.dueDate.isoformat()}"
                ))
            else:
                events.append((
                    EventTypeEnum.TASK_DUE_DATE_CHANGED,
                    f"Due date changed from {old} to {task.dueDate.isoformat()}"
                ))

        if update_data.statusId is not None and update_data.statusId != task.statusId:
            old_status = task.status.name
            task.statusId = update_data.statusId
            new_status = self.db.query(WorkspaceTaskStatus).filter(
                WorkspaceTaskStatus.id == update_data.statusId).first()
            events.append((
                EventTypeEnum.TASK_STATUS_CHANGED,
                f"Status changed from '{old_status}' to '{new_status.name}'"
            ))

        if update_data.assignees is not None:
            old_ids = {a.assigneeId for a in task.assignees}
            new_ids = set(update_data.assignees)
            actor = self.db.query(User).filter(User.id == updatedBy).first()

            # Unassignments
            for rid in old_ids - new_ids:
                # remove association
                self.db.query(AssigneeTask).filter(
                    AssigneeTask.taskId == task.id,
                    AssigneeTask.assigneeId == rid
                ).delete()

                if rid != updatedBy:
                    notif = self.create_notification(
                        taskId=task.id,
                        event_type=EventTypeEnum.TASK_UNASSIGNED,
                        message=f"You were unassigned",
                        recipient_ids=[rid],
                        creator_id=updatedBy
                    )
                    await notification_manager.notify_task_event(
                        notification_id=notif.id,
                        task_id=task.id,
                        task_name=task.title,
                        workspace_id=task.workspaceId,
                        workspace_name=task.workspace.name,
                        event_type=EventTypeEnum.TASK_UNASSIGNED,
                        message=notif.message,
                        creator_id=updatedBy,
                        creator_name=actor.fullName,
                        assignee_ids=[rid],
                        notified_at=notif.createdAt
                    )
            # Assignments
            for aid in new_ids - old_ids:
                task.assignees.append(AssigneeTask(assigneeId=aid, taskId=task.id))
                if aid != updatedBy:
                    notif = self.create_notification(
                        taskId=task.id,
                        event_type=EventTypeEnum.TASK_ASSIGNED,
                        message=f"You were assigned",
                        recipient_ids=[aid],
                        creator_id=updatedBy
                    )
                    await notification_manager.notify_task_event(
                        notification_id=notif.id,
                        task_id=task.id,
                        task_name=task.title,
                        workspace_id=task.workspaceId,
                        workspace_name=task.workspace.name,
                        event_type=EventTypeEnum.TASK_ASSIGNED,
                        message=notif.message,
                        creator_id=updatedBy,
                        creator_name=actor.fullName,
                        assignee_ids=[aid],
                        notified_at=notif.createdAt
                    )
        self.db.commit()
        self.db.refresh(task)

        # for notifying users
        creator = self.db.query(User).filter(User.id == updatedBy).first()
        current_ids = [a.assigneeId for a in task.assignees]
        recipients = [aid for aid in current_ids if aid != updatedBy]
        if len(events) > 0:
            self.db.add(task)
            self.db.commit()

            if len(events) == 1:
                evt, msg = events[0]
            else:
                evt = EventTypeEnum.TASK_UPDATED
                msg = "; ".join(m for _, m in events)

            notif = self.create_notification(
                taskId=task.id,
                event_type=evt,
                message=msg,
                recipient_ids=recipients,
                creator_id=updatedBy
            )

            await notification_manager.notify_task_event(
                notification_id=notif.id,
                task_id=task.id,
                task_name=task.title,
                workspace_id=task.workspaceId,
                workspace_name=task.workspace.name,
                event_type=evt,
                message=notif.message,
                creator_id=updatedBy,
                creator_name=creator.fullName,
                assignee_ids=recipients,
                notified_at=notif.createdAt,
            )

        return task

    def get_task(self, task_id: UUID):
        task = self.db.query(Task).filter(Task.id == task_id).first()
        assignees = self.db.query(User).join(AssigneeTask).filter(AssigneeTask.taskId == task_id).all()

        return task, assignees

    def get_task_status(self, task_id: UUID):
        task = self.db.query(Task).filter(Task.id == task_id).first()
        status = self.db.query(WorkspaceTaskStatus).filter(WorkspaceTaskStatus.id == task.statusId)
        return status

    # notifications
    def create_notification(
            self,
            taskId: UUID,
            event_type: EventTypeEnum,
            message: str,
            recipient_ids: List[UUID],
            creator_id: UUID
    ) -> Notification:
        # create the notification record
        notification = Notification(
            message=message,
            eventType=event_type,
            taskId=taskId,
            creatorId=creator_id
        )
        self.db.add(notification)
        self.db.commit()
        self.db.refresh(notification)

        # only assign it to the filtered recipients
        for recipient_id in recipient_ids:
            recipient_notification = RecipientNotification(
                recipientId=recipient_id,
                notificationId=notification.id,
                isRead=False
            )
            self.db.add(recipient_notification)
        self.db.commit()

        return notification

    async def delete_task(self, task_id: UUID):
        task = self.db.query(Task).filter(Task.id == task_id).first()
        if not task:
            return False

        self.db.delete(task)
        self.db.commit()

        return True
