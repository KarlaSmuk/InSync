from uuid import UUID

from sqlalchemy.orm import Session

from db.models import WorkspaceTaskStatus
from schemas.workspaceTaskStatus import WorkspaceTaskStatusCreate


class WorkspaceTaskStatusService:
    def __init__(self, db: Session):
        self.db = db

    def create_default_workspace_task_status(self, workspaceId: UUID):
        default_statuses = ["To Do", "In Progress", "Completed"]
        for status in default_statuses:
            task_status_create = WorkspaceTaskStatusCreate(
                name=status,
                workspaceId=workspaceId
            )
            self.create_workspace_task_status(task_status_create)

    def create_workspace_task_status(self, task_status: WorkspaceTaskStatusCreate):
        new_status = WorkspaceTaskStatus(
            name=task_status.name,
            workspaceId=task_status.workspaceId
        )
        self.db.add(new_status)
        self.db.commit()
        self.db.refresh(new_status)

        return new_status

    def get_task_status_by_id(self, task_status_id: UUID):
        return self.db.query(WorkspaceTaskStatus).filter(WorkspaceTaskStatus.id == task_status_id).first()

    def get_workspace_task_statuses_by_workspace(self, workspace_id: UUID):
        return self.db.query(WorkspaceTaskStatus).filter(WorkspaceTaskStatus.workspaceId == workspace_id).all()
