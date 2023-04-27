from fastapi import FastAPI

from api.endpoints import ai, wordpress

app = FastAPI()

app.include_router(wordpress.router)
app.include_router(ai.router)
