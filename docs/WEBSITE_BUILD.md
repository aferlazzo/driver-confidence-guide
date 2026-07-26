# Building and Running the Driver Confidence Guide Website

**Version 1.1**

## Purpose

This document explains what is currently verified about building and running the Driver Confidence Guide website.

## Published Website Location

```text
C:\Users\aferl\AdventureLearning\Driver Confidence Guide PDF Version\02_Web_Output
```

## Verified Output Structure

```text
02_Web_Output/
├── root-level HTML pages
├── root-level CSS and JavaScript
└── mission-XX-name/
    ├── mission-XX-name.html
    ├── README.txt
    ├── images/
    │   └── page-XX.png
    └── backups/
        └── timestamped HTML files
```

There is no verified central `assets`, `css`, `images`, `js`, or `missions` directory.

## Run the Existing Website Locally

Open PowerShell:

```powershell
cd "C:\Users\aferl\AdventureLearning\Driver Confidence Guide PDF Version\02_Web_Output"
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

To stop the server, press `Ctrl+C`.

## Local Review Checklist

Verify that:

- `index.html` opens
- the mission library opens
- mission links open the correct mission folder and HTML file
- mission images display
- shared CSS loads
- shared JavaScript works
- feedback and informational pages open
- mobile-sized layouts remain readable

## Building the Website

The exact source-to-output build procedure has not yet been verified from the actual build scripts.

Earlier documentation referenced:

```text
publish_dcg.py
buildWebPages.ps1
```

Those files were not present in the visible `02_Web_Output` root and should not be documented as being there unless their actual paths are confirmed.

Before adding build commands, verify:

1. the full path of `publish_dcg.py`
2. the full path of `buildWebPages.ps1`
3. which script is the primary entry point
4. where mission source files are stored
5. whether the scripts require parameters
6. whether output is written directly into `02_Web_Output`
7. whether existing mission folders are replaced, merged, or backed up

## Current Content Pipeline

```text
Unknown or not-yet-documented mission source
        ↓
Existing publishing process
        ↓
02_Web_Output
        ↓
Static web server or GitHub Pages
```

## Git Review

From the actual Git repository root:

```powershell
git status
git diff
```

After reviewing the changes:

```powershell
git add .
git commit -m "Describe the DCG website changes"
git push
```

## Important Rule

Do not assume conventional folders such as `assets`, `css`, `images`, `js`, or `missions`. The current site uses root-level shared files and self-contained mission folders.

## Summary

To run the current DCG output:

```powershell
cd "C:\Users\aferl\AdventureLearning\Driver Confidence Guide PDF Version\02_Web_Output"
python -m http.server 8000
```

The exact build command still requires inspection of the real publisher scripts and their actual paths.
