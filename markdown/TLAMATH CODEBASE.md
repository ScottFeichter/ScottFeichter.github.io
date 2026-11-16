# TLA-MATH Codebase Overview

## What This Is

TLA-MATH is a custom-built mathematics learning platform. It is a React single-page application that renders structured markdown content files as interactive course material. The content covers mathematics from arithmetic through advanced pure math, organized into a subject/course/topic/unit hierarchy.

---

## Repository Structure

```
TLA-MATH/
├── _app-viewer/          # The React app
├── 01. Core Mathematics/ # Content folders
├── 02. Logic and Discrete Math/
├── 03. Analysis/
├── 04. Applied Mathematics/
├── 05. Advanced Pure Math/
├── 06. Misc/
├── docs/                 # Authoring documentation
├── .amazonq/rules/       # AI assistant conventions
└── README.md
```

---

## The App — `_app-viewer/`

A Vite + React 19 SPA. Built with `npm run build` from `_app-viewer/`. Served as a static site.

### Key Dependencies

- React 19, React Router 7
- `react-markdown` with `remark-math`, `rehype-katex`, `rehype-raw`, `rehype-highlight`
- KaTeX for math rendering
- Desmos for interactive graphs (via custom component)
- MediaPipe selfie segmentation (background feature)
- Puppeteer (PDF printing script)

### Source Layout

```
_app-viewer/src/
├── _main/          # App entry point
├── app/            # Top-level app shell
├── components/     # UI components (QuizItem, Exercise, Desmos, etc.)
├── content/        # Content.jsx — the universal markdown renderer
├── context/        # React context providers
├── data/           # sections.js and subjects.js — the content registry
├── hooks/          # Custom hooks
├── navigation/     # Routing and nav components
├── rendering/      # Markdown rendering pipeline
├── styles/         # CSS
└── templates/      # Per-folder JSX templates (legacy, being migrated out)
```

### How Content Renders

Every content file is a markdown file. `Content.jsx` is the universal renderer — all file types pass through it. There is no `<!-- template: -->` marker needed. The markdown pipeline supports KaTeX math, raw HTML, syntax highlighting, and custom HTML components (quiz, exercise, Desmos, writing pad, explain group).

### Content Registry

Two files drive the navigation:

- `src/data/sections.js` — flat array of all topic entries. Each entry has an `id`, `title`, `folder` (path on disk), and `files` array (ordered list of filenames).
- `src/data/subjects.js` — hierarchical tree of subjects → courses → topics. References section IDs from `sections.js` via `findTopics()`.

Content folders on disk are symlinked into `_app-viewer/public/md/` so the app can fetch them at runtime.

### Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run generate` | Auto-generate `sections.js` from disk (do NOT use — overwrites manual ordering) |
| `npm run print` | Puppeteer PDF export |
| `npm run convert` | PDF conversion utility |

---

## Content Structure

### Subject Hierarchy

| Code | Subject |
|---|---|
| 01 | Core Mathematics |
| 02 | Logic and Discrete Math |
| 03 | Analysis |
| 04 | Applied Mathematics |
| 05 | Advanced Pure Math |

### Folder Types

- **Learning folder** — teaches a concept. Info files + 5 closing files: Summary, Test, Proof, Explain, Evaluation.
- **Practice folder** — presents problems. Problem files + one All file at the end.

### File Types

| Type | Suffix | Purpose |
|---|---|---|
| Info | `-info` | Teaches content |
| Summary | `-summary` | Recap |
| Test | `-test` | 10+ question quiz |
| Proof | `-proof` | Exercise-based proof practice |
| Explain | `-explain` | Concept explanation groups |
| Evaluation | `-evaluation` | File completion checklist + scores |
| Problem | `-problem` | Worked problem with 10 sections |
| All | `-all` | Problem statements only, no solutions |

### File ID Pattern

`[subject]-[course]-[topic]-[unit]-[suffix]`

Example: `03-01-408-01-info` = Analysis / Calculus / folder 408 / file 01 / info type.

---

## Authoring System

All content authoring is governed by documents in `docs/content-authoring/`:

- `FILE-CREATION.md` — 7-step workflow for creating a single file
- `FOLDER-CREATION.md` — workflow for creating a new folder
- `FILE-MODIFICATION.md`, `FILE-RENAME.md`, `FILE-RENUMBER.md` — other operations
- `WRITING-RULES.md` — prose rules, heading rules, KaTeX usage, Desmos usage
- `REGISTRATION-AND-WORKFLOW.md` — how to register files and folders in `sections.js`
- `templates/` — canonical templates for each file type

The `.amazonq/rules/conventions.md` file is the working reference that consolidates the key rules for AI-assisted authoring.

### Key Authoring Rules

- Every `##` heading after the first must be preceded by `---` on the line immediately before it
- Max 2 sentences of bare prose per `##`, `###`, `####` section
- Every prose sentence must be followed by a blank line
- No em-dashes to extend sentences
- All math uses KaTeX (`$inline$` or `$$display$$`)
- In JSON attributes, use `&#39;` for apostrophes — never `\'`
- Audit report is written once, never updated — it is the honest raw record before fixes
- Fix report lists only previously-failed items, now showing PASS with notes

### Registration Workflow

1. Create folder on disk
2. Create symlink into `_app-viewer/public/md/`
3. Add topic ID to `subjects.js`
4. Add entry to `sections.js` with empty `files` array
5. Write files to disk
6. Append filenames to `files` array in `sections.js`
7. Run `npm run build`

Do NOT run `generate-config.js` — it overwrites `sections.js` and loses manual ordering.

---

## Active Work and Known Issues

See `docs/TODO.md` for the full list. Key items:

- **Item 10** — Enforce honest audit process: require re-reading files before marking checklist, prohibit marking from memory
- **Item 9** — Migrate legacy per-folder JSX templates to unified problem file format (2,000+ files)
- **Item 8** — Migrate file ID suffixes from abbreviations to full words
- **Item 7** — KaTeX not rendering inside QuizItem and Exercise components — math shows as raw `$...$` text
- **Item 5** — Subject/Course/Topic links not right-clickable to open in new tab
- **Item 3** — Writing pad feature incomplete

---

## Git

Main branch is `main`. Feature work happens on named branches, merged into `main` when complete. Current state: on `main`, all recent work merged and pushed.
