import os
import pathlib
import csv
import serial
import keyboard
import re
import easygui



#카드번호 포맷 함수
def clean(string):
    result=""
    for x in string:
        if re.search('[A-Z]',x):
            result=result + x
        if re.search('[0-9]',x):
            result=result + x
    return result

#카드 번호 존재확인
def check(list,string,item):
    k=False
    for x in list:
        if string==x.get(item):
            k=True
    return (k)

#카드 번호 대체
def input(list,string,itemin,itemout):
    for x in list:
        if string==x.get(itemin):
            return (x.get(itemout))

#카드 번호 등록
def update(list,string,newdata,para1,para2):
    for x in list:
        if string==x.get(para1):
            x.update({para2:newdata})

def save1(list,filename):
    name=open(filename,'w')
    writer=csv.writer(name)
    writer.writerow(['Num', 'Name', 'RFID'])
    for dictionary in list:
        writer.writerow(dictionary.values())
    name.close()

def save(list,filename):
    keys=list[0].keys()
    with open(filename,'w',newline='') as output:
        dict_writer = csv.DictWriter(output,keys)
        dict_writer.writeheader()
        dict_writer.writerows(list)





#디렉토리 수정
path = pathlib.Path(__file__)
parent= path.parent.parent
os.chdir(parent)

#reading user list updated
fname=open("user_list_RFID.csv",'r')
dataa=list(csv.DictReader(fname))
fname.close()


#카드 리더기 인식
card_reader = 'COM3'
baud_rate = 9600

ser = serial.Serial(card_reader, baud_rate, timeout=1)

while True:
    data = ser.readline().decode('utf-8').strip()
    
    if re.search('[0-9]',data):
        card_no=clean(data)

        #카드 번호 확인
        v=check(dataa,card_no,'RFID')
        if v==True:
            t=input(dataa,card_no,'RFID','Num')
            keyboard.write(t)
            keyboard.press_and_release("enter")
        
        if v==False:
            prompt1="등록되지 않은 카드입니다.\n"
            prompt2="카드번호를 입력하십시오."
            while True:
                add=easygui.enterbox(prompt1+prompt2,"카드 번호 입력")
                if add!=None and add!="":
                    if check(dataa,add,"Num"):
                        break
                else:
                    prompt1="잘못된 입력입니다!!"
                    
            
            update(dataa,add,card_no,'Num','RFID')
            t=input(dataa,card_no,'RFID','Num')
            keyboard.write(t)
            keyboard.press_and_release("enter")
            save(dataa,"user_list_RFID.csv")
