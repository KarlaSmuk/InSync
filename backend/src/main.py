from fastapi import FastAPI

from controllers.task import router as task_router
from controllers.user import router as user_router
from controllers.workspace import router as workspace_router

app = FastAPI()

app.include_router(user_router)
app.include_router(workspace_router)
app.include_router(task_router)
