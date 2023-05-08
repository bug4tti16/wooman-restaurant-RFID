@echo off
cd ../
git pull
cd frontend && npm run build && pause
