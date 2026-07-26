# Driver Confidence Guide Website Deployment Guide

**Version 1.1**

## Purpose

This document describes the verified deployment procedure for the Driver Confidence Guide website and avoids assuming an unverified build process.

## Deployment Target

The deployable website is the static content inside:

```text
C:\Users\aferl\AdventureLearning\Driver Confidence Guide PDF Version\02_Web_Output
```

## Pre-Deployment Review

### Root pages

Verify the root pages that are present, including:

- `index.html`
- `mission-library.html`
- `mission-index.html`
- `feedback.html`
- informational pages such as `about-tony.html`

### Shared root assets

Verify:

- `style.css`
- `version2.css`
- `return-to-story.js`

### Mission folders

For each `mission-*` folder, verify:

- the mission HTML file exists
- `images/page-01.png` and subsequent pages load
- the README remains present
- navigation links work
- backup files are not accidentally linked as live content

## Duplicate-Folder Review

Before cleanup or deployment changes, verify the purpose of:

```text
mission-05-mission-open-the-hood
mission-05-open-the-hood
```

Also verify whether both of these are intended:

```text
mission-04-tool-kit
mission-17-tool-kit
```

Do not delete or rename these folders until all inbound links are checked.

## Local Verification

```powershell
cd "C:\Users\aferl\AdventureLearning\Driver Confidence Guide PDF Version\02_Web_Output"
python -m http.server 8000
```

Open:

```text
http://localhost:8000
```

## Git Deployment Workflow

From the actual Git repository root:

```powershell
git status
git diff
```

Confirm that only intended files changed, then:

```powershell
git add .
git commit -m "Describe the DCG website update"
git push
```

## Published-Site Verification

After publishing, verify:

- home page loads
- mission library loads
- mission links resolve to the correct subfolders
- mission page images load
- CSS is applied
- JavaScript behavior works
- feedback page opens
- no stale duplicate mission is linked unintentionally

## Rollback

If a deployment introduces a serious problem:

1. identify the last known good Git commit
2. revert or correct the affected files
3. commit the correction
4. push again
5. verify the live site

## Release Checklist

```text
[ ] Generated output reviewed
[ ] Root pages tested
[ ] Shared CSS and JavaScript tested
[ ] Mission library tested
[ ] Representative mission folders tested
[ ] All mission images load
[ ] Duplicate Mission 05 folders reviewed
[ ] Toolkit mission naming reviewed
[ ] Git diff reviewed
[ ] Changes committed
[ ] Changes pushed
[ ] Live website verified
[ ] Feedback form verified
```

## Build-Step Limitation

The deployment procedure begins with already-generated content in `02_Web_Output`. The exact generation command must be added after the real locations and behavior of `publish_dcg.py` and `buildWebPages.ps1` are confirmed.

## Summary

The deployment unit is the actual static content in `02_Web_Output`:

```text
root pages and shared files
        +
self-contained mission folders
        ↓
static hosting
```
