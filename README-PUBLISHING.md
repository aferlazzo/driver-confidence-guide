# Driver Confidence Guide: Skills Publishing

This repository is the only current website source:

`C:\Users\aferl\AdventureLearning\driver-confidence-guide-live`

Editable PDFs remain here:

`C:\Users\aferl\AdventureLearning\Driver Confidence Guide PDF Version\01_Missions\Mission_XX_*\05_ComicLife3`

The source folders retain their historical `Mission_XX` names. The public website uses `skill-XX` folders. `Update-SkillsWebsite.ps1` maps between them by number.

## First-time setup

Place `Update-SkillsWebsite.ps1` in the repository root. In File Explorer, right-click it, choose **Properties**, select **Unblock**, and click **OK**.

From PowerShell in the repository root:

```powershell
.\Update-SkillsWebsite.ps1 -Initialize
```

This records hashes of the PDFs already represented on the website. It does not alter the website.

## Normal workflow

1. Edit and export the current PDF into the matching `05_ComicLife3` folder.
2. Preview detected PDF changes:

   ```powershell
   .\Update-SkillsWebsite.ps1
   ```

3. Regenerate only the changed Skills:

   ```powershell
   .\Update-SkillsWebsite.ps1 -Update
   ```

4. Open the changed local Skill HTML pages and inspect them.
5. Publish:

   ```powershell
   .\Update-SkillsWebsite.ps1 -Publish
   ```

Publishing validates page numbering, PNG readability and size, HTML references, and Git scope. It commits and pushes only `skill-XX-*` folders, then checks the public GitHub Pages site.

## Updating selected Skills

To regenerate particular Skills regardless of change detection:

```powershell
.\Update-SkillsWebsite.ps1 -Update -Skill 1,3,9
```

## Safety rules

- Never publish from `02_Web_Output`.
- Never run the retired `publish_dcg.py`; it creates obsolete `mission-*` pages.
- Never place editable PDFs in the website repository.
- Do not use `git add .` for manual publishing.
- If `-Publish` reports unrelated changes, stop and inspect `git status`.

## Recovery

Website files can be restored from Git:

```powershell
git log --oneline
git status
```

Do not use destructive Git reset commands. If a rollback is needed, identify the good commit and use `git revert <commit>`.

The PDF and Comic Life sources are outside Git. They require a separate Windows, cloud, or external-drive backup. Confirm that `01_Missions` is included in that backup.

For a manual verified backup, use a cloud-synced or external-drive destination:

```powershell
.\Backup-DcgSources.ps1 -BackupRoot "D:\DCG-Backups"
.\Backup-DcgSources.ps1 -BackupRoot "D:\DCG-Backups" -Execute
```

The first command previews the file count and size. The second creates a dated ZIP and a SHA-256 checksum file. Do not use a folder on the same C: drive as the only backup.

## Current and retired locations

| Purpose | Location |
|---|---|
| Editable source PDFs | `Driver Confidence Guide PDF Version\01_Missions` |
| Current website | `AdventureLearning\driver-confidence-guide-live` |
| Retired publisher/output | Archive only; never publish |

