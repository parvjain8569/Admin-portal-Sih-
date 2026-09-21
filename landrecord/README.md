# BhoomIntelli — Integration Guide

## What to Send to Teammates

Send **all of these** (not just `src`):

```
your-project-folder/
├── src/                ← your source code
├── public/             ← icons & images
├── index.html          ← entry HTML
├── package.json        ← dependencies
├── vite.config.js      ← build config
└── postcss.config.js   ← (optional, prevents PostCSS conflicts)
```

---

## Why just `src` breaks

The teammate's project likely has **TailwindCSS + PostCSS** set up.  
When they drop in your `src`, Vite tries to run their PostCSS config  
against your CSS files — and it crashes because your CSS doesn't use Tailwind.

---

## Setup Steps (Teammate)

1. **Delete** their existing project's `src/` folder
2. **Copy in** your `src/` folder
3. **Also replace** these 3 root files:
   - `index.html`
   - `package.json`
   - `vite.config.js`
4. **Copy** the `public/` folder (contains icons/images)
5. Run:

```bash
npm install
npm run dev
```

---

## Files to share (full checklist)

| File/Folder | Required? | Why |
|---|---|---|
| `src/` | ✅ Yes | All app code |
| `public/` | ✅ Yes | Icons, images (bhoomintelli-icon.png etc.) |
| `index.html` | ✅ Yes | Vite entry point |
| `package.json` | ✅ Yes | React 19 + Vite 8 dependencies |
| `vite.config.js` | ✅ Yes | Plain Vite config, no PostCSS |
| `postcss.config.js` | ✅ Yes | Disables conflicting PostCSS |
| `node_modules/` | ❌ No | Too large, `npm install` generates it |
| `.gitignore` | Optional | Recommended for git |

---

## The PostCSS Error Explained

The error the teammate sees:
```
Failed to load PostCSS config: [SyntaxError] Unexpected token ',' "{"name"...
```

This means Vite found their old `postcss.config.js` (with Tailwind) and tried  
to apply it to your vanilla CSS files. Adding the `postcss.config.js` from  
this repo (which is empty/minimal) overrides that and fixes it.
