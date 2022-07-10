@echo off
set s=작업이 완료되었습니다. 창을 닫아주세요.
cd ../frontend
del /s /q node_modules package-lock.json build
rmdir /s /q node_modules build
npm install && npm run build && echo %s% && pause > nul
