from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from controllers.auth import router as auth_router
from controllers.notifications import router as notifications_router
from controllers.task import router as task_router
from controllers.user import router as user_router
from controllers.workspace import router as workspace_router
from websocket import router as websocket_router

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # or use ["*"] for all origins (not recommended in prod)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(workspace_router)
app.include_router(task_router)
app.include_router(websocket_router)

app.include_router(notifications_router)
