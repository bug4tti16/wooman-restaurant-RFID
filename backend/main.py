import os
import webbrowser
from typing import Union
from fastapi import FastAPI, Request
from pydantic import BaseModel

import csv
import datetime
import pandas

import json
import uvicorn
import sys
import numpy as np
from dateutil.parser import parse

from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

app = FastAPI()

# 파일 경로 설정
BASE_DIR = os.path.dirname(os.path.realpath(__file__))

# CORS(Cross-Origin Resource Sharing) 허용
origins = ["*"]

################### User Interface ########################
카드지참="O" #ex) "O"
카드미지참="A" #ex) "A"
###########################################################

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
userIndex = np.array(chart).T[0]
# print(userList)

# User Json 생성
ChartNameToNum = {}
ChartNumToName = {}

ChartNum = set()
ChartName = set()

for index, name in zip(userIndex, userList):
    if index.isnumeric():
        stripName = "".join(name.split())
        i = int(index)
        ChartNumToName[i] = stripName
        ChartNameToNum[stripName] = i
        ChartNum.add(i)
        ChartName.add(stripName)



# 오늘 날짜 설정
dt=datetime.datetime.now()
today=str(dt.month)+"_"+str(dt.day)
today_month=dt.month
today_day=dt.day

print(today)




# userChartJson = json.dumps(userChartDict, ensure_ascii=False)
# print(json.dumps(np.array(chart)))
# @app.get("/test")
# def getTest():
#     return ['dsa', 'fde', 'feds']

# 경로 식당 유저 목록
@app.get("/user/all/list")
async def get_user_type_list():
    # print(json.dumps(userList.tolist()))
    return userList.tolist()[1:]

@app.get("/user/all/json")
async def get_user_type_json():

    # print(json.dumps(userList.tolist()))
    
    # return userChartJson
    return JSONResponse({
        'name': ChartNameToNum,
        'index': ChartNumToName
    })


# @app.get("/items/{item_id}")
# def read_item(item_id: int, q: Union[str, None] = None):
#     return {"item_id": item_id, "q": q}

class Guest (BaseModel):
    index: int

# REST API
@app.post("/user/id")
def use_card(guest: Guest):
    # print(guest.index)
    if guest.index in ChartNum:
        # print(ChartNumToName[guest.index], guest.index)
        return {
            "result": True,
            "name": ChartNumToName[guest.index],
            "index": guest.index,
            "error": 0
        }
    else:
        return {
            "result": False,
            "name": "",
            "index": guest.index,
            "error": 1
        }


class GuestName (BaseModel):
    name: str

@app.post("/user/name")
def use_name(guestName: GuestName):
    if guestName.name in ChartName:
        return {
            "result": True,
            "name": guestName.name,
            "index": ChartNameToNum[guestName.name],
            "error": 0
        }
    else:
        return {
            "result": False,
            "name": guestName.name,
            "index": "",
            "error": 2
        }


# 날짜 시작하기
class DateType (BaseModel):
    today: str



@app.post("/start")
def use_name(today: DateType):
    print(today.today)
    # datetime_obj = parse(today.today)
    # print(datetime_obj)
    # print(datetime_obj.date(), datetime_obj.time())
    startDate = datetime.datetime.strptime(today.today, "%Y-%m-%dT%H:%M:%S.%fZ")

    timezone_kst =  datetime.timezone(datetime.timedelta(hours=9))
    datetime_kst = startDate.astimezone(timezone_kst)
    print(startDate)
    print(datetime_kst)
    print(datetime_kst.strftime("%-m_%-d"))
    return {
        "result": True
    }


# 취소
@app.delete("/user/id")
def user_revert(guest: Guest):
    print(guest.index)
    if guest.index in ChartNum:
        # print(ChartNumToName[guest.index], guest.index)
        return {
            "result": True,
            "name": ChartNumToName[guest.index],
            "index": guest.index,
            "error": 3
        }
    else: # 여기에 들어갈 일 x
        return {
            "result": False,
            "name": "",
            "index": guest.index,
            "error": 1
        } 




@app.get("/kill")
def kill_server():
    sys.exit()


# SPA React Render
app.mount("/", StaticFiles(directory=os.path.join(BASE_DIR, "../frontend/build"), html = True), name="static")


# Production
# 배포 시, 주석 풀기
# webbrowser.open('http://localhost:8000')
# if __name__ == "__main__":
#     uvicorn.run(app, port=8000)
    
