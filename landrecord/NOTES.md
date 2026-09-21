# BhoomiSetu / BhoomiIntelli — Developer Notes
> Last Updated: 2026-09-17
> This file explains the purpose of every file in the project. Update this whenever a file is added, removed, or its role changes.

---

## Project Root: landrecord/

| File | Purpose |
|------|---------|
| index.html | The single HTML shell. Has `<div id="root">` where React mounts. Also sets the page title and loads the Vite entry point. |
| package.json | Frontend dependencies. Uses React 19 + Vite 8. Key deps: react, react-dom. Dev deps: vite, @vitejs/plugin-react, oxlint. |
| package-lock.json | Auto-generated lockfile for deterministic frontend installs. |
| vite.config.js | Vite build configuration. Sets up the React plugin so JSX works. |
| postcss.config.js | PostCSS configuration (currently minimal). |
| .oxlintrc.json | Linting config using oxlint (fast Rust-based ESLint alternative). |
| .gitignore | Tells git to ignore node_modules/, dist/, logs, editor files, etc. |
| NOTES.md | THIS FILE. Developer reference explaining every file. Must be updated on every change. |
| PROJECT_CONTEXT.md | One-file AI-readable full project context. Upload to any AI to get it up to speed instantly. Must be updated on every change. |
| GIT_PUSH_GUIDE.md | Quick reference for teammates — lists exactly which files to push/pull for the project to work. |
| README.md | Basic project readme. |

---

## public/ — Static Public Assets (served as-is by Vite)

| File | Purpose |
|------|---------|
| bhoomintelli-icon.png | Square logo icon used as the site favicon and PWA icon. |
| bhoomintelli-wordmark.png | Full horizontal wordmark logo (public copy). |
| favicon.svg | SVG favicon for the browser tab. |
| icons.svg | Shared SVG sprite containing reusable icons used across components. |

---

## src/ — Frontend Source

### Entry Points

| File | Purpose |
|------|---------|
| src/main.jsx | App entry point. Creates React root and renders `<App />` inside `<StrictMode>`. Imports global index.css. |
| src/App.jsx | Root component and page router. Manages 2 pages: website and auth. Holds state for: currentPage, currentUser, authMode. Passes login/logout handlers down. |
| src/index.css | Global CSS reset and base font styles. Applied to the entire app. |
| src/App.css | Minimal styles scoped to the .app-root wrapper div. |

---

### Pages

| File | Purpose |
|------|---------|
| src/website.jsx | The main landing page / dashboard. Manages all top-level state: records list, drawer open/close, active nav tab (Home or My Records), modals, notifications, profile data, upload wizard, and the new post-upload pipeline (FetchingDetailsOverlay → DocumentReviewPage). Renders Navbar, HeroSection, FeaturesSection, ThreeStepsSection, ImpactSection, TransformationFlow, Footer, MenuDrawer, and all modals/overlays. |
| src/website.css | All styles for the website page and its sections. Contains .bhoomi-container, .bhoomi-navbar, section-specific classes, card styles, modal overlays, fetching-overlay styles, document-review styles, captcha styles, etc. This is the biggest CSS file in the project (~78 KB). |
| src/login.jsx | Authentication page. Handles 6 views as internal state: signin, create (register), otp (email OTP for new accounts), forgot_email, forgot_otp, forgot_reset. Uses a demo OTP system (no real backend auth). Calls onLoginSuccess(userData) on success. |
| src/login.css | All styles for the login/auth page. Uses class prefix auth-. Includes card layout, OTP input boxes, form groups, buttons, alerts, and demo OTP pill. |

---

### src/components/ — Reusable UI Components

#### Internationalization (src/i18n/)

| File | Purpose |
|------|---------|
| src/i18n/index.js | Main entry point for translations. Exports dictionaries. |
| src/i18n/LanguageContext.jsx | React Context (`LanguageProvider`) to manage global language state and persist it to `localStorage`. Exposes `useLanguage()` hook with `t(key)` translation function. |
| src/i18n/translations/en.js | English translation dictionary containing all localized strings. |
| src/i18n/translations/hi.js | Hindi translation dictionary containing all localized strings. |

#### Standalone Components

| File | Purpose |
|------|---------|
| Navbar.jsx | Top navigation bar. Shows logo (BhoomiIntelli wordmark), nav links (Home, My Records, Services), notification bell with unread badge, user avatar/login button, and hamburger for the drawer. |
| HeroSection.jsx | The big split-screen hero at the top of the home page. Left side: headline, CTA upload button. Right side: animated document upload card. Shows different UI when user is logged in vs guest. |
| FeaturesSection.jsx | 4-card grid showing the 4 key technology pillars: AI-OCR, Blockchain, Biometric OTP, Government Integration. Purely presentational. |
| ThreeStepsSection.jsx | "How It Works" — 3-step explainer: Upload Document, AI Digitization, Verified Record. Uses forwardRef so website.jsx can scroll to it. |
| ImpactSection.jsx | Statistics/impact strip showing large numbers like records digitized, fraud prevented, states covered. Purely presentational. |
| TransformationFlow.jsx | Visual diagram showing the transformation from physical paper records to digital blockchain-verified records. Purely presentational. |
| Footer.jsx | Site footer. Shows copyright, project name (BhoomiSetu), and SIH branding. |
| MyRecordsSection.jsx | The "My Records" dashboard view. Shows a table/list of all uploaded land records. Each row has parcel ID, owner, date, status badge, and a view button. Has an upload button to add more. Calls onViewRecord(rec) when a record row is clicked. |
| FetchingDetailsOverlay.jsx | Full-screen animated overlay shown immediately after a file is uploaded. Displays a spinner with stepped progress text ("Document scanned", "AI extracting fields", "Verifying data"). Auto-dismisses after ~1.6s and transitions to DocumentReviewPage. |
| DocumentReviewPage.jsx | Post-upload AI review page. Shows the uploaded document text with highlighted AI-extracted fields (owner name, khasra number, area, deed date, mutation IDs). Each field has a confidence status (GREEN/AMBER) and an accept/reject toggle. User reviews all fields, then clicks "Confirm & Save" to finalise the record. Uses fixed demo data for the prototype. |
| CaptchaModal.jsx | Security CAPTCHA modal with a canvas-drawn distorted alphanumeric code. User must type the code correctly to proceed (used during the upload/confirm flow). Has a refresh button to regenerate, and validates input case-insensitively. |

---

#### src/components/drawer/ — Slide-in Side Drawer

| File | Purpose |
|------|---------|
| MenuDrawer.jsx | The main drawer shell. A slide-in panel. Contains tab navigation: Profile, Notifications, Settings, Help, About. Renders the active tab content. Accepts all data and callbacks as props. |
| ProfileTab.jsx | Shows user avatar, name, email. Allows editing name, contact (phone), district, state. Has phone OTP verification flow (demo). Calls onProfileSave(updates) on save. |
| NotificationsTab.jsx | Shows list of in-app notifications (upload success, system messages). Has "Mark All Read" button. |
| SettingsTab.jsx | Settings panel with toggles for theme, notifications preferences, language. Mostly UI-only demo state. |
| HelpCenterTab.jsx | FAQ/Help panel showing common questions and answers. Purely presentational. |
| AboutUsTab.jsx | About panel explaining what BhoomiSetu is, the SIH context, and the mission. Purely presentational. |

---

#### src/components/modals/ — Modal Dialogs

| File | Purpose |
|------|---------|
| AuthRequiredModal.jsx | Modal shown when a guest user (not logged in) tries to upload a document. Shows a lock icon and a "Proceed to Login" button. Props: onClose, onProceedToLogin. |
| UploadWizardModal.jsx | Multi-step wizard modal for uploading a land document. Steps: (1) Select file, (2) Confirm details, (3) Upload. On completion calls onComplete(file) with the selected file object. |
| RecordDetailsModal.jsx | Shows after a document upload — first shows a "Processing..." spinner, then shows the digitized record details: Parcel ID, Khasra No., district, area, owner, status badge, date. Also used when viewing any existing record. |

---

### src/utils/ — Utility Functions

| File | Purpose |
|------|---------|
| userUtils.js | Smart username extraction from email addresses. extractCleanUsername(email) strips the email domain, removes trailing numbers, and strips known Indian surnames/suffixes to get a clean first name (e.g. parvjain930@gmail.com -> parv). formatDisplayName(username) capitalizes first letter. Contains 100+ Indian surnames in COMMON_SUFFIXES array. |

---

### src/assets/ — Static Assets (bundled by Vite)

| File | Purpose |
|------|---------|
| bhoomintelli-icon.png | Square logo icon used in the navbar and favicon. |
| bhoomintelli-wordmark.png | Full horizontal wordmark logo used in navbar and hero. |
| hero.png | Hero section illustration/image. |
| react.svg | Default Vite React logo (not actively used). |
| vite.svg | Default Vite logo (not actively used). |

---

## backend/ — Node.js Express Backend

| File | Purpose |
|------|---------|
| server.js | Express REST API server running on port 5000. Has 3 endpoints: GET /api/records (fetch all), POST /api/upload (simulate OCR + create record), GET /api/records/:id (get single record). Uses records.json as flat file database. |
| records.json | The flat-file "database". Stores all land records as a JSON array under the key "records". Each record has: id, ownerName, parcelId, khasraNo, district, state, area, date, status, documentName, fileSize. |
| package.json | Backend dependencies. Key deps: express, cors. Uses ES modules ("type": "module"). |

NOTE: The frontend currently uses simulated/mock data and does NOT call the backend API. The backend exists for future integration. All upload logic in website.jsx is client-side simulation with setTimeout.

---

## Data Flow Summary

User opens app
  -> main.jsx mounts App
  -> App shows Website (guest) or Login page

Guest user:
  -> Sees Navbar, Hero, Features, Steps, Impact, Footer
  -> Clicks Upload -> AuthRequiredModal pops up -> redirected to Login

Logged-in user:
  -> Profile loaded in MenuDrawer (ProfileTab)
  -> Clicks Upload:
      -> If phone NOT verified -> opens drawer to ProfileTab with alert
      -> If phone IS verified  -> UploadWizardModal opens
  -> Selects file in wizard -> onComplete(file) called
  -> FetchingDetailsOverlay appears (~1.6s animated spinner with progress steps)
  -> DocumentReviewPage opens (AI-extracted fields with highlighted document text)
  -> User reviews and accepts/rejects each field
  -> User clicks "Confirm & Save" -> CaptchaModal appears
  -> User solves CAPTCHA -> record is finalised
  -> Record added to records[] state, notification added
  -> My Records tab shows new record

---

## Known Limitations / TODOs
- Backend API not connected to frontend yet (all data is mock/in-memory)
- Auth is fully demo/client-side (no real JWT, no server)
- OTP is displayed in plain text on screen (demo only)
- No persistent storage — all records reset on page refresh
- pages/ folder exists in src but is currently empty (planned for future route pages)
- DocumentReviewPage uses fixed demo data (not real AI-OCR output)
- CaptchaModal uses client-side generated CAPTCHA (not a server-validated challenge)
