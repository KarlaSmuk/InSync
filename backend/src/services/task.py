from typing import List
from uuid import UUID

from fastapi import HTTPException
from sqlalchemy.orm import Session

from db.models import Task, Notification, User, RecipientNotification, AssigneeTask
from schemas.task import TaskCreate, TaskUpdate, EventTypeEnum


class TaskService:
    def __init__(self, db: Session):
        self.db = db

    # tasks
    def create_task(self, task_create: TaskCreate):
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

    def update_task(self, task_id: UUID, update_data: TaskUpdate):
        # Fetch the task from the database
        task = self.db.query(Task).filter(Task.id == task_id).first()
        if not task:
            return None

        # Initialize the list of notifications
        notifications = []

        # Track changes and events
        if update_data.title is not None and update_data.title != task.title:
            task.title = update_data.title
            notifications.append(self.create_notification(task_id, EventTypeEnum.TASK_UPDATED, "Task title updated"))

        if update_data.description is not None and update_data.description != task.description:
            task.description = update_data.description
            notifications.append(
                self.create_notification(task_id, EventTypeEnum.TASK_UPDATED, "Task description updated"))

        if update_data.dueDate is not None and update_data.dueDate != task.due_date:
            task.due_date = update_data.dueDate
            notifications.append(
                self.create_notification(task_id, EventTypeEnum.TASK_UPDATED, "Task due date updated"))

        if update_data.workspaceId is not None and update_data.workspaceId != task.workspace_id:
            task.workspace_id = update_data.workspaceId
            notifications.append(
                self.create_notification(task_id, EventTypeEnum.TASK_UPDATED, "Task workspace updated"))

        if update_data.statusId is not None and update_data.statusId != task.status_id:
            task.status_id = update_data.statusId
            notifications.append(
                self.create_notification(task_id, EventTypeEnum.TASK_STATUS_CHANGED, "Task status changed"))

        # Check if assignee is being added or removed
        if update_data.assignee is not None:
            if update_data.assignee != task.assignee:
                # Unassign the current assignee, if any
                if task.assignee is not None:
                    notifications.append(
                        self.create_notification(task_id, EventTypeEnum.TASK_UNASSIGNED, "Task unassigned"))

                # Assign the new assignee
                task.assignee = update_data.assignee
                notifications.append(self.create_notification(task_id, EventTypeEnum.TASK_ASSIGNED, "Task assigned"))

        # Commit the changes to the database
        self.db.commit()
        self.db.refresh(task)

        # Create notifications for each change
        for notification in notifications:
            self.db.add(notification)

        self.db.commit()

        # Return the updated task
        return task

    def get_task(self, task_id: UUID):
        task = self.db.query(Task).filter(Task.id == task_id).first()
        return task

    # notifications
    def create_notification(self, taskId: UUID, event_type: EventTypeEnum, message: str) -> Notification:
        # Create the notification
        notification = Notification(
            message=message,
            eventType=event_type,
            taskId=taskId
        )

        self.db.add(notification)
        self.db.commit()
        self.db.refresh(notification)

        # Assign recipients to notification
        task = self.db.query(Task).filter(Task.id == taskId).first()
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")

        assignee_ids = [assignee.assigneeId for assignee in task.assignees]
        if not assignee_ids:
            raise HTTPException(status_code=404, detail="No assignees found for this task")

        # Assign assignees to task
        self.assign_notification_to_users(notification.id, assignee_ids)

        return notification

    def assign_notification_to_users(self, notification_id: UUID, recipient_ids: List[UUID]):

        for recipient_id in recipient_ids:
            recipient_notification = RecipientNotification(
                recipientId=recipient_id,
                notificationId=notification_id,
                isRead=False
            )
            self.db.add(recipient_notification)

        self.db.commit()

        return "Notification successfully assigned to users"
