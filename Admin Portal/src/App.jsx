import { useState, useEffect } from 'react'
import AdminLogin from './AdminLogin.jsx'
import AdminDashboard from './AdminDashboard.jsx'
import './admin.css'

export default function App() {
  // ── Dev Mode Admin Data ──
  const getDevAdmin = () => ({
    name: 'Admin Dev',
    email: 'admin@bhoomintelli.in',
    role: 'Super Admin',
    phone: '+91 98765 43210',
    department: 'Land Records Division',
    joinDate: '15 Jan 2025',
  })

  // ── Auth State (persisted in localStorage) ──
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('adminUser')
      if (saved) return JSON.parse(saved)
    } catch { /* ignore */ }
    // Auto-login if dev mode was on
    if (localStorage.getItem('adminDevMode') === 'true') return getDevAdmin()
    return null
  })

  // ── Dev Mode Toggle ──
  const [devMode, setDevMode] = useState(
    () => localStorage.getItem('adminDevMode') === 'true'
  )

  const toggleDevMode = () => {
    const next = !devMode
    setDevMode(next)
    localStorage.setItem('adminDevMode', String(next))
    window.dispatchEvent(new Event('adminDevModeChange'))

    if (next) {
      handleLoginSuccess(getDevAdmin())
    } else {
      handleLogout()
    }
  }

  // ── Auth Handlers ──
  const handleLoginSuccess = (userData) => {
    setAdminUser(userData)
    localStorage.setItem('adminUser', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setAdminUser(null)
    localStorage.removeItem('adminUser')
    if (devMode) {
      setDevMode(false)
      localStorage.setItem('adminDevMode', 'false')
      window.dispatchEvent(new Event('adminDevModeChange'))
    }
  }

  const isLoggedIn = adminUser !== null

  return (
    <>
      {isLoggedIn ? (
        <AdminDashboard
          user={adminUser}
          onLogout={handleLogout}
        />
      ) : (
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          devMode={devMode}
        />
      )}

      {/* ── Global Dev Mode Toggle Button (same UX as main site) ── */}
      <button
        className={`admin-dev-toggle ${devMode ? 'on' : 'off'}`}
        onClick={toggleDevMode}
        title={devMode ? 'Dev Mode: ON — Click to disable' : 'Dev Mode: OFF — Click to enable'}
      >
        {devMode ? '✓' : '⚙'}
      </button>
    </>
  )
}
