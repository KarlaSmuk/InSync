from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from db.models import Workspace, WorkspaceUser, User, Task, AssigneeTask
from schemas.workspace import WorkspaceCreate
from services.workspaceTaskStatus import WorkspaceTaskStatusService


class WorkspaceService:
    def __init__(self, db: Session):
        self.db = db

    def create_workspace(self, workspace: WorkspaceCreate, userId: UUID):
        new_workspace = Workspace(
            name=workspace.name,
            description=workspace.description,
            status=workspace.status
        )

        self.db.add(new_workspace)
        self.db.commit()
        self.db.refresh(new_workspace)

        # Add a creator as a member in workspace_user
        workspace_user = WorkspaceUser(
            workspaceId=new_workspace.id,
            userId=userId
        )
        self.db.add(workspace_user)
        self.db.commit()

        # when creating workspace create 3 default workspace task statuses
        workspace_task_status_service = WorkspaceTaskStatusService(self.db)
        workspace_task_status_service.create_default_workspace_task_status(new_workspace.id)

        return new_workspace

    def add_members(self, userIds: list, workspaceId: UUID):
        for userId in userIds:
            workspace_user = WorkspaceUser(
                workspaceId=workspaceId,
                userId=userId
            )
            self.db.add(workspace_user)
        self.db.commit()
        return self.get_workspace_by_id(workspaceId)

    def remove_member(self, userId: UUID, workspaceId: UUID):
        workspace_user = (
            self.db.query(WorkspaceUser)
            .filter(
                WorkspaceUser.workspaceId == workspaceId,
                WorkspaceUser.userId == userId,
            )
            .one_or_none()
        )

        self.db.delete(workspace_user)
        self.db.commit()

        return self.get_workspace_by_id(workspaceId)

    def get_workspace_by_id(self, workspace_id: UUID):
        return self.db.query(Workspace).filter(Workspace.id == workspace_id).first()

    def get_workspaces_by_user(self, user_id: UUID):
        return (
            self.db.query(Workspace)
            .join(WorkspaceUser)
            .filter(WorkspaceUser.userId == user_id)
            .all()
        )

    def delete_workspace(self, workspace_id: UUID):
        workspace = self.db.query(Workspace).filter(Workspace.id == workspace_id).first()
        if workspace:
            self.db.delete(workspace)
            self.db.commit()

    def get_workspace_statuses(self, workspace_id: UUID):
        workspace = self.db.query(Workspace).filter(Workspace.id == workspace_id).first()
        return workspace.taskStatuses

    def get_workspace_members(self, workspace_id: UUID):
        user_ids_subquery = (
            select(WorkspaceUser.userId)
            .where(WorkspaceUser.workspaceId == workspace_id)
        )

        # Query all users in a single query
        members = self.db.query(User).filter(User.id.in_(user_ids_subquery)).all()

        return members

    def get_workspace_tasks(self, workspace_id: UUID):
        tasks = (
            self.db.query(Task)
            .filter(Task.workspaceId == workspace_id)
            .options(joinedload(Task.assignees).joinedload(AssigneeTask.assignee))
            .all()
        )
        return tasks
