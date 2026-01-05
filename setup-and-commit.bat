@echo off
echo ========================================
echo Setup Playwright in GIFTSAI-FE and Commit Single Test
echo ========================================
echo.

REM Navigate to GIFTSAI-FE
cd /d "D:\GiftsAI Automation\GIFTSAI-FE"
echo Current directory: %CD%
echo.

REM Check if Playwright folder exists
if not exist "Playwright" (
    echo Creating Playwright folder structure...
    mkdir Playwright
    mkdir Playwright\pages
    mkdir Playwright\utils
    mkdir Playwright\tests
    echo Playwright folders created
) else (
    echo Playwright folder already exists
)

REM Copy entire Playwright structure (pages, utils, config files)
echo.
echo Copying Playwright project files...

REM Copy pages folder
echo Copying pages...
xcopy /E /I /Y "d:\Playwright\pages" "Playwright\pages"

REM Copy utils folder
echo Copying utils...
xcopy /E /I /Y "d:\Playwright\utils" "Playwright\utils"

REM Copy config files
echo Copying config files...
copy /Y "d:\Playwright\playwright.config.ts" "Playwright\"
copy /Y "d:\Playwright\package.json" "Playwright\"
copy /Y "d:\Playwright\tsconfig.json" "Playwright\"
copy /Y "d:\Playwright\.gitignore" "Playwright\"

echo All Playwright structure copied!
echo.

REM Now copy ONLY the specified test file
echo Copying specified-user-signin.spec.ts...
copy /Y "d:\Playwright\tests\specified-user-signin.spec.ts" "Playwright\tests\"
echo Test file copied!
echo.

REM Git operations
echo Checking out feature_fixes6 branch...
git checkout feature_fixes6 2>nul
if errorlevel 1 (
    echo Branch doesn't exist, creating it...
    git checkout -b feature_fixes6
)
echo.

REM Add ONLY the test file to git
echo Adding ONLY specified-user-signin.spec.ts to git...
git add Playwright/tests/specified-user-signin.spec.ts
echo.

REM Show what will be committed
echo Files to be committed:
git status --short
echo.

REM Commit
echo Committing...
git commit -m "Add specified-user-signin.spec.ts test file"
echo.

REM Push
echo Pushing to GitHub...
git push origin feature_fixes6
echo.

if errorlevel 0 (
    echo ========================================
    echo SUCCESS!
    echo ========================================
    echo.
    echo Committed: Playwright/tests/specified-user-signin.spec.ts
    echo Branch: feature_fixes6
    echo Repository: GIFTSAI-FE
    echo.
    echo All other Playwright files are in place but not committed
) else (
    echo Push failed or nothing to commit
)

echo.
pause
