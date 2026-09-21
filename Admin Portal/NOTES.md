# BhoomiIntelli Admin Portal — Developer Notes
> Last Updated: 2026-09-19
> This file explains the purpose and internal mechanics of every file in the Admin Portal. Update this file whenever a file is added, modified, or reorganized.

---

## 📁 Root Configuration & Documentation Files

| File | Purpose |
| :--- | :--- |
| `index.html` | HTML5 shell for the admin application. Loads Google Fonts (`Plus Jakarta Sans` for modern headings and `Inter` for clean tabular data). Mounts the root React DOM node `<div id="root"></div>`. |
| `package.json` | Project configuration and npm scripts (`dev`, `build`, `preview`). Specifies React 19 and Vite 8 dependencies. |
| `package-lock.json` | Exact lockfile ensuring identical dependency trees across all developer machines. |
| `vite.config.js` | Vite configuration with `@vitejs/plugin-react`. Configured to run cleanly on local port `5174`. |
| `vercel.json` | Vercel deployment configuration. Configures SPA route rewrites to `/index.html` preventing 404 errors on page refresh. |
| `README.md` | Public-facing documentation with feature descriptions, layout diagrams, credentials, and quickstart commands. |
| `PROJECT_CONTEXT.md` | Master AI onboarding reference detailing the entire portal context, tech stack, tri-pane verification flow, and design tokens. |
| `NOTES.md` | THIS FILE. Deep-dive reference for every file and module in the Admin Portal. |
| `AI_NOTES.md` | AI-specific instructions, memory bank, development decisions, and workflow guidelines. |
| `GIT_PUSH_GUIDE.md` | Teammate guide explaining which files to stage and the exact terminal commands for git push. |
| `notes.txt` | Plaintext companion copy of notes for quick CLI inspection. |

---

## 📁 `public/` — Static Public Assets

| File | Purpose |
| :--- | :--- |
| `bhoomintelli-icon.png` | Square logo icon used as browser favicon and brand badge. |
| `bhoomintelli-wordmark.png` | Horizontal high-resolution brand logo used in headers. |
| `favicon.svg` | Lightweight SVG favicon used in browser tabs. |

---

## 📁 `src/` — Application Source Code

### Core Entry & Application Shell

| File | Purpose |
| :--- | :--- |
| `src/main.jsx` | React DOM entry point. Mounts the `<App />` component in `<React.StrictMode>`. Imports `index.css`. |
| `src/App.jsx` | Top-level state orchestrator. Manages `currentUser` state, login/logout handlers, and the floating **Developer Mode** pill (stored in `localStorage.adminDevMode`). Toggles between `<AdminLogin />` and `<AdminDashboard />`. |
| `src/index.css` | Global styling foundation. Defines CSS variables for brand colors (`--primary-green: #1b5e3a`, `--primary-green-hover: #154c2e`, alert red `#dc2626`, etc.), font families, border radii, shadow tokens, and reset rules. |
| `src/admin.css` | Comprehensive Admin Portal stylesheet (~1,500 lines). Every selector is strictly scoped with the `admin-*` or `admin-audit-*` prefix. Covers login cards, sidebar, topbar, cards, badges, modal overlays, parchment document styling, and the 1/3 split-screen layout. |

---

### Authentication & Dashboard Shell

| File | Purpose |
| :--- | :--- |
| `src/AdminLogin.jsx` | Administrative login page. Features email/password authentication against `admin@bhoomintelli.in` / `Admin@123`. Implements 3-attempt account lockout (disables form for 60 seconds with countdown timer), password visibility toggle, error banners, and an auto-fill button enabled in Dev Mode. |
| `src/AdminDashboard.jsx` | Primary layout shell. Contains the responsive collapsible sidebar with active page indicators, topbar with interactive notification bell (with pulsing unread dot, live dropdown list, click-outside auto-close, "Mark all as read" button, and deep-links to audit records), admin profile chip, and dynamic page renderer (`DashboardHome`, `RecordsPage`, `UsersPage`, `AnalyticsPage`, `SettingsPage`). |

---

### Verification Engine Components

| File | Purpose |
| :--- | :--- |
| `src/components/RecordAuditStudio.jsx` | **The Tri-Pane Record Verification & Audit Studio**. Renders the 3-column split view (1/3 screen each) on desktop, and an intuitive 1-touch mobile tab switcher (`[📄 1. Original Deed]` / `[🤖 2. AI OCR]` / `[⚖️ 3. Audit Matrix]`) on screens `< 1024px`:<br>• **Pane 1**: Interactive parchment deed viewer with seals, stamps, zoom controls (`-`, `+`, `↺`), and field-linked highlight hotspots.<br>• **Pane 2**: AI-OCR extraction display showing confidence percentages, bounding boxes, and model warning tags.<br>• **Pane 3**: Citizen review vs admin decision matrix. Highlights discrepancies, provides field-level `Pass`/`Flag`/`Edit` buttons, status classification grading (🟢 Good, 🟡 Needs Review, 🔴 High Risk), and action triggers (`Approve & Digitally Sign`, `Issue Discrepancy Notice`, `Reject Record`). |

---

### Portal Pages (`src/pages/`)

| File | Purpose |
| :--- | :--- |
| `src/pages/DashboardHome.jsx` | Executive overview page. Displays 4 real-time KPI cards (Total Records, Pending Verification, Discrepancies Detected, Verification Accuracy Rate), quick-action shortcuts, and a live chronological activity stream of land registry actions. |
| `src/pages/RecordsPage.jsx` | Land record registry management. Features a searchable table with real-world Indian land record mock entries (including **Parv Jain** `REC-28452`, **Ravi Sharma** `REC-28451`, **Sunita Devi** `REC-28450`, etc.). Provides filter tabs for `All`, `🔴 Flagged / Needs Action`, `🟡 Under Review`, `🟢 Good / Verified`, and `🔵 Pending Queue`. Clicking "Review & Audit" seamlessly launches the `RecordAuditStudio`. |
| `src/pages/UsersPage.jsx` | Citizen & staff directory. Lists registered citizens, verification status (KYC Verified, Aadhaar Linked, Pending), role badges, and action controls to view submitted properties or suspend access. |
| `src/pages/AnalyticsPage.jsx` | Data analytics suite. Displays state-wise record distribution (Haryana, Uttar Pradesh, Rajasthan, Gujarat, etc.), AI-OCR accuracy metrics, processing throughput charts, and CSV/PDF export tools. |
| `src/pages/SettingsPage.jsx` | System configuration center. Allows updating administrative profile details, configuring OCR confidence thresholds (e.g. flag below 85%), managing digital signature keys, and inspecting system diagnostics. |
