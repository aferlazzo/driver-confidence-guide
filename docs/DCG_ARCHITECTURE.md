# Driver Confidence Guide Website Architecture

**Version 1.1**

## Purpose

This document describes the actual folder structure and runtime architecture of the Driver Confidence Guide website.

The published website is located in:

```text
C:\Users\aferl\AdventureLearning\Driver Confidence Guide PDF Version\02_Web_Output
```

## Architecture Summary

DCG is a static website made up of root-level website pages, root-level shared CSS and JavaScript files, and one self-contained folder for each mission.

There is no central `assets`, `css`, `images`, `js`, or `missions` directory in the current published structure.

## Actual Root Structure

```text
02_Web_Output/
├── index.html
├── mission-library.html
├── mission-index.html
├── adventures.html
├── about-tony.html
├── feedback.html
├── meet-tony.html
├── the-bigger-idea.html
├── style.css
├── version2.css
├── return-to-story.js
├── .gitignore
├── .nojekyll
├── ADVENTURE_LEARNING_BIBLE.md
├── VERSION2_DESIGN.md
├── VERSION2_VISION.md
├── IDEAS.md
├── mission-01-nobody-ever-taught-me-this/
├── mission-02-find-owners-manual/
├── ...
└── mission-20-monthly-checks/
```

## Mission Folder Structure

Each mission is stored in its own folder.

```text
mission-XX-mission-name/
├── mission-XX-mission-name.html
├── README.txt
├── images/
│   ├── page-01.png
│   ├── page-02.png
│   └── ...
└── backups/
    └── mission-XX-mission-name-YYYYMMDD-HHMMSS.html
```

Not every mission currently contains a `backups` folder, but most do.

## Mission HTML

Each mission folder contains one learner-facing HTML file. The HTML file presents the mission and references the page images stored in that same mission folder.

## Mission Images

Images are not stored in one shared site-wide folder. Each mission owns its own image set under `images/`.

The `page-XX.png` naming indicates that the published mission uses rendered page images rather than a central collection of individual panels.

## Mission README Files

Each mission folder contains a `README.txt`. The README is part of that mission's local documentation and should remain with the mission when the folder is copied or archived.

## Backups

Many mission folders contain a `backups` directory with timestamped HTML files. These are maintenance artifacts and are not intended as primary learner navigation targets.

## Navigation Model

```text
index.html
    ↓
mission-library.html
    ↓
mission-XX-name/mission-XX-name.html
```

## Shared and Mission-Specific Assets

### Shared root files

```text
style.css
version2.css
return-to-story.js
```

### Mission-specific files

```text
images/page-XX.png
README.txt
mission-XX-name.html
backups/
```

## Relationship to ALS

Adventure Learning Studio is not required to run the published DCG website.

```text
Adventure Learning Studio
        ↓ authoring and publishing
Static DCG output
        ↓
Web browser
```

## Known Structural Exceptions

The inventory shows two folders for Mission 05:

```text
mission-05-mission-open-the-hood
mission-05-open-the-hood
```

They contain matching image sets but different HTML and README files. This appears to be a duplicate or earlier naming variant and should be reviewed before cleanup.

The inventory also shows:

```text
mission-04-tool-kit
mission-17-tool-kit
```

Their purposes should be verified before renaming or removing either folder.

## Summary

The current DCG website uses:

```text
root site pages + shared root assets + independent mission folders
```
