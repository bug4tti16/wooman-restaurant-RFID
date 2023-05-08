@echo off
cd ../
git remote add upstream https://github.com/bug4tti16/wooman-restaurant-RFID.git
git pull
cd frontend && npm run build && pause
