# TLA-PROG Architecture

## Content Structure

The actual content lives in the TLA-PROG root as a folder hierarchy:

- **Subject** → e.g. `01. Fundamentals/`
- **Course** → e.g. `01. Communications/`
- **Topic** → a folder inside the course
- **Unit** → individual `.md` files inside a topic folder

---

## Build-Time Config Generation

Before the app builds, two Node scripts run from `_app-viewer/`:

- `generate-config.js` — scans the entire folder tree from the root, finds all `.md` files, creates symlinks into `_app-viewer/public/md/`, and generates two JS files: `src/sections.js` (flat list of all topics) and `src/subjects.js` (nested hierarchy). This powers the navigation.
- `watch-config.js` — same as above but watches for file changes during dev and regenerates automatically.

---

## The React App

A single-page React app inside `_app-viewer/src/` with a 4-level navigation UI:

- **Subject sidebar** → **Course sidebar** → **Topic sidebar** → **Unit sidebar**
- URL pattern is `/:topicId/:fileIndex`
- Clicking through the sidebars navigates the URL, which drives what markdown file is displayed
- `Content.jsx` fetches the `.md` file from `/public/md/` and renders it

Themes are stored in `localStorage` and applied via a `data-palette` attribute on the `<html>` element, with each palette in its own CSS file.

---

## Deployment

- Code lives on GitHub (private repo)
- AWS Amplify watches the `main` branch
- On every push, Amplify runs `cd _app-viewer && npm install && npm run build` which triggers `generate-config.js` first, then Vite bundles everything into `_app-viewer/dist/`
- Amplify serves that `dist/` folder
- Route 53 points `tlaprog.com` at the Amplify app
