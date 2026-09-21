# AI Developer Notes & Project Context

## Project Overview
This project is a React + Vite prototype for a **Land Record Portal** called **BhoomIntelli**. The frontend is currently in a demo/prototype phase without a live backend connection. All data is mocked locally.

## 📋 Development Rules & Workflow
- **Plan-First Approach**: Always outline a detailed implementation plan (`implementation_plan.md`), present it to the user for approval, and only begin coding once approved.
- **Rules File**: Defined in `.agents/rules/plan-first.md`.

---

## Branding Assets
- **Logo Icon**: `public/bhoomintelli-icon.png` — the circular app icon.
- **Wordmark**: `public/bhoomintelli-wordmark.png` — the text-based logo.
- **⚠️ RULE**: Do NOT modify, regenerate, or replace these logo files. They are final assets provided by the user.

---

## Work Accomplished (Latest Session)

### 1. Login & Registration Flow (`src/login.jsx`)
- Implemented a full login and registration interface with views: `login`, `register`, `otp`, `aadhaar_kyc`.
- **Security features added**:
  - **Password strength meter** — visual indicator during registration.
  - **3-attempt account lockout** — locks account after 3 failed login attempts.
  - **Inactivity session timeout** — auto-logs out the user after idle time.

### 2. Aadhaar e-KYC Verification (`src/components/drawer/ProfileTab.jsx`)
- Built a **mock Aadhaar verification** flow using `MOCK_AADHAAR_DATABASE` (a hardcoded JS object simulating UIDAI responses).
- Integrated an "Aadhaar KYC" step during registration (can be **skipped**, but is **mandatory** in the Profile tab later).
- After verification, displays a **masked Aadhaar number** (e.g., `XXXX XXXX 1234`) with an **Edit** button to reset and re-verify. No visual Aadhaar card graphic is shown — the user explicitly requested a clean, minimal display.
- Mock data generates random names, addresses, phone numbers, etc. each time.

### 3. State Management & Synchronization
- `profileData` state is managed in `Website.jsx` and passed down to child components.
- `useEffect` hooks in `ProfileTab.jsx` sync local form state with external `profileData` props, so Aadhaar verification status persists across navigation.

### 4. Developer Mode Toggle (`devMode`)
- A **Developer Mode button** exists in the app (toggled in `Website.jsx` / `App.jsx`).
- When `devMode` is **ON**: Bypasses the login flow entirely, injects mock user data (name, email, Aadhaar details) so you can directly interact with the dashboard without authenticating.
- When `devMode` is **OFF**: Normal login/registration flow is required.
- **Purpose**: Speeds up development and testing. Should be disabled before production/demo.

---

## Drawer / Sidebar System (`src/components/drawer/`)

The app has a slide-out **MenuDrawer** (`MenuDrawer.jsx`) accessible from the navbar. It contains tabbed content that differs based on whether the user is a **guest** or **authenticated**.

### Authenticated User Tabs (5 tabs):
| Tab | Component | Description |
|-----|-----------|-------------|
| **Profile** | `ProfileTab.jsx` | Edit name, email, phone. Aadhaar e-KYC verification section with Edit button. |
| **Notifications** | `NotificationsTab.jsx` | List of notifications with a "Mark all read" button. |
| **Settings** | `SettingsTab.jsx` | App settings, profile update options. |
| **Help Center** | `HelpCenterTab.jsx` | FAQ and support information. |
| **About** | `AboutUsTab.jsx` | Project overview, tech pillars, version info, and changelog. |

### Guest User Tabs (2 tabs):
| Tab | Component | Description |
|-----|-----------|-------------|
| **Help Center** | `HelpCenterTab.jsx` | Same as above. |
| **About BhoomIntelli** | `AboutUsTab.jsx` | Same as above. |

### 5. First-Landing Language Select & Direct Header Picker (`v2.5.0`)
- **Initial Landing Prompt**: Automatically presents the `LanguageSelectModal` immediately upon first site arrival if no language choice is saved in `localStorage`.
- **Direct 1-Click Header Dropdown**: Added a visible `<select>` dropdown (`🌐 English ▾` / `🌐 हिन्दी ▾`) in `Navbar.jsx` with all 22 official Indian languages, enabling 1-click language changes without opening a popup modal.
- **Centralized Language Registry**: Created `src/i18n/languages.js` exporting the official list of 22 Indian languages and native script names, shared between `LanguageContext`, `Navbar`, and `LanguageSelectModal`.

### About Us Tab Details (`AboutUsTab.jsx`)
- Displays the current **version** (`v2.5.0`) and **release label** (`SIH 2026 Edition`).
- Shows **4 Core Tech Pillars** (Document Intelligence, GIS Mapping, Blockchain Security, Mobile-First Design) with icons and descriptions.
- Contains a **dynamic Changelog** with 7 entries documenting feature additions.
- **⚠️ IMPORTANT**: When adding new features to the app, update the `CHANGELOG` array and bump `VERSION` in `AboutUsTab.jsx`.

---

## Technical Architecture (React)

| File | Role |
|------|------|
| `src/App.jsx` | Global routing. Manages transition between Auth (`Login`) and Dashboard (`Website`). Contains `devMode` logic. |
| `src/login.jsx` | Auth views: `login`, `register`, `otp`, `aadhaar_kyc`. Handles security (lockout, strength meter). |
| `src/website.jsx` | Main dashboard shell. Manages `profileData` state, passes it to drawer components. Contains `devMode` toggle. |
| `src/components/Navbar.jsx` | Top navigation bar. Shows notification bell (auth) or About button (guest). Opens the drawer. |
| `src/components/drawer/MenuDrawer.jsx` | Drawer container. Renders tab navigation and the correct tab content based on `activeTab`. |
| `src/components/drawer/ProfileTab.jsx` | Profile form + Aadhaar e-KYC verification. Uses `MOCK_AADHAAR_DATABASE`. |
| `src/components/drawer/AboutUsTab.jsx` | Project info, tech pillars, version, changelog. |
| `src/components/drawer/NotificationsTab.jsx` | Notification list with mark-all-read. |
| `src/components/drawer/SettingsTab.jsx` | App settings and profile update options. |
| `src/components/drawer/HelpCenterTab.jsx` | FAQ and support content. |
| `src/i18n/` | Internationalization. `LanguageContext.jsx` + translation files for 15+ Indian languages. |

---

## Current State & Next Steps
- **Demo Mode**: Real APIs are not connected yet. All data is mocked (Aadhaar, notifications, user profiles).
- **Vite Server**: Run with `npm run dev`. If it crashes due to file watching errors on OneDrive-synced `package-lock.json`, just restart it.
- **No Vercel Deployment Yet**: The user has explicitly stated to NOT deploy to Vercel until real backend APIs are connected.

---

*This file was generated to provide context for future AI assistants continuing work on this repository.*
