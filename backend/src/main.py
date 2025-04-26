from fastapi import FastAPI

from controllers.user import router as user_router
from controllers.workspace import router as workspace_router

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Everything is fine!"}


app.include_router(user_router)
app.include_router(workspace_router)
