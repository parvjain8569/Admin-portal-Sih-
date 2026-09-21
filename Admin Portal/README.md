# 🏛️ BhoomiIntelli — Administrative Verification & Audit Portal

> **Smart India Hackathon (SIH) Prototype**  
> Standalone Administrative Interface for AI-OCR Land Record Verification, Citizen Claim Auditing, and Cadastral Registry Oversight.

---

## 📌 Overview

The **BhoomiIntelli Admin Portal** is an administrative dashboard specifically engineered for revenue officers, sub-registrars, and land auditors. It complements the citizen-facing **BhoomiSetu / BhoomiIntelli** portal by providing tools to review uploaded deeds, cross-verify AI-OCR extracted details, detect discrepancies, and pass or flag cadastral records.

### 🌟 Core Highlights
- **Tri-Pane Verification Studio (1/3 : 1/3 : 1/3 Split Screen)**:
  - **Pane 1 (Left 1/3)**: Interactive Deed/Document Viewer with zoom, rotation, and field highlight overlays.
  - **Pane 2 (Middle 1/3)**: AI-OCR Extracted Intelligence with field confidence ratings, bounding box coordinates, and model warning tags.
  - **Pane 3 (Right 1/3)**: Citizen Review & Admin Decision Matrix featuring side-by-side diff comparison, field pass/flag/edit controls, and color-coded record status grading.
- **Discrepancy Detection Engine**: Automatically flags mismatches between what the OCR scanned and what the citizen altered during submission (e.g., plot area or survey number alterations).
- **Official Administrative Verdicts**: One-click **Approve & Digitally Sign** (Green), **Issue Discrepancy Notice** (Red with SMS/email draft), or **Reject Record**.
- **Real-Time Notification Center**: Interactive topbar bell with animated alert radar, unread badge counter, and dropdown list deep-linking directly into flagged citizen audit records.
- **100% Mobile & Touch Optimized**: Responsive tab switching for the Tri-Pane studio, collapsible navigation drawers, touch-scrolling data tables, and fluid modal dialogs across all phones and tablets.
- **Role-Based Authentication**: Secure login screen with password visibility toggles, 3-attempt lockout security, and a floating **Developer Mode** auto-fill tool.

---

## 🔑 Login Credentials

| Role | Email / ID | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin@bhoomintelli.in` | `Admin@123` | Full Superadmin / Audit Rights |

> ⚡ **Quick Dev Access**: Toggle the **Dev Mode** pill at the bottom right of the screen to reveal the **"⚡ Auto-Fill Demo Credentials"** button on the login screen.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### Installation & Local Run

1. Open your terminal and navigate to the `Admin Portal/` directory:
   ```bash
   cd "Admin Portal"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```

4. Open your browser at:
   ```
   http://localhost:5174
   ```
   *(Main citizen site runs on port `5173`, admin portal runs on `5174`)*

5. Build for production:
   ```bash
   npm run build
   ```

---

## 🌐 Deploying to Vercel (Live URLs)

Both **BhoomiIntelli Citizen Portal** (`landrecord/`) and **Admin Portal** (`Admin Portal/`) are fully configured for Vercel with dedicated `vercel.json` SPA rewrites.

### Steps to Deploy on Vercel:
1. Push your repository to GitHub (`git add . && git commit -m "deploy" && git push origin main`).
2. Log into [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Select your repository.
4. **Deploy App 1 — Citizen Website**:
   - In the import dialog, click **Edit** next to **Root Directory**.
   - Select **`landrecord`**.
   - Framework Preset: **Vite**.
   - Click **Deploy** (e.g. `https://bhoomintelli.vercel.app`).
5. **Deploy App 2 — Admin Portal**:
   - Return to your Vercel dashboard and click **"Add New Project"** again.
   - Select the same GitHub repository.
   - Click **Edit** next to **Root Directory**.
   - Select **`Admin Portal`**.
   - Framework Preset: **Vite**.
   - Click **Deploy** (e.g. `https://bhoomintelli-admin.vercel.app`).

Both apps will be live with free automatic HTTPS/SSL and instant CI/CD on every git push!

---

## 🖥️ Layout & Tri-Pane Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       BHOOMIINTELLI ADMIN TOPBAR                            │
│  [Logo] BhoomiIntelli Admin     [Notifications]    [Admin: Parv Jain (Role)]│
├───────────────┬─────────────────────────┬───────────────────────────────────┤
│ PANE 1 (1/3)  │       PANE 2 (1/3)      │            PANE 3 (1/3)           │
│ Original Deed │    AI OCR Extraction    │  Citizen Review vs Admin Verdict  │
├───────────────┼─────────────────────────┼───────────────────────────────────┤
│ • Parchment   │ • Avg Confidence: 94.2% │ • Uploader: Parv Jain             │
│   Deed View   │ • Owner Name (97%)      │ • Comparison: Deed vs Citizen     │
│ • Zoom & Pan  │ • Khasra / Survey (95%) │ • Citizen Modified: Area (2.4 Ha) │
│ • Stamp Seal  │ • Plot Area (88% - Warn)│ • Admin Actions: [Pass/Flag/Edit] │
│ • SHA-256     │ • Mutation ID (92%)     │ • Status: 🟢 Good  🟡 Rev  🔴 Flag │
│   Hash Check  │ • Hover Hotspot Sync    │ • [Approve] [Issue Notice] [Rej]  │
└───────────────┴─────────────────────────┴───────────────────────────────────┘
```

---

## 📂 Project Structure

```
Admin Portal/
├── index.html                  # HTML5 entry with Plus Jakarta Sans & Inter fonts
├── package.json                # Project dependencies (React 19, Vite 8)
├── vite.config.js              # Vite React configuration
├── NOTES.md                    # Detailed architectural and file-by-file guide
├── AI_NOTES.md                 # AI context, dev mode patterns, and rules
├── PROJECT_CONTEXT.md          # Comprehensive AI onboarding documentation
├── GIT_PUSH_GUIDE.md           # Instructions for pushing code to GitHub
├── README.md                   # This documentation file
├── public/                     # Static assets (logos, icons, favicons)
│   ├── bhoomintelli-icon.png
│   ├── bhoomintelli-wordmark.png
│   └── favicon.svg
└── src/                        # React source code
    ├── main.jsx                # Application root entry point
    ├── App.jsx                 # Authentication state & Dev Mode toggle
    ├── index.css               # Global CSS variables, resets & design tokens
    ├── admin.css               # Complete stylesheet (~1,500 lines, admin-* prefix)
    ├── AdminLogin.jsx          # Login card with 3-attempt lockout & auto-fill
    ├── AdminDashboard.jsx      # Sidebar navigation & Topbar shell
    ├── components/
    │   └── RecordAuditStudio.jsx # 1/3 : 1/3 : 1/3 Tri-Pane verification engine
    └── pages/
        ├── DashboardHome.jsx   # Analytics cards, metrics & audit feed
        ├── RecordsPage.jsx     # Records table, filter tabs & audit launcher
        ├── UsersPage.jsx       # Citizen management & role permissions
        ├── AnalyticsPage.jsx   # Metrics, trend charts & report generator
        └── SettingsPage.jsx    # System preferences & admin profile
```

---

## 🎨 Design System & Conventions

- **Colors**:
  - Primary Green: `#1b5e3a`
  - Primary Green Hover: `#154c2e`
  - Dark Surface / Text: `#0f172a` / `#1e293b`
  - Alert Red (Flagged): `#dc2626` / `#fef2f2`
  - Caution Yellow (Review): `#ca8a04` / `#fefce8`
  - Success Green (Good): `#16a34a` / `#f0fdf4`
- **Class Naming**: Strictly prefixed with `admin-*` to eliminate namespace collision with the citizen website (`bhoomi-*`).
- **Typography**: `Plus Jakarta Sans` for headings and `Inter` for body and tables.

---

## 📜 License & Ownership
Smart India Hackathon (SIH) Prototype — Team BhoomiIntelli. All Rights Reserved.
