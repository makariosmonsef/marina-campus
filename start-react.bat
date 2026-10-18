@echo off
chcp 65001 >nul
echo ========================================================
echo    تشغيل منصة مس مارينا التعليمية (React + Vite)
echo ========================================================
echo.
set "PATH=C:\Program Files\nodejs;%PATH%"
echo جاري تشغيل خادم التطوير السريع لـ React...
echo الرابط المحلي: http://localhost:3000/
echo.
start "" http://localhost:3000/
npm.cmd run dev
pause
