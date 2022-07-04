import os

from typing import Union
from fastapi import FastAPI, Request

import csv
import datetime
import pandas
import json
import uvicorn
import sys
import numpy as np


from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# 파일 경로 설정
BASE_DIR = os.path.dirname(os.path.realpath(__file__))

# CORS(Cross-Origin Resource Sharing) 허용
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# csv 파일 open
f=open(os.path.join(BASE_DIR, "../user_list.csv"),'r', encoding='cp949')
rdr = csv.reader(f)
chart=[line for line in rdr]
# print(chart)
f.close()

# for i in range(len(chart)):
#     print(chart[i])

df = pandas.DataFrame(chart)
userList = np.array(chart).T[1]
print(userList)

# @app.get("/test")
# def getTest():
#     return ['dsa', 'fde', 'feds']

# 경로 식당 유저 목록
@app.get("/user/all")
async def get_user_all():
    # print(json.dumps(userList.tolist()))
    return userList.tolist()[1:]


# @app.get("/items/{item_id}")
# def read_item(item_id: int, q: Union[str, None] = None):
#     return {"item_id": item_id, "q": q}

# REST API
@app.post("/user/id")
def use_card(id: int):
    print(id)
    return {
        "result": "true"
    }


@app.post("/user/name")
def use_name(name: str):
    print(name)
    return {
        "result": "true"
    }


@app.get("/kill")
def kill_server():
    sys.exit()


# SPA React Render
app.mount("/", StaticFiles(directory=os.path.join(BASE_DIR, "../frontend/build"), html = True), name="static")


if __name__ == "__main__":
    uvicorn.run(app, port=8000)

    