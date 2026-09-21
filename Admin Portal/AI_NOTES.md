# AI Developer Notes & Instructions — BhoomiIntelli Admin Portal

> 🤖 **FOR AI ASSISTANTS**: Read this file first before making any code modifications to the Admin Portal!
> Last Updated: 2026-09-19

---

## 🎯 Purpose & Core Objective
The **Admin Portal** is a specialized, high-security dashboard for land administrators and revenue officers auditing citizen-submitted land records within the **BhoomiIntelli (SIH)** ecosystem.

The user's key requirement is a **Tri-Pane Split Screen Verification (1/3 : 1/3 : 1/3 layout)**:
1. **Left 1/3**: Original uploaded deed document (with interactive parchment, seals, zoom controls, and highlight hotspots).
2. **Center 1/3**: AI-OCR extraction results (structured fields, confidence scores, bounding boxes, OCR warnings).
3. **Right 1/3**: Citizen review vs. Admin decision matrix (what the user accepted/modified/rejected, admin field-by-field pass/flag/edit controls, record classification grading, and verdict actions).
4. **Mobile Experience (< 1024px)**: Responsive tab switcher (`admin-audit-mobile-tabs`) allowing instant 1-touch switching between the 3 panes on phones and tablets.

---

## 📋 Mandatory Rules & Conventions

### 1. Documentation Synchronization Rule ⚠️ (MANDATORY)
**Whenever you make ANY change to the Admin Portal (adding a feature, fixing a bug, updating a style, or modifying state):**
You **MUST** update all of the following documentation files in the same turn:
- `Admin Portal/NOTES.md`
- `Admin Portal/notes.txt`
- `Admin Portal/AI_NOTES.md`
- `Admin Portal/PROJECT_CONTEXT.md`
- `Admin Portal/README.md`
- `Admin Portal/GIT_PUSH_GUIDE.md`

### 2. Strict CSS Scoping Rule (`admin-*`)
- Every CSS class in `src/admin.css` must begin with `admin-*` or `admin-audit-*`.
- **Never** use `bhoomi-*` or `auth-*` (those belong exclusively to the `landrecord/` citizen app).
- Maintain pure Vanilla CSS. Do **not** install Tailwind, Bootstrap, or any CSS preprocessor.

### 3. State & Architecture Rules
- Use React hooks (`useState`, `useEffect`, `useRef`). Do not introduce external state libraries (no Redux, Zustand, Recoil).
- Use inline SVGs for all icons — zero external icon dependencies.
- The Admin Portal runs on port **5174** to avoid port collisions with `landrecord` on **5173**.

### 4. Brand & Asset Integrity
- The official brand assets are:
  - `public/bhoomintelli-icon.png`
  - `public/bhoomintelli-wordmark.png`
  - `public/favicon.svg`
- Do **not** alter, overwrite, or delete these logo files.

---

## 🔑 Administrative Access & Dev Mode

- **Email**: `admin@bhoomintelli.in`
- **Password**: `Admin@123`
- **Developer Mode**:
  - Toggled via the bottom-right floating pill.
  - Persisted in `localStorage.getItem('adminDevMode')`.
  - When active, reveals an **"⚡ Auto-Fill Demo Credentials"** button on `AdminLogin.jsx`.

---

## 🔔 Notification Center System (`AdminDashboard.jsx`)
- **Interactive Bell Dropdown**: Clicking the bell icon toggles an alert dropdown with unread counter badge.
- **Pulsing Indicator**: An animated CSS radar ping (`.admin-bell-ping`) calls attention to unread discrepancy alerts.
- **Alert Types**:
  - 🔴 **Discrepancies**: Directly deep-links to the Tri-Pane Audit Studio for flagged records (e.g. Parv Jain `REC-28452`).
  - 🟡 **New Submissions**: Queued citizen uploads (e.g. Sunita Devi `REC-28450`).
  - 🔴 **Disputes**: Overlapping survey claims (e.g. Priya Patel `REC-28448`).
  - 🟢 **System**: Registry sync updates.
- **Interactions**:
  - Click on any notification marks it as read and switches active view to `records`.
  - "Mark all as read" button clears unread states and dismisses the bell dot.
  - Automatically closes on outside click via React `useEffect` + `useRef`.

---

## 🧪 Real-World Demo Scenario: Parv Jain (`REC-28452`)

When demonstrating the audit workflow, the primary showcase record is:
- **Uploader**: **Parv Jain**
- **Document**: Deed of Conveyance & Title Transfer (Form 7/12)
- **Khasra**: `128/3` | **Parcel**: `HR-40222` | **District**: Gurugram, Haryana
- **The Discrepancy Flow**:
  1. OCR extracts `2.10 Hectares` from deed text with 88% confidence.
  2. Citizen Parv Jain altered the value to `2.40 Hectares` during his upload self-review.
  3. The system highlights this mismatch in **red/amber** in the matrix and displays the citizen's explanation note.
  4. The Admin can inspect the deed in Pane 1, decide to `✓ Pass`, `⚠️ Flag`, or `✎ Edit` the value, mark the record as 🟢 Good, 🟡 Under Review, or 🔴 High Risk, and click **"Issue Notice to Parv"** to dispatch an automated clarification notice!
