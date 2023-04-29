from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.endpoints import ai, site_info, template, wordpress
from db.database import Base, engine

app = FastAPI()

Base.metadata.create_all(bind=engine)


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
app.include_router(site_info.router)
app.include_router(template.router)
