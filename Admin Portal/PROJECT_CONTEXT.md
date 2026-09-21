# PROJECT CONTEXT — BhoomiIntelli Admin Portal
> AI ONBOARDING FILE — Upload or reference this file to get 100% full context on the Admin Portal.
> Last Updated: 2026-09-19
> Always keep this file in sync with every modification to the Admin Portal codebase.

---

## 1. WHAT IS THE ADMIN PORTAL?

The **BhoomiIntelli Admin Portal** is an administrative dashboard for the BhoomiSetu / BhoomiIntelli land record digitization platform (Smart India Hackathon Prototype).

While the citizen-facing app (`landrecord/`) allows citizens to sign in, upload land deed documents, and review AI-extracted fields, the **Admin Portal** (`Admin Portal/`) empowers revenue authorities, tehsildars, sub-registrars, and land auditors to:
1. **Audit Citizen Submissions**: Inspect documents uploaded by citizens (e.g. Parv Jain, Ravi Sharma, Sunita Devi).
2. **Tri-Pane Split-Screen Verification**: View the original legal deed on the left 1/3 of the screen, AI-OCR extracted details in the center 1/3, and what the citizen accepted/altered alongside admin audit controls on the right 1/3.
3. **Discrepancy Resolution**: Detect when citizens alter values that contradict the deed (such as claiming 2.40 Hectares when the deed states 2.10 Hectares).
4. **Official Record Grading**: Categorize records into color-coded tiers:
   - 🟢 **Good / Verified (Green)**: Clean, legitimate, matching registry.
   - 🟡 **Under Review / Needs Attention (Yellow)**: Minor discrepancy or low OCR confidence requiring secondary check.
   - 🔴 **Flagged / High Risk (Red)**: Serious mismatch, altered boundaries, or disputed title.
   - 🔵 **Pending Queue (Blue)**: Unprocessed queue items.
5. **Issue Formal Decisions**: One-click **Approve & Digitally Sign**, **Issue Discrepancy Notice to Citizen** (with automated SMS/email notice draft), or **Reject Record**.

---

## 2. CREDENTIALS & DEMO ACCESS

- **Email / ID**: `admin@bhoomintelli.in`
- **Password**: `Admin@123`
- **Security Features**:
  - 3-attempt lockout (locks the account for 60 seconds after 3 failed attempts).
  - Password visibility toggle.
  - Floating **Dev Mode pill** at bottom-right (persisted in `localStorage.adminDevMode`).
  - When Dev Mode is enabled, an **"⚡ Auto-Fill Demo Credentials"** button appears on the login screen to populate the fields with a single click.

---

## 3. TECH STACK

- **Framework**: React 19 (via Vite 8)
- **Language**: JavaScript (JSX, ES Modules)
- **Styling**: Pure Vanilla CSS (`src/admin.css` & `src/index.css`) — NO Tailwind, NO bootstrap, NO CSS-in-JS.
- **State Management**: Clean React `useState` / `useEffect` / `useRef` only (no external Redux/Zustand libraries).
- **Icons**: Custom inline SVGs for zero latency and crisp rendering on all screens.
- **Port**: Runs on `http://localhost:5174` (allowing simultaneous side-by-side execution with the main citizen portal running on `http://localhost:5173`).

---

## 4. DIRECTORY & FILE GUIDE

```
Admin Portal/
├── index.html                   # HTML template loading Google Fonts (Plus Jakarta Sans & Inter)
├── package.json                 # Dependencies (react, react-dom, vite, @vitejs/plugin-react)
├── vite.config.js               # Vite build configuration (port 5174)
├── README.md                    # Public user & setup documentation
├── PROJECT_CONTEXT.md           # THIS FILE — AI master reference
├── NOTES.md                     # File-by-file developer reference
├── AI_NOTES.md                  # Workflow, rules, and AI architectural notes
├── GIT_PUSH_GUIDE.md            # Git commit and push reference
├── notes.txt                    # Plaintext companion notes
│
├── public/                      # Static assets
│   ├── bhoomintelli-icon.png    # High-res square logo icon
│   ├── bhoomintelli-wordmark.png # Horizontal brand wordmark
│   └── favicon.svg              # Browser tab icon
│
└── src/                         # Application source code
    ├── main.jsx                 # Entry point, mounts React root
    ├── App.jsx                  # Top-level shell, handles auth state & Dev Mode toggle
    ├── index.css                # Global CSS variables, fonts, resets
    ├── admin.css                # Master CSS file (~1,500 lines, all admin-* classes)
    ├── AdminLogin.jsx           # Secure login component with lockout & auto-fill
    ├── AdminDashboard.jsx       # Main layout: sidebar, topbar with notification center & active page router
    │
    ├── components/
    │   └── RecordAuditStudio.jsx # 3-column verification split view (1/3 : 1/3 : 1/3)
    │
    └── pages/
        ├── DashboardHome.jsx    # Metric cards, quick actions, recent audit activity feed
        ├── RecordsPage.jsx      # Records table, search, category filter pills & audit trigger
        ├── UsersPage.jsx        # Registered citizens, role management & status toggles
        ├── AnalyticsPage.jsx    # Verification throughput, state-wise volume & export reports
        └── SettingsPage.jsx     # Admin profile, security keys & system diagnostics
```

---

## 5. TRI-PANE VERIFICATION ARCHITECTURE (`RecordAuditStudio.jsx`)

The Tri-Pane Verification Studio is the core administrative feature of the portal:

### Pane 1: Original Document Viewer (Left 1/3)
- Realistic digital replica of Indian Land Deed (Deed of Conveyance & Title Transfer / Form 7/12).
- Contains official emblems, Sub-Registrar seals, stamps, signature lines, and SHA-256 integrity hash.
- Controls: Zoom In (`+`), Zoom Out (`-`), and Reset Zoom (`↺`).
- Hotspot synchronization: Hovering on any extracted field in Pane 2 activates the corresponding highlight on the document in Pane 1!

### Pane 2: AI OCR Extraction (Middle 1/3)
- Shows AI OCR model metrics (e.g. `Bhoomi-Vision v3.2`, Average Confidence: `94.2%`).
- Extracted field cards: Owner Name, Khasra/Survey No, Plot Area, Deed Date, Mutation ID.
- Color-coded confidence badges:
  - 🟢 High Confidence: `90%+`
  - 🟡 Medium Confidence: `70% - 89%`
  - 🔴 Low Confidence: `<70%`
- Warning callouts (e.g., discrepancies between printed text and handwritten notes).

### Pane 3: Citizen Review & Admin Decision Matrix (Right 1/3)
- **Citizen Action Tracking**: Displays what the citizen did during their self-review (e.g. `ACCEPTED`, `MODIFIED`, or `FLAGGED`).
- **Discrepancy Detection**: Side-by-side comparison between OCR value and citizen submitted value. Highlights modifications with red/amber badges and displays citizen remarks.
- **Admin Controls**:
  - `✓ Pass`: Verifies field against the original deed.
  - `⚠️ Flag`: Flags field as contested or suspicious.
  - `✎ Edit`: Allows admin to manually override a field with an official corrected value.
- **Record Grading**:
  - Mark entire record as 🟢 **Good (Pass)**, 🟡 **Needs Attention**, or 🔴 **Flagged (High Risk)**.
- **Verdict Action Bar**:
  - `Approve & Digitally Sign`: Applies digital seal and marks record Good (Green).
  - `Issue Discrepancy Notice`: Opens pre-filled notice modal for citizen with registered SMS/email dispatch.
  - `Reject Record`: Rejects record and logs administrative audit notes.

### Mobile Experience (< 1024px)
- On smartphones and tablets, the 3 panes switch into an intuitive 1-touch tab bar (`[📄 1. Original Deed]`, `[🤖 2. AI OCR]`, `[⚖️ 3. Audit Matrix]`), enabling clean mobile audits without vertical clutter.

---

## 6. PRIMARY DEMO SCENARIO (`REC-28452` — Parv Jain)

To demonstrate the full power of the verification system, a realistic test scenario is provided:
- **Record ID**: `REC-28452`
- **Citizen / Uploader**: **Parv Jain**
- **Document**: Deed of Conveyance & Title Transfer (Varanasi/Gurugram)
- **Khasra**: `128/3` | **Parcel**: `HR-40222`
- **Initial Status**: `🔴 Flagged / High Risk`
- **The Discrepancy**:
  - AI OCR extracted **2.10 Hectares** from deed clause 3.
  - Citizen Parv Jain altered the plot area to **2.40 Hectares** during upload with remark: *"Physical survey carried out on 14 Aug shows 2.40 Ha boundary including access canal."*
  - Admin sees the alert banner, verifies against the original deed in Pane 1, can edit the field, issue a clarification notice, or sign off after validation.

---

## 7. CRITICAL DESIGN RULES FOR ALL FUTURE CHANGES

1. **CSS Prefix Rule**: Every CSS class in the Admin Portal must use `admin-*` or `admin-audit-*` prefixes. Never use `bhoomi-*` or `auth-*` (reserved for citizen site).
2. **Zero Framework Rule**: Do not install or import Tailwind, Bootstrap, Material-UI, or Lucide-react. Keep bundle sizes featherlight using clean vanilla CSS and inline SVGs.
3. **Always Update Documentation**: Whenever a component, state variable, or feature is added or updated in the Admin Portal, immediately update:
   - `Admin Portal/NOTES.md`
   - `Admin Portal/AI_NOTES.md`
   - `Admin Portal/PROJECT_CONTEXT.md`
   - `Admin Portal/README.md`
   - `Admin Portal/GIT_PUSH_GUIDE.md`
