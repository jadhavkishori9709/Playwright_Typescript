@echo off
echo ========================================
echo Commit Playwright Files to GitHub
echo ========================================
echo.

cd /d "D:\GiftsAI Automation\GIFTSAI-FE"
echo Current directory: %CD%
echo.

echo Switching to feature_fixes6 branch...
git checkout feature_fixes6
echo.

echo Current git status:
git status
echo.

echo Adding ALL Playwright files to git...
git add Playwright/
echo.

echo Files staged for commit:
git status --short
echo.

echo Committing all Playwright files...
git commit -m "Add Playwright test automation framework with specified-user-signin test"
echo.

echo Pushing to GitHub...
git push origin feature_fixes6
echo.

if errorlevel 0 (
    echo ========================================
    echo SUCCESS! All Playwright files committed
    echo ========================================
) else (
    echo Failed to push
)

echo.
pause
