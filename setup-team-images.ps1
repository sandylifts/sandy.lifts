# =============================================
# Sandy.Lifts – Team Image Setup Script
# Run this once to place team photos correctly
# =============================================

# Create the team folder inside public
$teamDir = ".\public\team"
if (!(Test-Path $teamDir)) {
    New-Item -ItemType Directory -Path $teamDir -Force
    Write-Host "Created: $teamDir" -ForegroundColor Green
} else {
    Write-Host "Folder already exists: $teamDir" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  MANUAL STEPS REQUIRED" -ForegroundColor Yellow
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Please save the following images manually:" -ForegroundColor White
Write-Host ""
Write-Host "1. Sandy's founder photo (the man in black suit + red tie)"  -ForegroundColor Green
Write-Host "   -> Save as: public\team\sandy-founder.jpg" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Sid's photo (the man in dark navy blazer + white shirt)" -ForegroundColor Green
Write-Host "   -> Save as: public\team\sid-marketing.jpg" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Himanshu's photo (the man in dark navy ribbed polo)" -ForegroundColor Green
Write-Host "   -> Save as: public\team\himanshu-dev.jpg" -ForegroundColor Gray
Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  After saving images, restart the dev server:" -ForegroundColor Yellow
Write-Host "  npm run dev" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
