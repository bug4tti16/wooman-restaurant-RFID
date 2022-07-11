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

# Cache
# 창을 끄거나, 새로고침을 한 경우, 기존 기록 불러오기
# 단, python을 종료했을 시에는 소멸
cache = []
cacheDate = ''

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
ChartList = []

for index, (id, name) in enumerate(zip(userIndex, userList)):
    if id.isnumeric():
        stripName = "".join(name.split())
        ChartNumToName[int(id)] = [stripName, index] # chart index
        ChartNameToNum[stripName] = [int(id), index]
        ChartList.append({'id': int(id), 'name': stripName})


# print(ChartNameToNum)
# print(ChartNumToName)


# 오늘 날짜 설정
dt=datetime.datetime.now()
today_month=dt.month
today_day=dt.day
today=str(today_month)+"_"+str(today_day)

# userChartJson = json.dumps(userChartDict, ensure_ascii=False)
# print(json.dumps(np.array(chart)))
# @app.get("/test")
# def getTest():
#     return ['dsa', 'fde', 'feds']

# 경로 식당 유저 목록
@app.get("/user/all/list")
async def get_user_type_list():
    # print(json.dumps(userList.tolist()))
    return ChartList

# @app.get("/user/all/json")
# async def get_user_type_json():

#     # print(json.dumps(userList.tolist()))
    
#     # return userChartJson
#     return JSONResponse({
#         'name': ChartNameToNum,
#         'id': ChartNumToName
#     })


# @app.get("/items/{item_id}")
# def read_item(item_id: int, q: Union[str, None] = None):
#     return {"item_id": item_id, "q": q}

class Guest (BaseModel):
    id: int

# REST API
@app.post("/user/id")
def use_card(guest: Guest):
    global chart
    if guest.id in ChartNumToName.keys():
        name = ChartNumToName[guest.id][0]
        index = ChartNumToName[guest.id][1]
        chart[index][-1]=카드지참
        cache.append({
            "result": True,
            "name": name,
            "id": guest.id,
            "error": 0,
            "type": 0
        })

        return {
            "result": True,
            "name": name,
            "id": guest.id,
            "error": 0
        }
    else:
        cache.append({
            "result": False,
            "name": "",
            "id": guest.id,
            "error": 1,
            "type": 1
        })

        return {
            "result": False,
            "name": "",
            "id": guest.id,
            "error": 1
        }


class GuestName (BaseModel):
    name: str

@app.post("/user/name")
def use_name(guestName: GuestName):
    global chart
    if guestName.name in ChartNameToNum.keys():
        id = ChartNameToNum[guestName.name][0]
        index = ChartNameToNum[guestName.name][1]
        chart[index][-1]=카드미지참

        cache.append({
            "result": True,
            "name": guestName.name,
            "id": id,
            "error": 0,
            "type": 0
        })

        return {
            "result": True,
            "name": guestName.name,
            "id": id,
            "error": 0
        }
    else:

        cache.append({
            "result": False,
            "name": guestName.name,
            "id": "",
            "error": 2,
            "type": 1
        })

        return {
            "result": False,
            "name": guestName.name,
            "id": "",
            "error": 2
        }

# 날짜 시작하기
class DateType (BaseModel):
    today: str


@app.get("/prestart")
def pre_start():
    global cacheDate, cache
    if cacheDate == '' or len(cache) == 0:
        # 이전 기록 없음
        return {
            "result": False
        }
    return {
        "result": True,
        "cache": cache
    }
    


@app.post("/start")
def use_name(todayDate: DateType):
    global chart, today, today_month, today_day, cacheDate
    # print(datetime_obj)
    # print(datetime_obj.date(), datetime_obj.time())

    startDate = datetime.datetime.strptime(todayDate.today, "%Y-%m-%dT%H:%M:%S.%fZ")
    timezone_kst =  datetime.timezone(datetime.timedelta(hours=9))
    datetime_kst = startDate.astimezone(timezone_kst)

    today_month = datetime_kst.month
    today_day = datetime_kst.day
    today= str(today_month) + '_' + str(today_day)
    cacheDate = today

    # Windows에서 작동 안됨
    # datetime_kst.strftime("%-m_%-d")
    # today_month=datetime_kst.strftime("%-m")
    # today_day=datetime_kst.strftime("%-d")

    print(today, today_month, today_day)

    # 진우 코드 복붙 62 ~ 93
    if(len(chart[0])>2):
        lastday=chart[0][len(chart[0])-1]
        slash=lastday.find("_")
        lastday_month=int(lastday[:slash])
        lastday_day=int(lastday[(slash+1):])

        if(lastday_month!=today_month):
            print("새 달이 시작했습니다. 명부를 초기화하겠습니다")
            print("지난 달의 기록은 data 폴더에서 확인하세요")
            year=str(dt.year-int(dt.month==1))
            df=pandas.DataFrame(chart)

            
            file_name="../data/"+year+"#"+chart[0][2]+"_to_"+chart[0][-1]+".csv"
            df.to_csv(os.path.join(BASE_DIR, file_name),index=False,header=False, encoding='cp949')
            f=open(os.path.join(BASE_DIR, '../user_list_new.csv'), 'r', encoding='cp949')
            rdr = csv.reader(f)
            chart=[line for line in rdr]
            print("차트의 길이는 "+str(len(chart))+" 입니다")
            chart[0].append(today)
            for j in range(1,len(chart)):
                chart[j].append('')
        else:
            day_passed=today_day-lastday_day
            for i in range(day_passed):
                chart[0].append(str(dt.month)+"_"+str(lastday_day+i+1))
                for j in range(1,len(chart)):
                    chart[j].append('')
    else:
        chart[0].append(today)
        for j in range(1,len(chart)):
            chart[j].append('')
        print(chart)

    return {
        "result": True
    }


# 취소
@app.delete("/user/id")
def user_revert(guest: Guest):
    global chart
    print(guest.id)
    if guest.id in ChartNumToName.keys():

        index = ChartNumToName[guest.id][1]
        chart[index][-1]=''

        cache.append({
            "result": True,
            "name": ChartNumToName[guest.id][0],
            "id": guest.id,
            "error": 3,
            "type": 2
        })



        return {
            "result": True,
            "name": ChartNumToName[guest.id][0],
            "id": guest.id,
            "error": 3
        }
    else: # 여기에 들어갈 일 x

        cache.append({
            "result": False,
            "name": "",
            "id": guest.id,
            "error": 1,
            "type": 2
        })

        return {
            "result": False,
            "name": "",
            "id": guest.id,
            "error": 1
        } 


# 저장
@app.post("/save")
def save():
    global chart
    df = pandas.DataFrame(chart)
    df.to_csv(os.path.join(BASE_DIR, "../user_list.csv"), index=False,header=False, encoding='cp949')
    return {
        "result": True
    }

# 종료
@app.get("/kill")
def kill_server():
    global chart
    df=pandas.DataFrame(chart)
    df.to_csv(os.path.join(BASE_DIR, "../user_list.csv"), index=False,header=False, encoding='cp949')
    if sys.platform == 'win32':
        os.system('taskkill /f /im python.exe')
    else:
        os.system("killall python")


# SPA React Render
app.mount("/", StaticFiles(directory=os.path.join(BASE_DIR, "../frontend/build"), html = True), name="static")

# Production
# 배포 시, 주석 풀기
webbrowser.open('http://localhost:8000')
if __name__ == "__main__":
    uvicorn.run(app, port=8000)
