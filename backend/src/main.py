from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import HTMLResponse

from controllers.auth import router as auth_router
from controllers.task import router as task_router
from controllers.user import router as user_router
from controllers.workspace import router as workspace_router
from websocket import router as websocket_router

app = FastAPI()
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(workspace_router)
app.include_router(task_router)
app.include_router(websocket_router)


# app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/test-websocket/{userId}", response_class=HTMLResponse)
async def test_websocket():
    html_file = Path(__file__).parent / "static" / "test_ws.html"
    return HTMLResponse(content=html_file.read_text(), status_code=200)
