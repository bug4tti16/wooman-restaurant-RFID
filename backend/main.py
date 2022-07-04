from typing import Union
from fastapi import FastAPI

import csv
import datetime
import pandas
import json
import numpy as np


from fastapi.middleware.cors import CORSMiddleware

origins = ["*"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


f=open('../user_list.csv','r', encoding='cp949')
rdr = csv.reader(f)
chart=[line for line in rdr]
# print(chart)
f.close()

# for i in range(len(chart)):
#     print(chart[i])

df = pandas.DataFrame(chart)
userList = np.array(chart).T[1]
print(userList)

@app.get("/")
def read_root():
    return {"Hello": "World"}

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

