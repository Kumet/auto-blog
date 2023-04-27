from fastapi import FastAPI
from api.endpoints import wordpress
from api.endpoints import ai
app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


app.include_router(wordpress.router)
app.include_router(ai.router)