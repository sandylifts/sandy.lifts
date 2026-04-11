# SANDY.LIFTS — Copy Brand Logo to Public Folder
# Run this script once to set up the logo asset

$source = "C:\Users\Predator\.gemini\antigravity\brain\230c3258-4edb-4316-aaf2-cbfb078d162c\sandy_lifts_bicep_neon_1774835943808.png"
$dest = "$PSScriptRoot\public\sandy-lifts-classic-neon.png"

if (Test-Path $source) {
    Copy-Item -Path $source -Destination $dest -Force
    Write-Host "SUCCESS: Logo copied to public/sandy-lifts-classic-neon.png" -ForegroundColor Green
} else {
    Write-Host "ERROR: Source logo file not found at: $source" -ForegroundColor Red
    Write-Host "Please manually copy your logo image to: public/sandy-lifts-classic-neon.png" -ForegroundColor Yellow
}
