from typing import List
from uuid import UUID

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from db.db import get_db
from schemas.user import UserResponse
from schemas.workspace import WorkspaceCreate, WorkspaceResponse, WorkspaceStatusResponse, WorkspaceMembersCreate
from services.workspace import WorkspaceService
from utils.auth import get_current_user

router = APIRouter(prefix="/api/workspace", tags=["workspace"])


@router.post("/", response_model=WorkspaceResponse)
def create_workspace(workspace: WorkspaceCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    workspace_service = WorkspaceService(db)
    new_workspace = workspace_service.create_workspace(workspace, current_user.id)
    return new_workspace


@router.post("/members", response_model=WorkspaceResponse)
def add_workspace_members(request: WorkspaceMembersCreate, db: Session = Depends(get_db),
                          current_user=Depends(get_current_user)):
    workspace_service = WorkspaceService(db)
    new_workspace = workspace_service.add_members(request.userIds, request.workspaceId)
    return new_workspace


@router.get("/all", response_model=List[WorkspaceResponse])
def get_workspaces_by_user(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    workspace_service = WorkspaceService(db)
    workspaces = workspace_service.get_workspaces_by_user(current_user.id)
    return workspaces


@router.get("/{workspace_id}", response_model=WorkspaceResponse)
def get_workspace_by_id(workspace_id: UUID, db: Session = Depends(get_db)):
    workspace_service = WorkspaceService(db)
    workspace = workspace_service.get_workspace_by_id(workspace_id)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return workspace


@router.delete("/", )
def delete_workspace(workspace_id: UUID, db: Session = Depends(get_db)):
    workspace_service = WorkspaceService(db)
    workspaces = workspace_service.delete_workspace(workspace_id)
    return workspaces


@router.get("/{workspace_id}/statuses", response_model=List[WorkspaceStatusResponse])
def get_workspace_statuses(workspace_id: UUID, db: Session = Depends(get_db)):
    workspace_service = WorkspaceService(db)
    statuses = workspace_service.get_workspace_statuses(workspace_id)
    return statuses


@router.get("/{workspace_id}/members", response_model=List[UserResponse])
def get_workspace_members(workspace_id: UUID, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    workspace_service = WorkspaceService(db)
    members = workspace_service.get_workspace_members(workspace_id)
    return members
