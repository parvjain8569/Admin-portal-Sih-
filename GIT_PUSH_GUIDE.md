# 🚀 Git Push Guide — BhoomiIntelli Admin Portal

Whenever you need to push changes to GitHub so your teammates can run the Admin Portal or inspect the audit engine, follow this guide.

---

## 📁 Files & Folders to Include

To ensure the Admin Portal installs and runs identically on your teammates' machines, the following must be tracked in Git:

### 1. Root & Configuration Files
- `package.json` — Dependencies and scripts
- `package-lock.json` — Exact deterministic lockfile
- `index.html` — HTML shell with Google Fonts
- `vite.config.js` — Vite build configuration (Port 5174)
- `vercel.json` — Vercel deployment rewrite rules
- `README.md` — Portal overview and setup instructions
- `PROJECT_CONTEXT.md` — AI master reference file
- `NOTES.md` — Complete developer file reference
- `AI_NOTES.md` — AI developer guidance & rules
- `GIT_PUSH_GUIDE.md` — This guide
- `notes.txt` — Plaintext companion notes

### 2. Source Code & Assets
- `public/` — Static brand logos (`bhoomintelli-icon.png`, `bhoomintelli-wordmark.png`, `favicon.svg`)
- `src/` — **ALL** application source code:
  - `main.jsx`, `App.jsx`, `index.css`, `admin.css`
  - `AdminLogin.jsx`, `AdminDashboard.jsx`
  - `components/RecordAuditStudio.jsx` (Tri-Pane Audit Studio)
  - `pages/` (`DashboardHome.jsx`, `RecordsPage.jsx`, `UsersPage.jsx`, `AnalyticsPage.jsx`, `SettingsPage.jsx`)

---

## 🚫 Files to NEVER Push (Ignored by Git)
- `node_modules/` (Heavy dependency directory; teammates will run `npm install`)
- `dist/` (Local production build bundle)
- `.DS_Store` / `Thumbs.db` (OS artifacts)

---

## 💻 How to Push to GitHub

From the workspace root directory, run:

```bash
# 1. Check current status
git status

# 2. Stage all modifications (including Admin Portal and docs)
git add .

# 3. Commit with a clear, descriptive message
git commit -m "feat(admin): tri-pane audit studio, discrepancy engine, and complete docs"

# 4. Push to remote repository
git push origin main
```

---

## 👥 How Teammates Run the Admin Portal After Pulling

Once your teammates pull the repo (`git pull origin main`), they simply run:

```bash
# 1. Enter the Admin Portal folder
cd "Admin Portal"

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev
```

Then open **`http://localhost:5174`** and log in with:
- **Email:** `admin@bhoomintelli.in`
- **Password:** `Admin@123`
*(Or toggle Dev Mode at bottom-right for 1-click auto-fill!)*
