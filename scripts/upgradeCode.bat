@echo off
cd ../
git pull upstream master
cd frontend && npm run build && pause
