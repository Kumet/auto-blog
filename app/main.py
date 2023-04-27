from fastapi import FastAPI
from api.endpoints import wordpress
app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


app.include_router(wordpress.router)
