from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.db import get_db
from schemas.task import TaskCreate, TaskResponse, EventTypeEnum, TaskUpdate
from services.task import TaskService

router = APIRouter(prefix="/api/task", tags=["task"])


@router.post("/", response_model=TaskResponse)
async def create_task(task_create: TaskCreate, db: Session = Depends(get_db)):
    task_service = TaskService(db)

    try:
        new_task = task_service.create_task(task_create)
        if isinstance(new_task, str):
            raise HTTPException(status_code=404, detail=str)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    try:
        notification = task_service.create_notification(new_task.id, EventTypeEnum.TASK_CREATED,
                                                        f"Task '{new_task.title}' created.")
        if isinstance(notification, str):
            raise HTTPException(status_code=404, detail=str)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return TaskResponse(
        id=new_task.id,
        title=new_task.title,
        description=new_task.description,
        dueDate=new_task.dueDate,
        workspaceId=new_task.workspaceId,
        statusId=new_task.statusId,
        assignees=[assignee.assigneeId for assignee in new_task.assignees]  # Extract assigneeId as UUID
    )


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(task_id: UUID, task_update: TaskUpdate, db: Session = Depends(get_db)):
    task_service = TaskService(db)

    try:
        task = task_service.update_task(task_id, task_update)
        if task is None:
            HTTPException(status_code=404, detail="Task not found")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return task


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(task_id: UUID, db: Session = Depends(get_db)):
    task_service = TaskService(db)

    task = task_service.get_task(task_id)
    if task is None:
        HTTPException(status_code=404, detail="Task not found")

    return TaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        dueDate=task.dueDate,
        workspaceId=task.workspaceId,
        statusId=task.statusId,
        assignees=[assignee.assigneeId for assignee in task.assignees]
    )
