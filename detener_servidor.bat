@echo off
title Detener Servidor Taqueria
echo Deteniendo el servidor en el puerto 8000...
powershell -Command "$p = (Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue).OwningProcess; if ($p) { Stop-Process -Id $p -Force; Write-Host 'Servidor detenido con exito.' } else { Write-Host 'No habia ningun servidor activo en el puerto 8000.' }"
pause
