# Commit Only specified-user-signin.spec.ts
# This script commits ONLY the specified file, not the whole project

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Commit Single File to GIFTSAI-FE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to GIFTSAI-FE directory
Write-Host "Navigating to GIFTSAI-FE directory..." -ForegroundColor Yellow
Set-Location "D:\GiftsAI Automation\GIFTSAI-FE"
Write-Host "✅ Current directory: $(Get-Location)" -ForegroundColor Green

# Check current branch
Write-Host ""
Write-Host "Checking current branch..." -ForegroundColor Yellow
$currentBranch = git branch --show-current
Write-Host "Current branch: $currentBranch" -ForegroundColor Cyan

# Switch to feature_fixes6 if not already on it
if ($currentBranch -ne "feature_fixes6") {
    Write-Host ""
    Write-Host "Switching to feature_fixes6 branch..." -ForegroundColor Yellow
    git checkout feature_fixes6 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Creating feature_fixes6 branch..." -ForegroundColor Yellow
        git checkout -b feature_fixes6
    }
    Write-Host "✅ Switched to feature_fixes6" -ForegroundColor Green
}

# Copy ONLY the specified file
Write-Host ""
Write-Host "Copying specified-user-signin.spec.ts..." -ForegroundColor Yellow
$sourceFile = "d:\Playwright\tests\specified-user-signin.spec.ts"
$destDir = "D:\GiftsAI Automation\GIFTSAI-FE\Playwright\tests"

# Create directory if it doesn't exist
if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    Write-Host "✅ Created tests directory" -ForegroundColor Green
}

Copy-Item -Path $sourceFile -Destination $destDir -Force
Write-Host "✅ File copied" -ForegroundColor Green

# Add ONLY this specific file
Write-Host ""
Write-Host "Adding ONLY specified-user-signin.spec.ts to git..." -ForegroundColor Yellow
git add Playwright/tests/specified-user-signin.spec.ts
Write-Host "✅ File staged" -ForegroundColor Green

# Show what will be committed
Write-Host ""
Write-Host "Files to be committed:" -ForegroundColor Yellow
git status --short

# Commit
Write-Host ""
Write-Host "Committing..." -ForegroundColor Yellow
git commit -m "Add specified-user-signin.spec.ts test file"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Commit successful!" -ForegroundColor Green
    
    # Push
    Write-Host ""
    Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
    git push origin feature_fixes6
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "✅ SUCCESS!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "📁 Committed: Playwright/tests/specified-user-signin.spec.ts" -ForegroundColor Cyan
        Write-Host "🌿 Branch: feature_fixes6" -ForegroundColor Cyan
        Write-Host "🔗 Repo: GIFTSAI-FE" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Push failed" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️  Nothing to commit (file unchanged)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
