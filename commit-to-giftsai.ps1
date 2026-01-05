# Git Commit Script for GIFTSAI-FE Repository
# This script commits specified-user-signin.spec.ts to feature_fixes6 branch

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Git Commit Script for GIFTSAI-FE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Copy file to GIFTSAI-FE
Write-Host "Step 1: Copying specified-user-signin.spec.ts to GIFTSAI-FE..." -ForegroundColor Yellow
$sourceFile = "d:\Playwright\tests\specified-user-signin.spec.ts"
$destFile = "D:\GiftsAI Automation\GIFTSAI-FE\Playwright\tests\specified-user-signin.spec.ts"

if (Test-Path $sourceFile) {
    Copy-Item -Path $sourceFile -Destination $destFile -Force
    Write-Host "✅ File copied successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Source file not found: $sourceFile" -ForegroundColor Red
    exit 1
}

# Step 2: Navigate to GIFTSAI-FE directory
Write-Host ""
Write-Host "Step 2: Navigating to GIFTSAI-FE directory..." -ForegroundColor Yellow
Set-Location "D:\GiftsAI Automation\GIFTSAI-FE"
Write-Host "✅ Changed directory to: $(Get-Location)" -ForegroundColor Green

# Step 3: Check current branch
Write-Host ""
Write-Host "Step 3: Checking current branch..." -ForegroundColor Yellow
git branch --show-current

# Step 4: Switch to feature_fixes6 branch
Write-Host ""
Write-Host "Step 4: Switching to feature_fixes6 branch..." -ForegroundColor Yellow
git checkout feature_fixes6 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Branch doesn't exist, creating it..." -ForegroundColor Yellow
    git checkout -b feature_fixes6
}
Write-Host "✅ On branch: feature_fixes6" -ForegroundColor Green

# Step 5: Add the file
Write-Host ""
Write-Host "Step 5: Adding file to git..." -ForegroundColor Yellow
git add Playwright/tests/specified-user-signin.spec.ts
Write-Host "✅ File added to staging" -ForegroundColor Green

# Step 6: Commit
Write-Host ""
Write-Host "Step 6: Committing changes..." -ForegroundColor Yellow
git commit -m "Add specified user signin test"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Commit successful!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Nothing to commit (file may already be committed)" -ForegroundColor Yellow
}

# Step 7: Push to GitHub
Write-Host ""
Write-Host "Step 7: Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "Pushing to: origin feature_fixes6" -ForegroundColor Cyan
git push origin feature_fixes6

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✅ SUCCESS! File committed and pushed!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "📁 File: specified-user-signin.spec.ts" -ForegroundColor Cyan
    Write-Host "🌿 Branch: feature_fixes6" -ForegroundColor Cyan
    Write-Host "🔗 Repository: GIFTSAI-FE" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ Push failed. Please check your credentials or network." -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
