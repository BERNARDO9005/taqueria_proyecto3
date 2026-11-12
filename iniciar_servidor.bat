@echo off
title Servidor Taqueria El Buen Taquito
cd /d "%~dp0"
echo Iniciando servidor en segundo plano en http://localhost:8000 ...
powershell -Command "Start-Process python -ArgumentList '-m http.server 8000' -WorkingDirectory '%~dp0' -WindowStyle Hidden"
timeout /t 2 /nobreak >nul
start http://localhost:8000
echo.
echo ========================================================
echo   Taqueria El Buen Taquito - Servidor Activo
echo ========================================================
echo   - Menu de Clientes:   http://localhost:8000
echo   - Panel de Admin:     http://localhost:8000/admin.html (PIN: 1234)
echo ========================================================
echo.
echo Puedes cerrar esta ventana. Para apagarlo, ejecuta detener_servidor.bat
pause
