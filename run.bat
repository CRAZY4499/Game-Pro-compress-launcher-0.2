@echo off
cd /d "%~dp0"
title GameShrink Pro - Windows Launcher
color 0b
echo =================================================================
echo             GameShrink Pro - Extreme Optimization Engine
echo =================================================================
echo.
echo [1/3] Checking Node.js installation...

where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0c
    echo [ERROR] Node.js is not installed on this PC!
    echo Please install Node.js (LTS version) from: https://nodejs.org
    echo Once installed, double-click this run.bat file again.
    echo.
    pause
    exit /b
)

echo [OK] Node.js detected.
echo.

if not exist node_modules (
    echo [2/3] Installing dependencies for first-time launch...
    echo (This only takes a minute)...
    call npm install
    if %errorlevel% neq 0 (
        color 0c
        echo [ERROR] npm install encountered an issue.
        pause
        exit /b
    )
) else (
    echo [2/3] Dependencies verified.
)

echo.
echo [3/3] Launching GameShrink Pro on http://localhost:3000 ...
echo Opening your default browser...
start http://localhost:3000

call npm run dev
pause
