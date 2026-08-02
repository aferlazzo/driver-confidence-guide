[CmdletBinding(DefaultParameterSetName = "Preview")]
param(
    [Parameter(ParameterSetName = "Initialize")][switch]$Initialize,
    [Parameter(ParameterSetName = "Update")][switch]$Update,
    [Parameter(ParameterSetName = "Publish")][switch]$Publish,
    [Parameter(ParameterSetName = "Preview")]
    [Parameter(ParameterSetName = "Update")]
    [int[]]$Skill,
    [string]$ProjectRoot = "C:\Users\aferl\AdventureLearning\Driver Confidence Guide PDF Version",
    [string]$LiveRepo = "C:\Users\aferl\AdventureLearning\driver-confidence-guide-live"
)

$ErrorActionPreference = "Stop"
$stateFile = Join-Path $ProjectRoot ".skills-publish-state.json"
$sourceRoot = Join-Path $ProjectRoot "01_Missions"

function Stop-WithMessage([string]$Message) {
    Write-Host $Message -ForegroundColor Red
    return
}

function Assert-Environment {
    if (-not (Test-Path -LiteralPath $sourceRoot -PathType Container)) {
        throw "PDF source folder not found: $sourceRoot"
    }
    if (-not (Test-Path -LiteralPath (Join-Path $LiveRepo ".git") -PathType Container)) {
        throw "Current website Git repository not found: $LiveRepo"
    }
    if (-not (Test-Path -LiteralPath (Join-Path $LiveRepo "lesson-accessibility.js") -PathType Leaf)) {
        throw "Protected website behavior is missing: lesson-accessibility.js"
    }
    if (-not (Test-Path -LiteralPath (Join-Path $LiveRepo "adventures\adventure-v2.js") -PathType Leaf)) {
        throw "Protected Adventure behavior is missing: adventures\adventure-v2.js"
    }
    $remote = (& git -C $LiveRepo remote get-url origin 2>$null)
    if ($LASTEXITCODE -ne 0 -or $remote -notmatch 'aferlazzo/driver-confidence-guide') {
        throw "Safety check failed: unexpected Git remote: $remote"
    }
    & py -c "import fitz" 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "PyMuPDF is unavailable. Install it with: py -m pip install pymupdf"
    }
}

function Get-SkillSources {
    $records = @()
    $missionFolders = Get-ChildItem -LiteralPath $sourceRoot -Directory |
        Where-Object { $_.Name -match '^Mission_(\d{2})_' } |
        Sort-Object Name

    foreach ($missionFolder in $missionFolders) {
        $number = [int]([regex]::Match($missionFolder.Name, '^Mission_(\d{2})_').Groups[1].Value)
        if ($Skill -and $number -notin $Skill) { continue }

        $comicFolder = Join-Path $missionFolder.FullName "05_ComicLife3"
        if (-not (Test-Path -LiteralPath $comicFolder -PathType Container)) { continue }

        $pdfs = @(Get-ChildItem -LiteralPath $comicFolder -File -Filter "*.pdf")
        if ($pdfs.Count -eq 0) { continue }
        if ($pdfs.Count -gt 1) {
            throw "More than one PDF found for Skill $number in $comicFolder. Keep only the current PDF there."
        }

        $skillPrefix = "skill-{0:D2}-" -f $number
        $skillFolders = @(Get-ChildItem -LiteralPath $LiveRepo -Directory |
            Where-Object { $_.Name.StartsWith($skillPrefix) -and $_.Name -notmatch '-original$' })
        if ($skillFolders.Count -ne 1) {
            throw "Expected exactly one current website folder beginning '$skillPrefix'; found $($skillFolders.Count)."
        }

        $htmlFiles = @(Get-ChildItem -LiteralPath $skillFolders[0].FullName -File -Filter "skill-*.html")
        if ($htmlFiles.Count -ne 1) {
            throw "Expected exactly one Skill HTML file in $($skillFolders[0].FullName)."
        }

        $hash = (Get-FileHash -LiteralPath $pdfs[0].FullName -Algorithm SHA256).Hash
        $records += [pscustomobject]@{
            Number = $number
            Pdf = $pdfs[0].FullName
            Hash = $hash
            SkillFolder = $skillFolders[0].FullName
            Html = $htmlFiles[0].FullName
        }
    }
    return $records
}

function Read-State {
    if (-not (Test-Path -LiteralPath $stateFile -PathType Leaf)) { return @{} }
    $raw = Get-Content -LiteralPath $stateFile -Raw | ConvertFrom-Json
    $state = @{}
    foreach ($property in $raw.PSObject.Properties) {
        $state[$property.Name] = $property.Value
    }
    return $state
}

function Write-State($Records) {
    $state = [ordered]@{}
    foreach ($record in $Records | Sort-Object Number) {
        $state["$($record.Number)"] = [ordered]@{
            pdf = $record.Pdf
            sha256 = $record.Hash
        }
    }
    $state | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $stateFile -Encoding UTF8
}

function Test-SkillFolder([string]$Folder) {
    $htmlFiles = @(Get-ChildItem -LiteralPath $Folder -File -Filter "skill-*.html")
    if ($htmlFiles.Count -ne 1) {
        throw "Validation failed: expected one Skill HTML file in $Folder."
    }
    $htmlText = Get-Content -LiteralPath $htmlFiles[0].FullName -Raw
    $requiredPatterns = [ordered]@{
        "Skill lesson container" = '<main class="skill-lesson'
        "Generated panel container" = '<div class="skill-pages"'
        "End-of-Skill actions" = '<nav class="lesson-actions"'
        "Accessibility and Return-to-Adventure script" = 'lesson-accessibility\.js'
    }
    foreach ($requirement in $requiredPatterns.GetEnumerator()) {
        if ($htmlText -notmatch $requirement.Value) {
            throw "Validation failed: $($requirement.Key) is missing from $($htmlFiles[0].FullName). Publishing stopped to protect hand-built website behavior."
        }
    }
    $references = @([regex]::Matches($htmlText, 'images/(page-\d{2}\.png)') |
        ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique)
    $imagesFolder = Join-Path $Folder "images"
    $actual = @(Get-ChildItem -LiteralPath $imagesFolder -File -Filter "page-*.png" |
        Sort-Object Name)
    if ($references.Count -eq 0 -or $actual.Count -eq 0) {
        throw "Validation failed: no lesson pages found in $Folder."
    }
    if ($references.Count -ne $actual.Count) {
        throw "Validation failed: HTML references $($references.Count) pages but $($actual.Count) PNG files exist in $Folder."
    }
    for ($index = 0; $index -lt $actual.Count; $index++) {
        $expected = "page-{0:D2}.png" -f ($index + 1)
        if ($actual[$index].Name -ne $expected -or $expected -notin $references) {
            throw "Validation failed: missing or out-of-sequence $expected in $Folder."
        }
        if ($actual[$index].Length -lt 1024) {
            throw "Validation failed: $($actual[$index].FullName) is unexpectedly small."
        }
    }
    return $htmlFiles[0]
}

function Get-ChangedSources($Records, $State) {
    return @($Records | Where-Object {
        $key = "$($_.Number)"
        -not $State.ContainsKey($key) -or $State[$key].sha256 -ne $_.Hash
    })
}

Assert-Environment
$allRecords = @(Get-SkillSources)

if ($Initialize) {
    if ($allRecords.Count -eq 0) { throw "No Skill PDFs were found." }
    Write-State $allRecords
    Write-Host "Recorded the current PDF versions for $($allRecords.Count) Skills." -ForegroundColor Green
    Write-Host "No website files were changed. Future previews will detect revised PDFs."
    return
}

if ($Publish) {
    $statusLines = @(& git -C $LiveRepo status --porcelain)
    if ($LASTEXITCODE -ne 0) { throw "Unable to read Git status." }
    if ($statusLines.Count -eq 0) {
        Write-Host "Nothing to publish; the current website repository is clean." -ForegroundColor Yellow
        return
    }

    $unexpected = @($statusLines | Where-Object {
        $path = $_.Substring(3).Trim('"')
        $path -notmatch '^skill-\d{2}-'
    })
    if ($unexpected.Count -gt 0) {
        Write-Host "Publishing stopped because unrelated files are modified:" -ForegroundColor Red
        $unexpected | ForEach-Object { Write-Host "  $_" }
        return
    }

    $changedFolders = @($statusLines | ForEach-Object {
        $path = $_.Substring(3).Trim('"')
        ($path -split '[/\\]')[0]
    } | Sort-Object -Unique)

    Write-Host "Publishing these Skill folders:" -ForegroundColor Cyan
    $changedFolders | ForEach-Object { Write-Host "  $_" }
    $validatedPages = @()
    foreach ($folder in $changedFolders) {
        $validatedPages += Test-SkillFolder (Join-Path $LiveRepo $folder)
    }
    Write-Host "Validation passed: HTML references, PNG counts, numbering, and file sizes are consistent." -ForegroundColor Green
    foreach ($folder in $changedFolders) {
        & git -C $LiveRepo add -- $folder
        if ($LASTEXITCODE -ne 0) { throw "Git staging failed for $folder" }
    }
    & git -C $LiveRepo commit -m "Update Skills from revised PDFs"
    if ($LASTEXITCODE -ne 0) { throw "Git commit failed." }
    & git -C $LiveRepo push origin main
    if ($LASTEXITCODE -ne 0) { throw "Git push failed." }

    $commit = (& git -C $LiveRepo rev-parse HEAD).Trim()
    $deployVerified = $false
    for ($attempt = 1; $attempt -le 6; $attempt++) {
        $allLive = $true
        foreach ($page in $validatedPages) {
            $folderName = Split-Path $page.DirectoryName -Leaf
            $url = "https://aferlazzo.github.io/driver-confidence-guide/$folderName/$($page.Name)?deploy=$commit"
            try {
                $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 15
                if ($response.StatusCode -ne 200 -or $response.Content -notmatch 'images/page-01\.png\?v=[0-9a-f]{12}') {
                    $allLive = $false
                }
            }
            catch {
                $allLive = $false
            }
        }
        if ($allLive) {
            $deployVerified = $true
            break
        }
        if ($attempt -lt 6) {
            Write-Host "GitHub Pages is still deploying; checking again in 10 seconds..." -ForegroundColor Yellow
            Start-Sleep -Seconds 10
        }
    }
    if ($deployVerified) {
        Write-Host "Live-site verification passed for every published Skill." -ForegroundColor Green
    }
    else {
        Write-Host "The push succeeded, but GitHub Pages did not finish deploying within one minute." -ForegroundColor Yellow
        Write-Host "The commit is safe on GitHub; check the live pages again shortly."
    }

    $freshRecords = @(Get-SkillSources)
    Write-State $freshRecords
    Write-Host "Published successfully and recorded the current PDF versions." -ForegroundColor Green
    return
}

if (-not (Test-Path -LiteralPath $stateFile -PathType Leaf)) {
    Write-Host "First-time setup is required." -ForegroundColor Yellow
    Write-Host "Run: .\Update-SkillsWebsite.ps1 -Initialize"
    Write-Host "That records current PDF hashes without changing the website."
    return
}

$state = Read-State
$selectedRecords = if ($Skill) { $allRecords } else { @(Get-ChangedSources $allRecords $state) }

if ($selectedRecords.Count -eq 0) {
    Write-Host "No revised Skill PDFs were detected." -ForegroundColor Green
    return
}

Write-Host "Skills selected:" -ForegroundColor Cyan
$selectedRecords | ForEach-Object {
    Write-Host ("  Skill {0:D2}: {1}" -f $_.Number, $_.Pdf)
}

if (-not $Update) {
    Write-Host ""
    Write-Host "PREVIEW ONLY: no website files were changed." -ForegroundColor Yellow
    if ($Skill) {
        Write-Host "Run with -Update and the same -Skill numbers to regenerate them."
    } else {
        Write-Host "Run: .\Update-SkillsWebsite.ps1 -Update"
    }
    return
}

$gitStatus = @(& git -C $LiveRepo status --porcelain)
if ($gitStatus.Count -gt 0) {
    Write-Host "Update stopped because the website repository already has uncommitted changes:" -ForegroundColor Red
    $gitStatus | ForEach-Object { Write-Host "  $_" }
    return
}

$jobsFile = Join-Path $env:TEMP "dcg-skill-jobs.json"
$helperFile = Join-Path $env:TEMP "dcg-update-skills.py"
$jobs = @($selectedRecords | ForEach-Object {
    [ordered]@{ pdf = $_.Pdf; skill_dir = $_.SkillFolder; html = $_.Html; hash = $_.Hash.ToLowerInvariant() }
})
$jobs | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $jobsFile -Encoding UTF8

$python = @'
from pathlib import Path
import fitz
import html
import json
import re
import sys

jobs = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8-sig"))
for job in jobs:
    pdf_path = Path(job["pdf"])
    skill_dir = Path(job["skill_dir"])
    html_path = Path(job["html"])
    images_dir = skill_dir / "images"
    images_dir.mkdir(exist_ok=True)

    for old_image in images_dir.glob("page-*.png"):
        old_image.unlink()

    document = fitz.open(pdf_path)
    if len(document) == 0:
        raise RuntimeError(f"PDF has no pages: {pdf_path}")
    for index, page in enumerate(document):
        pixmap = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
        pixmap.save(images_dir / f"page-{index + 1:02d}.png")

    page_html = html_path.read_text(encoding="utf-8")
    protected_shell, shell_count = re.subn(
        r'(<div class="skill-pages"[^>]*>).*?(</div>)',
        r'\1__DCG_GENERATED_PANELS__\2',
        page_html,
        count=1,
        flags=re.S,
    )
    if shell_count != 1:
        raise RuntimeError(f"Could not identify the protected Skill shell in {html_path}")
    heading = re.search(r"<h1>(.*?)</h1>", page_html, re.S)
    if not heading:
        raise RuntimeError(f"Missing H1 in {html_path}")
    title = html.unescape(re.sub(r"<[^>]+>", "", heading.group(1))).strip()
    tags = []
    for index in range(len(document)):
        loading = "" if index == 0 else ' loading="lazy"'
        tags.append(
            f'    <img src="images/page-{index + 1:02d}.png?v={job["hash"][:12]}" '
            f'alt="{html.escape(title)} lesson, page {index + 1}"{loading}>'
        )
    replacement = r"\1" + "\n" + "\n".join(tags) + "\n  " + r"\2"
    page_html, count = re.subn(
        r'(<div class="skill-pages"[^>]*>).*?(</div>)',
        replacement,
        page_html,
        count=1,
        flags=re.S,
    )
    if count != 1:
        raise RuntimeError(f"Could not update image list in {html_path}")
    updated_shell, updated_shell_count = re.subn(
        r'(<div class="skill-pages"[^>]*>).*?(</div>)',
        r'\1__DCG_GENERATED_PANELS__\2',
        page_html,
        count=1,
        flags=re.S,
    )
    if updated_shell_count != 1 or updated_shell != protected_shell:
        raise RuntimeError(
            f"Protected Skill HTML changed outside the generated panel list: {html_path}"
        )
    html_path.write_text(page_html, encoding="utf-8")
    expected = [f"page-{index + 1:02d}.png" for index in range(len(document))]
    actual = sorted(path.name for path in images_dir.glob("page-*.png"))
    if actual != expected:
        raise RuntimeError(f"Generated PNG sequence is invalid in {images_dir}")
    for image_name in expected:
        image_path = images_dir / image_name
        if image_path.stat().st_size < 1024:
            raise RuntimeError(f"Generated image is unexpectedly small: {image_path}")
        check = fitz.Pixmap(image_path)
        if check.width < 100 or check.height < 100:
            raise RuntimeError(f"Generated image dimensions are invalid: {image_path}")
    print(f"Updated {skill_dir.name}: {len(document)} pages")
'@

Set-Content -LiteralPath $helperFile -Value $python -Encoding UTF8
& py $helperFile $jobsFile
if ($LASTEXITCODE -ne 0) { throw "Skill rendering failed." }

Write-Host ""
Write-Host "Local website files were updated. Review them in your browser." -ForegroundColor Green
Write-Host "When satisfied, run: .\Update-SkillsWebsite.ps1 -Publish"
