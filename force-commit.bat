@echo off
echo ========================================
echo FORCE COMMIT Playwright Files
echo ========================================
echo.

cd /d "D:\GiftsAI Automation\GIFTSAI-FE"

echo Switching to feature_fixes6...
git checkout feature_fixes6
echo.

echo Forcing add of ALL Playwright files (ignoring .gitignore)...
git add -f Playwright/
echo.

echo Files to be committed:
git status --short
echo.

echo Committing...
git commit -m "Add complete Playwright test automation framework"
echo.

echo Pushing to GitHub...
git push -f origin feature_fixes6
echo.

echo ========================================
echo DONE! Check GitHub now
echo ========================================
echo.
pause
