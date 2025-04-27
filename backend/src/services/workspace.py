from uuid import UUID

from sqlalchemy.orm import Session

from db.models import Workspace
from schemas.workspace import WorkspaceCreate
from services.workspaceTaskStatus import WorkspaceTaskStatusService


class WorkspaceService:
    def __init__(self, db: Session):
        self.db = db

    def create_workspace(self, workspace: WorkspaceCreate):
        new_workspace = Workspace(
            name=workspace.name,
            description=workspace.description,
            status=workspace.status,
            ownerId=workspace.ownerId
        )

        self.db.add(new_workspace)
        self.db.commit()
        self.db.refresh(new_workspace)

        # when creating workspace create 3 default workspace task statuses
        workspace_task_status_service = WorkspaceTaskStatusService(self.db)
        workspace_task_status_service.create_default_workspace_task_status(new_workspace.id)

        return new_workspace

    def get_workspace_by_id(self, workspace_id: UUID):
        return self.db.query(Workspace).filter(Workspace.id == workspace_id).first()

    def get_workspaces_by_user(self, user_id: UUID):
        return self.db.query(Workspace).filter(Workspace.ownerId == user_id).all()

    def delete_workspace(self, workspace_id: UUID):
        workspace = self.db.query(Workspace).filter(Workspace.id == workspace_id).first()
        if workspace:
            self.db.delete(workspace)
            self.db.commit()

    def get_workspace_statuses(self, workspace_id: UUID):
        workspace = self.db.query(Workspace).filter(Workspace.id == workspace_id).first()
        return workspace.taskStatuses
