# Driver Confidence Guide Website
## Project Structure

This document describes the purpose of each major folder and file in the Driver Confidence Guide website project.

---

# Root Folder

```
Driver Confidence Guide PDF Version/
```

This is the main project directory.

It contains:

- Source missions
- Website generation tools
- Generated website
- Documentation
- Build scripts

---

# Folder Structure

```
Driver Confidence Guide PDF Version/
│
├── 01_Missions/
├── 02_Web_Output/
├── dcg_publisher/
├── publish_dcg.py
├── buildWebPages.ps1
├── .gitignore
└── documentation (*.md)
```

---

# 01_Missions

Contains the source material for every mission.

Each mission has its own folder.

Typical contents include:

```
Mission XX/
    mission.pdf
    images/
    comic panels
    notes
```

These are the files that are edited by the author.

Nothing in this folder is intended to be viewed directly by website visitors.

---

# 02_Web_Output

Contains the generated website.

Everything inside this folder is safe to publish.

Typical contents include:

```
02_Web_Output/

index.html
missions/
images/
css/
js/
assets/
```

This folder is regenerated whenever the website is built.

This folder also contains project documentation such as:

- CHANGELOG.md
- DCG_OVERVIEW.md
- DCG_ARCHITECTURE.md
- WEBSITE_BUILD.md
- DEPLOYMENT.md
- PROJECT_STRUCTURE.md

---

# dcg_publisher

Contains the Python modules responsible for converting mission content into web pages.

Typical responsibilities include:

- Reading mission folders
- Copying images
- Generating HTML
- Building navigation
- Creating indexes
- Publishing output

---

# publish_dcg.py

Primary Python program.

Runs the complete website generation process.

Typical workflow:

1. Read mission folders.
2. Convert mission content.
3. Generate website pages.
4. Write output into 02_Web_Output.

---

# buildWebPages.ps1

Windows PowerShell script used to launch the website build.

This provides a convenient one-step build process.

---

# Documentation Files

Several Markdown documents describe the project.

| File | Purpose |
|------|---------|
| DCG_OVERVIEW.md | High-level overview of the project |
| DCG_ARCHITECTURE.md | Overall architecture and design |
| WEBSITE_BUILD.md | Website build process |
| DEPLOYMENT.md | Deployment instructions |
| PROJECT_STRUCTURE.md | Description of folders and files |
| CHANGELOG.md | Project history |

---

# Git Repository

The project is maintained using Git.

Version control provides:

- history
- backups
- experimentation
- recovery
- collaboration

---

# Typical Workflow

```
Edit Mission
      │
      ▼
01_Missions
      │
      ▼
publish_dcg.py
      │
      ▼
02_Web_Output
      │
      ▼
Review Website
      │
      ▼
Commit to Git
      │
      ▼
Publish
```

---

# Guiding Principle

The project separates source content from generated website output.

```
Author Content
        │
        ▼
Website Generator
        │
        ▼
Published Website
```

Keeping these responsibilities separate makes the project easier to maintain, regenerate, and publish.