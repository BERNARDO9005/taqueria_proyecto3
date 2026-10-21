@echo off
title Servidor Taqueria El Buen Taquito
echo Iniciando servidor en segundo plano en http://localhost:8000 ...
powershell -Command "Start-Process python -ArgumentList '-m http.server 8000' -WindowStyle Hidden"
timeout /t 1 /nobreak >nul
start http://localhost:8000
echo.
echo Servidor activo en http://localhost:8000
echo Puedes cerrar esta ventana. Para apagarlo, ejecuta detener_servidor.bat
pause
