@echo off
echo ========================================
echo SIMPLE: Add Only Test File to GitHub
echo ========================================
echo.

REM Try to navigate to GIFTSAI-FE folder
cd /d "D:\GiftsAI Automation\GIFTSAI-FE" 2>nul
if errorlevel 1 (
    echo Trying alternative path...
    cd /d "D:\⁭GiftsAI Automation\GIFTSAI-FE" 2>nul
    if errorlevel 1 (
        echo ERROR: Cannot find GIFTSAI-FE folder
        echo Please manually navigate to the folder and run these commands:
        echo.
        echo git checkout feature_fixes6
        echo git rm -r --cached Playwright
        echo rd /s /q Playwright
        echo mkdir Playwright\tests
        echo copy "d:\Playwright\tests\specified-user-signin.spec.ts" "Playwright\tests\"
        echo git add Playwright\tests\specified-user-signin.spec.ts
        echo git commit -m "Add specified-user-signin.spec.ts"
        echo git push origin feature_fixes6
        pause
        exit /b 1
    )
)

echo Current folder: %CD%
echo.

git checkout feature_fixes6
echo.

echo Removing old Playwright folder from git...
git rm -r --cached Playwright 2>nul
rd /s /q Playwright 2>nul
echo.

echo Creating fresh folders...
mkdir Playwright\tests 2>nul
echo.

echo Copying test file...
copy /Y "d:\Playwright\tests\specified-user-signin.spec.ts" "Playwright\tests\"
if errorlevel 1 (
    echo ERROR: Could not copy file
    pause
    exit /b 1
)
echo File copied successfully
echo.

echo Adding to git...
git add Playwright\tests\specified-user-signin.spec.ts
echo.

echo Committing...
git commit -m "Add specified-user-signin.spec.ts"
echo.

echo Pushing...
git push origin feature_fixes6
echo.

echo ========================================
echo DONE! Check GitHub now
echo ========================================
pause
