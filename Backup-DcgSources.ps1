[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)][string]$BackupRoot,
    [string]$ProjectRoot = "C:\Users\aferl\AdventureLearning\Driver Confidence Guide PDF Version",
    [switch]$Execute
)

$ErrorActionPreference = "Stop"
$source = Join-Path $ProjectRoot "01_Missions"
if (-not (Test-Path -LiteralPath $source -PathType Container)) {
    throw "Source folder not found: $source"
}

$sourceDrive = [IO.Path]::GetPathRoot((Resolve-Path -LiteralPath $source).Path)
$backupFull = [IO.Path]::GetFullPath($BackupRoot)
$backupDrive = [IO.Path]::GetPathRoot($backupFull)
$files = @(Get-ChildItem -LiteralPath $source -Recurse -File)
if ($files.Count -eq 0) { throw "No source files were found in $source" }
$bytes = ($files | Measure-Object Length -Sum).Sum
$gigabytes = [math]::Round($bytes / 1GB, 2)

Write-Host "Source: $source" -ForegroundColor Cyan
Write-Host "Destination: $backupFull"
Write-Host "Files: $($files.Count)"
Write-Host "Size: $gigabytes GB"
if ($sourceDrive -eq $backupDrive) {
    Write-Host "WARNING: source and backup are on the same drive. This does not protect against drive failure." -ForegroundColor Yellow
}

if (-not $Execute) {
    Write-Host "PREVIEW ONLY: no backup was created." -ForegroundColor Yellow
    Write-Host "Run again with -Execute after confirming the destination."
    return
}

New-Item -ItemType Directory -Path $backupFull -Force | Out-Null
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$zip = Join-Path $backupFull "DCG-Sources-$stamp.zip"
$checksumFile = "$zip.sha256.txt"
Compress-Archive -LiteralPath $source -DestinationPath $zip -CompressionLevel Optimal
if (-not (Test-Path -LiteralPath $zip -PathType Leaf)) { throw "Backup ZIP was not created." }
if ((Get-Item -LiteralPath $zip).Length -lt 1MB) { throw "Backup ZIP is unexpectedly small: $zip" }
$hash = Get-FileHash -LiteralPath $zip -Algorithm SHA256
"$($hash.Hash)  $([IO.Path]::GetFileName($zip))" | Set-Content -LiteralPath $checksumFile -Encoding ASCII
Write-Host "Backup created and verified:" -ForegroundColor Green
Write-Host "  $zip"
Write-Host "  $checksumFile"
