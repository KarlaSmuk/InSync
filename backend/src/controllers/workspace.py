from typing import List
from uuid import UUID

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from db.db import get_db
from schemas.workspace import WorkspaceCreate, WorkspaceResponse
from services.workspace import WorkspaceService

router = APIRouter(prefix="/api/workspace", tags=["workspace"])


@router.post("/", response_model=WorkspaceResponse)
def create_workspace(workspace: WorkspaceCreate, db: Session = Depends(get_db)):
    workspace_service = WorkspaceService(db)
    new_workspace = workspace_service.create_workspace(workspace)
    return new_workspace


@router.get("/{workspace_id}", response_model=WorkspaceResponse)
def get_workspace(workspace_id: UUID, db: Session = Depends(get_db)):
    workspace_service = WorkspaceService(db)
    workspace = workspace_service.get_workspace_by_id(workspace_id)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return workspace


@router.get("/user/{user_id}", response_model=List[WorkspaceResponse])
def get_workspaces(user_id: UUID, db: Session = Depends(get_db)):
    workspace_service = WorkspaceService(db)
    workspaces = workspace_service.get_workspaces_by_user(user_id)
    return workspaces


@router.delete("/", )
def get_workspaces(workspace_id: UUID, db: Session = Depends(get_db)):
    workspace_service = WorkspaceService(db)
    workspaces = workspace_service.delete_workspace(workspace_id)
    return workspaces
