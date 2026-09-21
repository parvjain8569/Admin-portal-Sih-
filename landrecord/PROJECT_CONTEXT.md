# PROJECT CONTEXT — BhoomiSetu / BhoomiIntelli
> AI ONBOARDING FILE — Upload this to any AI assistant to get full project context instantly.
> Last Updated: 2026-09-17
> Always keep this file in sync with the actual codebase.

---

## 1. WHAT IS THIS PROJECT?

BhoomiSetu (meaning "Land Bridge" in Hindi) is a Smart India Hackathon (SIH) prototype for digitizing and verifying land records in India using AI-OCR, Blockchain verification, and Biometric OTP authentication.

The app is also branded as "BhoomiIntelli" in some UI elements.

**Core problem being solved**: Indian land records are mostly paper-based, easily forged, and disconnected across states. BhoomiSetu digitizes physical land documents, extracts data via AI-OCR, stores it on blockchain for tamper-proof verification, and links it to the government cadastral registry.

**Current status**: This is a prototype/demo — the frontend uses simulated data, and the backend API exists but is not yet connected to the frontend.

---

## 2. TECH STACK

### Frontend
- **Framework**: React 19 (via Vite 8)
- **Build tool**: Vite
- **Language**: JavaScript (JSX)
- **Styling**: Plain CSS (no Tailwind, no CSS-in-JS)
- **State management**: React useState/useRef only (no Redux, no Zustand)
- **Routing**: No router library — page switching is done with a simple `currentPage` state in App.jsx
- **Entry**: src/main.jsx -> src/App.jsx

### Backend
- **Runtime**: Node.js with Express
- **Language**: JavaScript (ES Modules)
- **Database**: Flat file (records.json) — no real DB yet
- **Port**: 5000
- **CORS**: Enabled for all origins

### No external API calls currently — everything is mocked client-side.

---

## 3. PROJECT STRUCTURE

```
landrecord/
├── index.html                    # HTML shell with <div id="root">
├── package.json                  # Frontend deps (React 19, Vite 8)
├── package-lock.json             # Lockfile for deterministic installs
├── vite.config.js                # Vite + React plugin config
├── postcss.config.js             # PostCSS config
├── .oxlintrc.json                # Oxlint config
├── .gitignore                    # Git ignore rules
├── NOTES.md                      # Dev notes — file-by-file explanations
├── PROJECT_CONTEXT.md            # THIS FILE — AI onboarding context
├── GIT_PUSH_GUIDE.md             # Which files to push for teammates
├── README.md                     # Basic project readme
│
├── public/                       # Static assets served as-is by Vite
│   ├── bhoomintelli-icon.png     # Square logo icon (favicon/PWA)
│   ├── bhoomintelli-wordmark.png # Full horizontal logo
│   ├── favicon.svg               # SVG favicon for browser tab
│   └── icons.svg                 # Shared SVG sprite for UI icons
│
├── src/
│   ├── main.jsx                  # Entry: mounts <App /> in StrictMode
│   ├── App.jsx                   # Root router: switches between website/auth pages
│   ├── index.css                 # Global CSS reset
│   ├── App.css                   # Minimal .app-root styles
│   │
│   ├── website.jsx               # Main landing page + dashboard (Home & My Records views)
│   ├── website.css               # All styles for website.jsx and child components (~78 KB)
│   ├── login.jsx                 # Auth page: signin, register, OTP, forgot password
│   ├── login.css                 # All styles for login.jsx
│   │
│   ├── assets/
│   │   ├── bhoomintelli-icon.png       # Square logo icon
│   │   ├── bhoomintelli-wordmark.png   # Full horizontal logo
│   │   ├── hero.png                    # Hero section image
│   │   ├── react.svg                   # Default Vite React logo (unused)
│   │   └── vite.svg                    # Default Vite logo (unused)
│   │
│   ├── components/
│   │   ├── Navbar.jsx                  # Top navigation bar
│   │   ├── HeroSection.jsx             # Split-screen hero with upload CTA
│   │   ├── FeaturesSection.jsx         # 4-card technology features grid
│   │   ├── ThreeStepsSection.jsx       # "How It Works" 3-step section
│   │   ├── ImpactSection.jsx           # Statistics/impact numbers strip
│   │   ├── TransformationFlow.jsx      # Paper -> Digital flow diagram
│   │   ├── Footer.jsx                  # Site footer
│   │   ├── MyRecordsSection.jsx        # My Records dashboard view
│   │   ├── FetchingDetailsOverlay.jsx  # Post-upload animated "AI extracting" spinner overlay
│   │   ├── DocumentReviewPage.jsx      # AI-extracted fields review page with document preview
│   │   ├── CaptchaModal.jsx            # Canvas-drawn CAPTCHA verification modal
│   │   │
│   │   ├── drawer/
│   │   │   ├── MenuDrawer.jsx          # Slide-in side drawer shell with tabs
│   │   │   ├── ProfileTab.jsx          # Edit profile + phone OTP verification
│   │   │   ├── NotificationsTab.jsx    # In-app notifications list
│   │   │   ├── SettingsTab.jsx         # App settings toggles
│   │   │   ├── HelpCenterTab.jsx       # FAQ / help content
│   │   │   └── AboutUsTab.jsx          # About BhoomiSetu / SIH info
│   │   │
│   │   └── modals/
│   │       ├── AuthRequiredModal.jsx   # Shown to guest when they try to upload
│   │       ├── UploadWizardModal.jsx   # Multi-step file upload wizard
│   │       └── RecordDetailsModal.jsx  # Processing spinner + record details view
│   │
│   ├── utils/
│   │   └── userUtils.js               # extractCleanUsername() + formatDisplayName()
│   │
│   └── pages/                         # EMPTY — reserved for future page components
│
└── backend/
    ├── server.js                      # Express API (port 5000)
    ├── records.json                   # Flat-file records database
    └── package.json                   # Backend deps (express, cors)
```

---

## 4. KEY STATE & DATA MODEL

### App.jsx state (top-level)
```js
currentPage: 'website' | 'auth'    // Which page to show
currentUser: null | { name, username, email }   // Logged in user
authMode: 'signin' | 'create'      // Which auth view to open
```

### website.jsx state (main page)
```js
activeNav: 'Home' | 'My Records'   // Which main view is active
isDrawerOpen: boolean               // Side drawer open/closed
activeDrawerTab: 'profile' | 'notification' | 'settings' | 'help' | 'about'
profileData: {
  name, email, contact, district, state,
  isPhoneVerified: boolean
}
records: Array<Record>              // All land records (in-memory)
notifications: Array<Notification> // In-app notifications
showModal: boolean                  // RecordDetailsModal visibility
isProcessing: boolean               // Show spinner vs record details in modal
showAuthPromptModal: boolean        // AuthRequiredModal visibility
showUploadWizard: boolean           // UploadWizardModal visibility
lastUploadedDoc: { name, size, uploadTime } | null
selectedRecordForModal: Record | null
verificationAlert: boolean          // Show phone verification warning

// Post-upload pipeline states
showFetchingOverlay: boolean        // FetchingDetailsOverlay visibility
showDocumentReview: boolean         // DocumentReviewPage visibility
showCaptcha: boolean                // CaptchaModal visibility
```

### Record data shape
```js
{
  id: 'REC-XXXXX',
  ownerName: string,
  parcelId: 'HR-XXXXX',
  khasraNo: 'XX/X',
  district: string,
  state: string,
  area: '1.45 Hectares',
  date: 'DD Mon YYYY',
  status: 'Verified',
  documentName: string,
  fileSize: string,
  isNew: boolean    // true only for just-uploaded records
}
```

---

## 5. USER FLOWS

### Flow 1: Guest visits site
1. App.jsx renders Website (currentPage = 'website', currentUser = null)
2. User sees: Navbar (with Login button), Hero, Features, Steps, Impact, TransformationFlow, Footer
3. User clicks Upload -> AuthRequiredModal appears
4. User clicks "Proceed to Login" -> App.jsx sets currentPage = 'auth'

### Flow 2: User registers
1. Login page opens in 'create' view
2. User enters name, email, password -> clicks "Create Account"
3. OTP view shows (demo OTP displayed on screen)
4. User enters OTP -> onLoginSuccess({ name, username, email }) called
5. App.jsx sets currentUser and currentPage = 'website'

### Flow 3: Upload land document (authenticated + phone verified)
1. User clicks Upload button anywhere
2. website.jsx checks: user logged in? YES. Phone verified? YES.
3. UploadWizardModal opens
4. User picks a file, confirms, clicks Upload
5. onComplete(file) fires
6. **FetchingDetailsOverlay** appears (~1.6s animated spinner with progress steps)
7. **DocumentReviewPage** opens — shows AI-extracted fields with highlighted document text
8. User reviews each field (accept/reject), then clicks "Confirm & Save"
9. **CaptchaModal** appears — user must solve canvas-drawn CAPTCHA
10. CAPTCHA validated → record is finalised
11. Record added to records[] state, notification added
12. RecordDetailsModal shows full record details
13. My Records tab shows new record

### Flow 4: Upload without phone verification
1. User clicks Upload
2. website.jsx checks: phone verified? NO
3. Sets verificationAlert = true, opens drawer to ProfileTab
4. User sees alert banner telling them to verify phone
5. User clicks "Verify" in ProfileTab -> OTP flow -> onProfileSave({ isPhoneVerified: true })
6. Now user can upload

---

## 6. COMPONENT COMMUNICATION (PROP DRILLING MAP)

```
App.jsx
  └── Website (user, onLogout, onOpenLogin)
        └── Navbar (user, unreadCount, onOpenDrawer, onOpenLogin, onLogout, ...)
        └── MenuDrawer (user, activeTab, profileData, onProfileSave, notifications, ...)
              └── ProfileTab (profileData, onProfileSave, verificationAlert)
              └── NotificationsTab (notifications, onMarkAllRead, unreadCount)
              └── SettingsTab ()
              └── HelpCenterTab ()
              └── AboutUsTab ()
        └── AuthRequiredModal (onClose, onProceedToLogin)
        └── UploadWizardModal (onClose, onComplete)
        └── FetchingDetailsOverlay (fileName)
        └── DocumentReviewPage (onConfirm, onCancel)
        └── CaptchaModal (onSuccess, onClose)
        └── RecordDetailsModal (isOpen, isProcessing, lastUploadedDoc, selectedRecord, onClose, onNavigateToRecords)
        └── HeroSection (user, lastUploadedDoc, onUpload, onScrollToSteps, onViewRecords)
        └── FeaturesSection ()
        └── ThreeStepsSection (ref)
        └── ImpactSection ()
        └── TransformationFlow ()
        └── MyRecordsSection (records, onUpload, onViewRecord)
        └── Footer ()
```

---

## 7. BACKEND API REFERENCE

> NOTE: Currently not called by the frontend. For future integration.

### GET /api/records
Returns all land records from records.json.
Response: `{ success: true, records: [...] }`

### POST /api/upload
Body: `{ fileName, fileSize, ownerName }`
Simulates OCR processing, creates a new record, saves to records.json.
Response: `{ success: true, message: '...', record: {...} }`

### GET /api/records/:id
Returns a single record by ID.
Response: `{ success: true, record: {...} }` or 404.

---

## 8. CSS CLASS NAMING CONVENTIONS

- **Global**: `.app-root` (App.jsx)
- **Website/Landing page**: `.bhoomi-*` (e.g. `.bhoomi-container`, `.bhoomi-navbar`, `.bhoomi-modal`, `.bhoomi-modal-overlay`)
- **Auth/Login page**: `.auth-*` (e.g. `.auth-form`, `.auth-input`, `.auth-btn-primary`, `.auth-otp-input`)
- **Post-upload pipeline**: `.fetching-*` (FetchingDetailsOverlay), `.doc-review-*` (DocumentReviewPage), `.captcha-*` (CaptchaModal)
- **No CSS frameworks** are used. All styles are hand-written in the respective `.css` files.

---

## 9. KNOWN ISSUES & LIMITATIONS

1. **No real auth** — Login is 100% client-side. There is no JWT, no session, no backend auth endpoint.
2. **Demo OTP** — The OTP is generated client-side and shown on screen (for demo purposes only).
3. **No persistent data** — All records and notifications are lost on page refresh (stored only in React state).
4. **Backend disconnected** — The Express server exists but the frontend makes zero API calls. All data is mocked.
5. **No routing library** — Navigation between "Home" and "My Records" is done with a simple `activeNav` state variable, not React Router.
6. **pages/ folder is empty** — It was intended for future separate pages but nothing is there yet.
7. **DocumentReviewPage uses fixed demo data** — The AI-extracted fields are hardcoded, not real OCR output.
8. **CaptchaModal is client-side only** — The CAPTCHA is generated and validated in the browser, not server-validated.

---

## 10. HOW TO RUN THE PROJECT

### Frontend
```bash
cd landrecord
npm install
npm run dev
# Opens at http://localhost:5173
```

### Backend (optional, not connected to frontend yet)
```bash
cd landrecord/backend
npm install
node server.js
# Runs at http://localhost:5000
```

---

## 11. IMPORTANT RULES FOR THIS PROJECT

1. Always update NOTES.md, PROJECT_CONTEXT.md, and GIT_PUSH_GUIDE.md when making any change.
2. CSS class names follow the `bhoomi-*` (website), `auth-*` (login), `fetching-*`, `doc-review-*`, `captcha-*` convention — do not break this.
3. No routing library — page switching uses the `currentPage` state in App.jsx.
4. No state management library — use React useState only.
5. No CSS frameworks — write plain CSS only.
