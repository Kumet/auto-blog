from fastapi import FastAPI
from api.endpoints import wordpress
from api.endpoints import ai
app = FastAPI()

import json


@app.get("/")
def read_root():
    result_json = 'result/response_1682583410015.json'
    with open(result_json) as f:
        d = json.load(f)

    with open('result.html', 'w') as f:
        f.write(d)
    return {"Hello": "World"}


app.include_router(wordpress.router)
app.include_router(ai.router)