MissionWizardPage(5).tsx
TypeScript
were all the requested edits done to the file?
MissionWizardPage(6).tsx
TypeScript
how is this?
MissionWizardPage(7).tsx
TypeScript
ok?
MissionWizardPage(8).tsx
TypeScript
ok?
MissionWizardPage(9).tsx
TypeScript
ok yet?
that's what I see at localhost:5174
where is build?
this was also found
confused about how to build panels
the 'meet the learner' button is dead
i copied them here
CHANGELOG.md
File
ok?

I think you've covered the basics well. If your goal is for someone (including future you) to pick up the project after six months, I'd add a few more documents.

Essential (I'd recommend adding these)
ROADMAP.md

What you plan to build next.

Example:

Current Status
☑ Version 1 booklet complete
☑ Mission website generation
☐ Publish Google Site
☐ Add search
☐ Collect beta feedback
☐ Version 2 revisions

This answers, "What's next?"

KNOWN_ISSUES.md

A running list of things you know aren't finished.

Example:

- Mobile layout needs improvement.
- Mission images need optimization.
- Search not implemented.
- Google Sites publishing is still manual.

That keeps ideas from getting lost.

PROJECT_STRUCTURE.md

A map of the folders.

Example:

01_Missions/
    Source missions

02_Web_Output/
    Generated website

images/
    Shared graphics

publish_dcg.py
    Builds website

buildWebPages.ps1
    Windows build script

It's amazing how often you'll forget where something lives after a few months.

Nice to have
STYLE_GUIDE.md

Rules such as:

Mission naming conventions
Image sizes
Comic panel dimensions
Typography
Color palette
Folder naming

This helps keep the project consistent.

RELEASE_CHECKLIST.md

A checklist you go through before publishing.

For example:

☐ Build website
☐ Verify all links
☐ Check mobile layout
☐ Test search
☐ Commit to Git
☐ Push to GitHub
☐ Publish to Google Sites

This prevents those "Oops, I forgot..." moments.

FAQ.md

Questions you've answered before, such as:

Where are the mission PDFs?
How do I regenerate the website?
How do I add a new mission?
Where are the images stored?
How do I publish changes?
My favorite addition

I'd also add a document called:

PROJECT_PHILOSOPHY.md

This wouldn't be technical at all. It would explain why the Driver Confidence Guide exists.

It could capture ideas like:

The goal is confidence, not mechanical expertise.
Every mission should solve one real problem.
Keep each mission short and actionable.
Don't over-engineer.
Teach ownership, not just driving.

Those principles are the hardest things to reconstruct after stepping away from a project. The code and files tell you what the project is, but the philosophy reminds you why you're building it in the first place.

With those additions, I think you'd have documentation that's not only useful to others, but also serves as an excellent guide for your future self.

create and populate PROJECT_STRUCTURE.md
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
create and populate PROJECT_PHILOSOPHY.md
# Driver Confidence Guide
## Project Philosophy

The Driver Confidence Guide exists for one purpose:

> **To help people become confident, capable, and independent vehicle owners.**

It is **not** intended to turn readers into mechanics.

It is **not** a driver's education textbook.

It is **not** an encyclopedia of automobiles.

Instead, it teaches the practical knowledge that many experienced drivers take for granted but many new or inexperienced drivers have never been taught.

---

# The Problem

Many people receive a driver's license without ever learning:

- how to understand warning lights
- how to check fluids
- how to connect their phone to a car
- what to do after a flat tire
- where to find the owner's manual
- when a problem is serious
- who to call for help

These gaps create anxiety.

The Driver Confidence Guide exists to remove that anxiety.

---

# Confidence Before Complexity

Confidence comes first.

Technical depth comes later.

Readers should finish each mission thinking:

> "I can do that."

not

> "I need to memorize all of this."

Every mission should reduce uncertainty.

---

# One Mission. One Problem.

Every mission should solve one real-world problem.

Examples:

- The engine light came on.
- My tire is flat.
- I need gas.
- I don't know what this warning light means.
- I borrowed someone else's car.
- My phone won't connect.
- Where is the owner's manual?

Small, focused missions are easier to complete and easier to remember.

---

# Learn by Doing

People learn confidence through action.

Whenever practical, missions should encourage readers to perform a simple task themselves.

Examples:

- Open the hood.
- Locate the battery.
- Find the VIN.
- Identify the oil dipstick.
- Connect Android Auto.
- Clean the windshield.

Doing creates confidence.

---

# Short is Better

The guide respects the reader's time.

Avoid unnecessary detail.

Explain only what the learner needs in order to become more confident.

If additional knowledge is useful, provide links or references rather than overwhelming the reader.

---

# Visual Learning Matters

Many people learn faster from pictures than paragraphs.

Whenever possible:

- use illustrations
- use comic panels
- use diagrams
- use photographs
- minimize large blocks of text

Readers should be able to understand the mission by quickly scanning the page.

---

# Plain Language

Avoid unnecessary technical terminology.

Prefer:

"engine warning light"

instead of

"malfunction indicator lamp."

Explain unfamiliar words when they first appear.

Write as though helping a friend.

---

# Respect the Reader

Never assume the reader "should already know."

Many intelligent adults were simply never taught these things.

The guide teaches without embarrassment or judgment.

Every reader deserves to feel capable.

---

# Safety Comes First

Whenever safety is involved:

- be direct
- be accurate
- be conservative

Never encourage risky behavior.

When professional assistance is the safest option, clearly say so.

---

# Real-World Practicality

Every mission should answer a practical question.

Readers should immediately understand:

- Why does this matter?
- When would I use this?
- What should I do?

Information without application has little value.

---

# Keep It Current

Cars continue to change.

Printed owner's manuals are disappearing.

Electric vehicles are becoming more common.

Dashboard technology continues to evolve.

The guide should evolve as vehicles evolve while keeping the focus on practical confidence rather than technical complexity.

---

# Don't Over-Engineer

The Driver Confidence Guide should remain approachable.

Simple solutions are preferred over complicated ones.

The goal is to help readers succeed—not to impress them with technical detail.

---

# Success

The project succeeds when readers begin saying:

- "I understand my car now."
- "That wasn't nearly as scary as I expected."
- "I know what to do."
- "I can handle this."

Confidence—not information—is the ultimate product.

---

# Guiding Principle

Every mission should leave the learner a little more confident than they were before they started.

If a mission increases confidence, it belongs in the Driver Confidence Guide.
If it merely adds information without building confidence, it should be reconsidered.