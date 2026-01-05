@echo off
echo ========================================
echo FIX: Remove Submodule and Add Files Properly
echo ========================================
echo.

cd /d "D:\GiftsAI Automation\GIFTSAI-FE"

echo Step 1: Remove Playwright as submodule...
git rm -r --cached Playwright
rd /s /q Playwright
echo.

echo Step 2: Copy Playwright files WITHOUT .git folder...
xcopy /E /I /Y "d:\Playwright\pages" "Playwright\pages"
xcopy /E /I /Y "d:\Playwright\utils" "Playwright\utils"
xcopy /E /I /Y "d:\Playwright\tests\specified-user-signin.spec.ts" "Playwright\tests\"
copy /Y "d:\Playwright\playwright.config.ts" "Playwright\"
copy /Y "d:\Playwright\package.json" "Playwright\"
copy /Y "d:\Playwright\tsconfig.json" "Playwright\"
echo.

echo Step 3: Add files to git (NOT as submodule)...
git add Playwright/
echo.

echo Step 4: Commit...
git commit -m "Add Playwright framework files (not as submodule)"
echo.

echo Step 5: Push...
git push origin feature_fixes6
echo.

echo ========================================
echo DONE! Files added as regular files, not submodule
echo ========================================
pause
