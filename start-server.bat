@echo off
chcp 65001 >nul
echo ========================================================
echo    تشغيل منصة مس مارينا التعليمية (React + Vite)
echo ========================================================
echo.
set "PATH=C:\Program Files\nodejs;%PATH%"
echo جاري تشغيل خادم React على: http://localhost:3000/
start "" http://localhost:3000/
npm.cmd run dev
pause
