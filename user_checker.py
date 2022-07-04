#우만종합사회복지관 경로식당 이용자 명단 기록 프로그램 by JinuJung
# Version 1.1

# 1.1 변경사항
#달이 넘어갈 경우 자동으로 data폴더에 저장되고 초기화하도록 하였음
#명단을 수동으로 저장하고 초기화하는 기능을 추가

################### User Interface ########################
카드지참="O" #ex) "O"
카드미지참="A" #ex) "A"
###########################################################

import csv
import datetime
import pandas

f=open('user_list.csv','r')
rdr = csv.reader(f)
chart=[line for line in rdr]
print("차트의 길이는 "+str(len(chart))+" 입니다")
print()
f.close()

dt=datetime.datetime.now()
today=str(dt.month)+"_"+str(dt.day)
today_month=dt.month
today_day=dt.day
print("오늘 날짜는 "+today+" 입니다. 기록하려는 날짜가 맞나요?")
print("(명단이 변경되어 초기화 하고자 하면 '초기화'라고 입력하세요)")

while(True):
    i=input()
    if(i=="초기화"):
        if(len(chart[0])==2):
            print("이미 초기화 상태입니다")
            print("오늘 날짜는 "+today+" 입니다. 기록하려는 날짜가 맞나요?")
            continue
        year=str(dt.year)
        df=pandas.DataFrame(chart)
        file_name="./data/"+year+"#"+chart[0][2]+"_to_"+chart[0][-1]+".csv"
        df.to_csv(file_name,index=False,header=False, encoding='cp949')
        
        f=open('user_list_new.csv','r')
        rdr = csv.reader(f)
        chart=[line for line in rdr]
        print("차트의 길이는 "+str(len(chart))+" 입니다")
        print()
        print("오늘 날짜는 "+today+" 입니다. 기록하려는 날짜가 맞나요?")

    elif(i in ['y',"맞아요","맞음","Y","ㅇㅇ","dd","넹","네","sp","yes","예스"]):
        break
    elif(i in ['n',"틀려요","틀림","아님","아니에요","N","ss","ㄴㄴ","ㄴ","노"]):
        print("오늘 날짜를 형식에 맞게 입력해주세요 ex) 6월24일-> 6_24")
        today=input()
        slash=today.find("_")
        today_month=int(today[:slash])
        today_day=int(today[(slash+1):])
        break
    else:
        print("날짜 맞으면 y, 틀리면 n을 입력해주세요")

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
        file_name="./data/"+year+"#"+chart[0][2]+"_to_"+chart[0][-1]+".csv"
        df.to_csv(file_name,index=False,header=False, encoding='cp949')
        
        f=open('user_list_new.csv','r')
        rdr = csv.reader(f)
        chart=[line for line in rdr]
        print("차트의 길이는 "+str(len(chart))+" 입니다")
        print()
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
    
print(today+" 식당 이용을 시작하겠습니다")
print("카드를 찍으시는 경우 번호 입력 바랍니다")
print("카드를 가져오시지 않은 경우 이름을 입력하거나 번호에 0을 붙쳐 입력바랍니다")
print("작업을 취소하고 싶으면 번호에 -를 붙쳐 입력바랍니다")
print("정보를 저장할 경우 저장 이라고 입력바랍니다")
print("식당 운영을 마무리할 경우 끝 이라고 입력바랍니다")
print()

while(True):
    i=input()
    if(i==''):
        pass
    elif(i in ["끝","꿑","finish","종료","ㄲ","Rmx","rMX"]):
        print("식당 운영을 종료합니다")
        break
    elif(i in ["저장","save","ㅈㅈ","ww","WW"]):
        df=pandas.DataFrame(chart)
        df.to_csv("user_list.csv",index=False,header=False, encoding='cp949')
        print("저장완료")
        temp=len(chart[0])-1
        count=0
        for i in range(len(chart)):
            if(chart[i][temp] in [카드지참,카드미지참]):
                count+=1
        print("현재 식당 이용자 수는 "+str(count)+"명 입니다")
    elif(i[0]=='-'):
        inti=-int(i)
        check=False
        for k in range(1,len(chart)):
            if(chart[k][0]==''):
                continue
            if(inti==int(chart[k][0])):
                chart[k][-1]=''
                check=True
                print(chart[k][0]+"번 "+chart[k][1]+" 님 오늘 기록 삭제완료")
                break
        if(not check):
            print("명단에 없는 번호입니다")
    elif(i[0]=='0'):
        inti=int(i)
        check=False
        for k in range(1,len(chart)):
            if(chart[k][0]==''):
                continue
            if(inti==int(chart[k][0])):
                chart[k][-1]=카드미지참
                check=True
                print(chart[k][0]+"번 "+chart[k][1]+" 님 확인완료")
                break
        if(not check):
            print("명단에 없는 번호입니다!")
    else:
        try:
            inti=int(i)
            check=False
            for k in range(1,len(chart)):
                if(chart[k][0]==''):
                    continue
                if(inti==int(chart[k][0])):
                    chart[k][-1]=카드지참
                    check=True
                    print(chart[k][0]+"번 "+chart[k][1]+" 님 확인완료")
                    break
            if(not check):
                print("명단에 없는 번호입니다")
        except:
            check=False
            similar=[]
            for k in range(1,len(chart)):
                if(i==chart[k][1]):
                    chart[k][-1]=카드미지참
                    check=True
                    print(chart[k][0]+"번 "+chart[k][1]+" 님 확인완료")
                    break
                elif(len(i)==len(chart[k][1])):
                     similarity=0
                     for w in range(len(i)):
                         if(i[w]==chart[k][1][w]):
                             similarity+=1
                     if(similarity>=2):
                         similar.append(chart[k][1])
            if(not check):
                print("명단에 없는 이름입니다")
                if(len(similar)>=1):
                    print("(유사이름명단- "+str(similar)+")")

        
df=pandas.DataFrame(chart)
df.to_csv("user_list.csv",index=False,header=False, encoding='cp949')

temp=len(chart[0])-1
count=0
for i in range(len(chart)):
    if(chart[i][temp] in [카드지참,카드미지참]):
        count+=1
print(today+" 식당 이용자 수는 "+str(count)+"명 입니다")
        
