# Git Push Guide

Whenever you need to push changes to GitHub for your teammates to run the code, make sure to include these files and folders.

---

## 📁 Root & Configuration Files (Outside `src/`)

Push these configuration and project files so your teammates have the exact build and setup environment:

- `package.json` (Dependencies and scripts)
- `package-lock.json` (Exact dependency tree lockfile)
- `index.html` (HTML template)
- `vite.config.js` (Vite build config)
- `postcss.config.js` (CSS processing config)
- `README.md` (Project documentation)
- `.gitignore` (Git ignore rules)
- `GIT_PUSH_GUIDE.md` (This guide)
- `PROJECT_CONTEXT.md` (AI & Project context)
- `NOTES.md` (Development notes)

---

## 📁 Folders to Include

- `src/` (Contains **ALL** application source code: components, pages, translations, styles, etc.)
- `public/` (Contains static assets like images/logos)

> 💡 **Tip:** Instead of staging individual `src/` files manually, you can push everything in `src/` along with the root files using the simple git command below.

---

## 🚀 How to Push Everything to GitHub:

Run these commands in your terminal:

```bash
git add .
git commit -m "feat: updated project files and multi-language support"
git push origin main
```
