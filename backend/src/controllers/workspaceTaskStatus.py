from typing import List
from uuid import UUID

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from db.db import get_db
from schemas.workspaceTaskStatus import WorkspaceTaskStatusCreate, WorkspaceTaskStatusResponse
from services.workspaceTaskStatus import WorkspaceTaskStatusService

router = APIRouter(prefix="/api/workspace_task_status", tags=["workspace_task_status"])


@router.post("", response_model=WorkspaceTaskStatusResponse)
def create_workspace_task_status(task_status: WorkspaceTaskStatusCreate, db: Session = Depends(get_db)):
    task_status_service = WorkspaceTaskStatusService(db)
    new_status = task_status_service.create_workspace_task_status(task_status)
    return new_status


@router.get("/{task_status_id}", response_model=WorkspaceTaskStatusResponse)
def get_workspace_task_status(task_status_id: UUID, db: Session = Depends(get_db)):
    task_status_service = WorkspaceTaskStatusService(db)
    task_status = task_status_service.get_task_status_by_id(task_status_id)
    if not task_status:
        raise HTTPException(status_code=404, detail="Task Status not found")
    return task_status


@router.get("/workspace/{workspace_id}", response_model=List[WorkspaceTaskStatusResponse])
def get_workspace_task_statuses_by_workspace(workspace_id: UUID, db: Session = Depends(get_db)):
    task_status_service = WorkspaceTaskStatusService(db)
    task_statuses = task_status_service.get_workspace_task_statuses_by_workspace(workspace_id)
    return task_statuses
