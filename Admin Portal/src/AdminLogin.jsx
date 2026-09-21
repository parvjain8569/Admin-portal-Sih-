import { useState, useEffect, useRef } from 'react'

// Demo admin credentials
const ADMIN_EMAIL = 'admin@bhoomintelli.in'
const ADMIN_PASSWORD = 'Admin@123'

export default function AdminLogin({ onLoginSuccess, devMode }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // ── 3-Attempt Lockout ──
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [isLockedOut, setIsLockedOut] = useState(false)
  const [lockoutSeconds, setLockoutSeconds] = useState(0)
  const lockoutTimer = useRef(null)

  // ── DevMode Auto-fill ──
  useEffect(() => {
    const handleDevMode = () => {
      const isDev = localStorage.getItem('adminDevMode') === 'true'
      if (isDev) {
        setEmail(ADMIN_EMAIL)
        setPassword(ADMIN_PASSWORD)
      }
    }
    handleDevMode()
    window.addEventListener('adminDevModeChange', handleDevMode)
    return () => window.removeEventListener('adminDevModeChange', handleDevMode)
  }, [])

  // ── Lockout Countdown ──
  useEffect(() => {
    if (isLockedOut && lockoutSeconds > 0) {
      lockoutTimer.current = setTimeout(() => {
        setLockoutSeconds(s => s - 1)
      }, 1000)
    }
    if (isLockedOut && lockoutSeconds === 0) {
      setIsLockedOut(false)
      setFailedAttempts(0)
      setError('')
    }
    return () => clearTimeout(lockoutTimer.current)
  }, [isLockedOut, lockoutSeconds])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (isLockedOut) return

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.')
      return
    }

    setLoading(true)

    // Simulate network delay
    setTimeout(() => {
      setLoading(false)

      const normalizedEmail = email.trim().toLowerCase()
      const normalizedPassword = password.trim()

      if (normalizedEmail === ADMIN_EMAIL.toLowerCase() && normalizedPassword === ADMIN_PASSWORD) {
        // Success!
        onLoginSuccess({
          name: 'Admin',
          email: ADMIN_EMAIL,
          role: 'Super Admin',
          phone: '+91 98765 43210',
          department: 'Land Records Division',
          joinDate: '15 Jan 2025',
        })
      } else {
        // Failed
        const newAttempts = failedAttempts + 1
        setFailedAttempts(newAttempts)

        if (newAttempts >= 3) {
          setIsLockedOut(true)
          setLockoutSeconds(30)
          setError('')
        } else {
          setError(`Invalid credentials. ${3 - newAttempts} attempt${3 - newAttempts === 1 ? '' : 's'} remaining.`)
        }
      }
    }, 600)
  }

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">

        {/* ── Back to main website link ── */}
        <button
          className="admin-back-link"
          onClick={() => window.open('http://localhost:5173', '_blank')}
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to main website
        </button>

        {/* ── Header with Logo ── */}
        <div className="admin-login-header">
          <div className="admin-login-badge">
            <img src="/bhoomintelli-icon.png" alt="BhoomiIntelli" />
          </div>
          <div className="admin-login-badge-text">
            <h1 className="admin-login-title">Admin Portal</h1>
            <p className="admin-login-subtitle">BhoomiIntelli Management</p>
          </div>
        </div>

        <p className="admin-login-desc">
          Sign in with your administrator credentials to access the management dashboard.
        </p>

        {/* ── Lockout Warning ── */}
        {isLockedOut && (
          <div className="admin-lockout-bar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Account locked. Try again in <strong style={{ margin: '0 4px' }}>{lockoutSeconds}s</strong>
          </div>
        )}

        {/* ── Error Alert ── */}
        {error && !isLockedOut && (
          <div className="admin-alert admin-alert-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            {error}
          </div>
        )}

        {/* ── Login Form ── */}
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-label" htmlFor="admin-email">Email Address</label>
            <input
              id="admin-email"
              className="admin-input"
              type="email"
              placeholder="admin@bhoomintelli.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLockedOut}
              autoComplete="email"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label" htmlFor="admin-password">Password</label>
            <div className="admin-input-wrap">
              <input
                id="admin-password"
                className="admin-input admin-input-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLockedOut}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="admin-pwd-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="admin-btn-primary"
            disabled={isLockedOut || loading}
          >
            {loading ? (
              <>
                <span className="admin-spinner" />
                Signing in…
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                Sign In
              </>
            )}
          </button>
        </form>

        {/* ── Footer ── */}
        <div className="admin-login-footer">
          <p className="admin-login-footer-text" style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
            <span>Demo credentials: <strong>admin@bhoomintelli.in</strong> / <strong>Admin@123</strong></span>
            <button
              type="button"
              className="admin-autofill-btn"
              onClick={() => {
                setEmail(ADMIN_EMAIL)
                setPassword(ADMIN_PASSWORD)
                setError('')
                setIsLockedOut(false)
                setFailedAttempts(0)
              }}
              style={{
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                color: '#15803d',
                padding: '5px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                marginTop: '4px'
              }}
            >
              ⚡ Tap to Auto-Fill Credentials
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
