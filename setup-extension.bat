@echo off
REM Quick setup script for PARSEC extension

echo.
echo ===================================
echo   PARSEC Extension - Quick Setup
echo ===================================
echo.

REM Step 1: Uninstall old version
echo [1/3] Uninstalling old extension...
code --uninstall-extension parsec >nul 2>&1

REM Step 2: Install new version
echo [2/3] Installing updated extension...
code --install-extension "%~dp0vscode-extension\parsec-vscode-0.1.0.vsix" --force

REM Step 3: Open workspace
echo [3/3] Opening workspace in VS Code...
code "%~dp0"

echo.
echo ===================================
echo   Setup Complete!
echo ===================================
echo.
echo Next steps:
echo 1. Create a test.parsec file
echo 2. Run: node server.js
echo 3. Press Ctrl+Shift+P and type "PARSEC: Toggle Preview"
echo.
echo For AI code generation:
echo - Ctrl+Shift+I (Copilot Chat)
echo - Ask: "@workspace generate a PARSEC counter app"
echo.
pause
