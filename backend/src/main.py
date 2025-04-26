from fastapi import FastAPI

from controllers.user import router as user_router

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Everything is fine!"}


app.include_router(user_router)
