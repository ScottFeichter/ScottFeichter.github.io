# Platform Targeting Convention

This codebase has three separate platform implementations:
- `_desktop/` — desktop site (html, css, js)
- `_mobile/` — mobile site (html, css, js)
- `_tablet/` — tablet site (html, css, js) — currently empty

## Rules

- If the user says "on desktop" or "desktop" → only make changes inside `_desktop/`
- If the user says "on mobile" or "mobile" → only make changes inside `_mobile/`
- If the user says "on tablet" or "tablet" → only make changes inside `_tablet/`
- If the user does not specify a platform → ask before making any changes: "Which platform(s) should this apply to — desktop, mobile, tablet, or all?"
- Never apply a change to multiple platforms unless the user explicitly says "all platforms" or names multiple platforms
- Changes to shared assets (`/jpg/`, `/mp4/`, `/pdf/`, `/favicon/`) apply globally and do not require platform clarification
- Changes to `index.html` at the root apply globally and do not require platform clarification
- Changes to `_build/build.js` apply globally and do not require platform clarification
