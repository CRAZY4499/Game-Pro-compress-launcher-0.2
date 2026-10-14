@echo off
cd /d "%~dp0"
title GameShrink Pro - Windows Launcher
color 0b
echo =================================================================
echo             GameShrink Pro - Extreme Optimization Engine
echo =================================================================
echo.

:: If package.json is not present, launch directly in browser/app mode
if not exist package.json (
    echo [MODE] Standalone Direct Launcher
    echo [INFO] Opening GameShrink Pro Desktop Window...
    start msedge --app="https://ais-dev-xfibgtwwyrwsemsum6wahb-708157321010.asia-northeast1.run.app" 2>nul || start https://ais-dev-xfibgtwwyrwsemsum6wahb-708157321010.asia-northeast1.run.app
    exit /b
)

echo [1/3] Checking Node.js installation...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [NOTICE] Node.js not found for local server.
    echo [INFO] Opening GameShrink Pro in Direct Web Mode...
    start msedge --app="https://ais-dev-xfibgtwwyrwsemsum6wahb-708157321010.asia-northeast1.run.app" 2>nul || start https://ais-dev-xfibgtwwyrwsemsum6wahb-708157321010.asia-northeast1.run.app
    exit /b
)

echo [OK] Node.js detected.
echo.

if not exist node_modules (
    echo [2/3] Installing dependencies for first-time launch...
    call npm install
    if %errorlevel% neq 0 (
        echo [WARNING] npm install failed. Launching Direct Engine instead...
        start msedge --app="https://ais-dev-xfibgtwwyrwsemsum6wahb-708157321010.asia-northeast1.run.app" 2>nul || start https://ais-dev-xfibgtwwyrwsemsum6wahb-708157321010.asia-northeast1.run.app
        exit /b
    )
) else (
    echo [2/3] Dependencies verified.
)

echo.
echo [3/3] Launching GameShrink Pro on http://localhost:3000 ...
start http://localhost:3000
call npm run dev
pause
