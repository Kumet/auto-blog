from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.endpoints import ai, wordpress

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(wordpress.router)
app.include_router(ai.router)
