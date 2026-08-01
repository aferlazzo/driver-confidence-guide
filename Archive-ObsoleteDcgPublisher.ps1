[CmdletBinding()]
param(
    [string]$ProjectRoot = "C:\Users\aferl\AdventureLearning\Driver Confidence Guide PDF Version",
    [switch]$Execute
)

$ErrorActionPreference = "Stop"
$archiveRoot = Join-Path $ProjectRoot "90_Archive\obsolete-publishing-pipeline-20260801"
$currentRepo = "C:\Users\aferl\AdventureLearning\driver-confidence-guide-live"
$names = @(
    "02_Web_Output",
    "publish_dcg.py",
    "buildWebPages.ps1",
    "dcg-publisher-v03",
    "dcg_publisher",
    "dcg_navigation_update_publisher.py"
)

if (-not (Test-Path -LiteralPath (Join-Path $ProjectRoot "01_Missions") -PathType Container)) {
    throw "Safety check failed: 01_Missions was not found under $ProjectRoot"
}
if (-not (Test-Path -LiteralPath (Join-Path $currentRepo "skill-01-nobody-ever-taught-me-this") -PathType Container)) {
    throw "Safety check failed: the current skill-based website was not found at $currentRepo"
}

$targets = @($names | ForEach-Object {
    $path = Join-Path $ProjectRoot $_
    if (Test-Path -LiteralPath $path) { Get-Item -LiteralPath $path }
})

if ($targets.Count -eq 0) {
    Write-Host "No obsolete publishing tools were found." -ForegroundColor Green
    return
}

Write-Host "Obsolete items selected for recoverable archiving:" -ForegroundColor Cyan
$targets | ForEach-Object { Write-Host "  $($_.FullName)" }
Write-Host "Archive destination: $archiveRoot"
Write-Host "Protected: $ProjectRoot\01_Missions"
Write-Host "Protected: $currentRepo"

if (-not $Execute) {
    Write-Host "PREVIEW ONLY: nothing was moved." -ForegroundColor Yellow
    Write-Host "Run again with -Execute after reviewing the list."
    return
}

New-Item -ItemType Directory -Path $archiveRoot -Force | Out-Null
foreach ($target in $targets) {
    $destination = Join-Path $archiveRoot $target.Name
    if (Test-Path -LiteralPath $destination) {
        throw "Archive destination already exists: $destination"
    }
    Move-Item -LiteralPath $target.FullName -Destination $destination
    Write-Host "Archived: $($target.Name)" -ForegroundColor DarkGray
}
Write-Host "Obsolete publishing tools were moved into the archive." -ForegroundColor Green

