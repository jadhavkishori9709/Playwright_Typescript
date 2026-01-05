@echo off
echo ========================================
echo DEBUG: Check GIFTSAI-FE Playwright Status
echo ========================================
echo.

cd /d "D:\GiftsAI Automation\GIFTSAI-FE"
echo Current directory: %CD%
echo.

echo === Checking if Playwright folder exists locally ===
if exist "Playwright" (
    echo YES - Playwright folder exists
    echo.
    echo Contents of Playwright folder:
    dir Playwright /s /b
) else (
    echo NO - Playwright folder does not exist!
)

echo.
echo === Git Status ===
git status
echo.

echo === Files tracked by git in Playwright folder ===
git ls-files Playwright/
echo.

echo === Checking .gitignore ===
if exist ".gitignore" (
    echo .gitignore exists, checking for Playwright exclusions:
    findstr /i "playwright" .gitignore
) else (
    echo No .gitignore file found
)

echo.
pause
