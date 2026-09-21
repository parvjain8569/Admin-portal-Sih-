import { useState, useEffect, useRef } from 'react'
import './login.css'
import { extractCleanUsername, formatDisplayName } from './utils/userUtils'
import { useLanguage } from './i18n/LanguageContext'
import { generateMockAadhaarData } from './utils/userUtils'

export default function Login({ onLoginSuccess, onBackToWebsite, initialView = 'create' }) {
  // Views: 'create' | 'otp' | 'aadhaar_kyc' | 'signin' | 'forgot_email' | 'forgot_otp' | 'forgot_reset'
  const [view, setView] = useState(initialView)
  const { t } = useLanguage()

  // Registration & Sign-in form state
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
  })

  // Registration 6-digit OTP state
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', ''])
  const [generatedOtp] = useState('482910') // Demo helper code

  // DevMode Autofill Effect
  useEffect(() => {
    const handleDevMode = () => {
      const isDev = localStorage.getItem('devMode') === 'true'
      if (isDev) {
        setFormData(prev => ({
          ...prev,
          name: 'Dev User',
          surname: 'Tester',
          email: 'dev@bhoomintelli.in',
          password: 'Password123!'
        }))
        setOtpDigits(['4', '8', '2', '9', '1', '0'])
        setAadhaarInput('2345 6789 1234')
      }
    }
    handleDevMode() // check on mount
    window.addEventListener('devModeChange', handleDevMode)
    return () => window.removeEventListener('devModeChange', handleDevMode)
  }, [])

  // Forgot Password state
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotOtpDigits, setForgotOtpDigits] = useState(['', '', '', '', '', ''])
  const [demoForgotOtp] = useState('629140')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // ── Security: Password Strength ──────────────────────────────────
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: '#e2e8f0' }
    let score = 0
    if (pwd.length >= 6) score++
    if (pwd.length >= 10) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++
    if (score <= 1) return { score: 1, label: 'Weak', color: '#ef4444' }
    if (score === 2) return { score: 2, label: 'Fair', color: '#f97316' }
    if (score === 3) return { score: 3, label: 'Good', color: '#eab308' }
    return { score: Math.min(score, 4), label: 'Strong', color: '#22c55e' }
  }
  const pwdStrength = getPasswordStrength(formData.password)

  // ── Security: 3-Attempt Account Lockout ──────────────────────────
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [isLockedOut, setIsLockedOut] = useState(false)
  const [lockoutSeconds, setLockoutSeconds] = useState(0)
  const lockoutTimerRef = useRef(null)

  useEffect(() => {
    if (isLockedOut && lockoutSeconds > 0) {
      lockoutTimerRef.current = setTimeout(() => {
        setLockoutSeconds((s) => s - 1)
      }, 1000)
    }
    if (isLockedOut && lockoutSeconds === 0) {
      setIsLockedOut(false)
      setFailedAttempts(0)
      setError('')
    }
    return () => clearTimeout(lockoutTimerRef.current)
  }, [isLockedOut, lockoutSeconds])

  // ── Aadhaar KYC state ────────────────────────────────────────────
  const [aadhaarInput, setAadhaarInput] = useState('')
  const [aadhaarVerifying, setAadhaarVerifying] = useState(false)
  const [aadhaarVerifiedData, setAadhaarVerifiedData] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (error) setError('')
  }

  // Handle "Create Account" submission -> Leads to OTP page
  const handleCreateAccount = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const { name, surname, email, password } = formData

    if (!name.trim() || !surname.trim() || !email.trim() || !password) {
      setError('Please fill in all fields.')
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    // Move to OTP verification step
    setSuccess(`Verification code sent to ${email}`)
    setView('otp')
  }

  // Handle OTP verification -> Leads to "Sign In"
  const handleVerifyOtp = (e) => {
    e.preventDefault()
    setError('')

    const enteredOtp = otpDigits.join('')
    if (enteredOtp.length < 6) {
      setError('Please enter the complete 6-digit OTP code.')
      return
    }

    // Accept mock OTP or any 6 digits for testing → go to Aadhaar KYC step
    setSuccess('Email verified! Complete Aadhaar verification or skip to continue.')
    setError('')
    setView('aadhaar_kyc')
  }

  // Handle Aadhaar KYC verification (mock)
  const handleAadhaarVerify = () => {
    const cleaned = aadhaarInput.replace(/\s/g, '')
    if (cleaned.length !== 12 || !/^\d+$/.test(cleaned)) {
      setError('Please enter a valid 12-digit Aadhaar number.')
      return
    }
    setError('')
    setAadhaarVerifying(true)
    // Simulate verification delay
    setTimeout(() => {
      setAadhaarVerifying(false)
      setAadhaarVerifiedData(generateMockAadhaarData(cleaned))
      setSuccess('Aadhaar verified successfully! You can now sign in.')
      setView('signin')
    }, 2000)
  }

  const handleSkipAadhaar = () => {
    setSuccess('You can verify your Aadhaar later from your Profile. Please sign in.')
    setError('')
    setView('signin')
  }

  // Handle "Sign In" submission -> Leads back to main website as authenticated user
  const handleSignIn = (e) => {
    e.preventDefault()
    setError('')

    if (isLockedOut) return

    const { email, password } = formData

    if (!email.trim() || !password) {
      setError('Please enter both email address and password.')
      return
    }

    // Demo: simulate wrong password if password is literally 'wrong'
    if (password === 'wrong') {
      const newFails = failedAttempts + 1
      setFailedAttempts(newFails)
      if (newFails >= 3) {
        setIsLockedOut(true)
        setLockoutSeconds(30)
        setError('Account locked due to too many failed attempts. Try again in 30 seconds.')
      } else {
        setError(`Invalid credentials. ${3 - newFails} attempt(s) remaining.`)
      }
      return
    }

    if (onLoginSuccess) {
      const emailTrimmed = email.trim()
      const username = extractCleanUsername(emailTrimmed)
      const uName = formData.name || formatDisplayName(username)
      
      const payload = {
        name: uName,
        username: username,
        email: emailTrimmed,
        aadhaarVerified: !!aadhaarVerifiedData,
        aadhaarDetails: aadhaarVerifiedData
      }
      onLoginSuccess(payload)
    }
  }

  // Handle Forgot Password - Send OTP to Email
  const handleSendForgotOtp = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setError('Please enter a valid registered email address.')
      return
    }

    setSuccess(`Password reset code sent to ${forgotEmail.trim()}`)
    setForgotOtpDigits(['', '', '', '', '', ''])
    setView('forgot_otp')
  }

  // Handle Forgot Password - Verify OTP
  const handleVerifyForgotOtp = (e) => {
    e.preventDefault()
    setError('')

    const entered = forgotOtpDigits.join('')
    if (entered.length < 6) {
      setError('Please enter the 6-digit verification code.')
      return
    }

    setSuccess('OTP verified successfully! Please create your new password.')
    setNewPassword('')
    setConfirmPassword('')
    setView('forgot_reset')
  }

  // Handle Forgot Password - Save New Password
  const handleResetPassword = (e) => {
    e.preventDefault()
    setError('')

    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.')
      return
    }

    // Password reset successful -> populate email for sign-in and direct back to signin view
    setFormData((prev) => ({
      ...prev,
      email: forgotEmail.trim(),
      password: '',
    }))
    setSuccess('Password updated successfully! You can now sign in with your new password.')
    setError('')
    setView('signin')
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Back to main website link */}
        {onBackToWebsite && (
          <button type="button" className="auth-back-link" onClick={onBackToWebsite}>
            {t('login.backToWebsiteLink')}
          </button>
        )}

        {/* Project Official Brand Logo */}
        <div className="auth-card-logo-wrap">
          <img src="/bhoomintelli-icon.png" alt="BhoomIntelli Icon" className="auth-brand-icon" />
          <img src="/bhoomintelli-wordmark.png" alt="BhoomIntelli" className="auth-brand-wordmark" />
        </div>

        {/* ============================================================
            VIEW 1: CREATE AN ACCOUNT (No confirm password!)
            ============================================================ */}
        {view === 'create' && (
          <div>
            <h1 className="auth-title">{t('login.createAccountTitle')}</h1>
            <p className="auth-subtitle">{t('login.createAccountSubtitle')}</p>

            {error && <div className="auth-alert auth-alert-error">{error}</div>}
            {success && <div className="auth-alert auth-alert-success">{success}</div>}

            <form className="auth-form" onSubmit={handleCreateAccount}>
              <div className="auth-form-group">
                <label className="auth-label" htmlFor="name">
                  {t('login.nameLabel')}
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  className="auth-input"
                  placeholder={t('login.namePlaceholder')}
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="given-name"
                  required
                />
              </div>

              <div className="auth-form-group">
                <label className="auth-label" htmlFor="surname">
                  {t('login.surnameLabel')}
                </label>
                <input
                  id="surname"
                  type="text"
                  name="surname"
                  className="auth-input"
                  placeholder={t('login.surnamePlaceholder')}
                  value={formData.surname}
                  onChange={handleChange}
                  autoComplete="family-name"
                  required
                />
              </div>

              <div className="auth-form-group">
                <label className="auth-label" htmlFor="email">
                  {t('login.emailLabel')}
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="auth-input"
                  placeholder={t('login.emailPlaceholder')}
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>

              {/* PASSWORD + STRENGTH METER */}
              <div className="auth-form-group">
                <label className="auth-label" htmlFor="password">
                  {t('login.passwordLabel')}
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  className="auth-input"
                  placeholder={t('login.passwordPlaceholder')}
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
                {formData.password && (
                  <div className="pwd-strength-wrap">
                    <div className="pwd-strength-bar">
                      <div
                        className="pwd-strength-fill"
                        style={{
                          width: `${(pwdStrength.score / 4) * 100}%`,
                          backgroundColor: pwdStrength.color,
                        }}
                      />
                    </div>
                    <span className="pwd-strength-label" style={{ color: pwdStrength.color }}>
                      {pwdStrength.label}
                    </span>
                  </div>
                )}
              </div>

              <button type="submit" className="auth-btn-primary">
                {t('login.createAccountBtn')}
              </button>
            </form>

            <div className="auth-footer">
              {t('login.alreadyHaveAccount')}{' '}
              <button
                type="button"
                className="auth-link"
                onClick={() => {
                  setError('')
                  setSuccess('')
                  setView('signin')
                }}
              >
                {t('login.logInLink')}
              </button>
            </div>
          </div>
        )}

        {/* ============================================================
            VIEW 2: REGISTRATION EMAIL OTP VERIFICATION
            ============================================================ */}
        {view === 'otp' && (
          <div>
            <div className="auth-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>

            <h1 className="auth-title">{t('login.verifyEmailTitle')}</h1>
            <p className="auth-subtitle">
              {t('login.verifyEmailSubtitle1')}{' '}
              <strong style={{ color: '#0f172a' }}>{formData.email || 'your email'}</strong>.
            </p>

            {error && <div className="auth-alert auth-alert-error">{error}</div>}
            {success && <div className="auth-alert auth-alert-success">{success}</div>}

            <div className="auth-demo-otp-pill">
              {t('login.demoVerifyOtp')} <strong>{generatedOtp}</strong>
            </div>

            <form onSubmit={handleVerifyOtp}>
              <div className="auth-otp-row">
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                  <input
                    key={idx}
                    id={`auth-otp-${idx}`}
                    type="text"
                    maxLength={1}
                    className="auth-otp-input"
                    value={otpDigits[idx]}
                    onChange={(e) => {
                      const val = e.target.value.slice(-1)
                      const newArr = [...otpDigits]
                      newArr[idx] = val
                      setOtpDigits(newArr)
                      if (val && idx < 5) {
                        document.getElementById(`auth-otp-${idx + 1}`)?.focus()
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
                        document.getElementById(`auth-otp-${idx - 1}`)?.focus()
                      }
                    }}
                    required
                  />
                ))}
              </div>

              <button type="submit" className="auth-btn-primary">
                {t('login.verifyOtpBtn')}
              </button>
            </form>

            <div className="auth-footer">
              {t('login.didntReceiveCode')}{' '}
              <button
                type="button"
                className="auth-link"
                onClick={() => setSuccess(`New OTP code sent to ${formData.email}`)}
              >
                {t('login.resendOtp')}
              </button>
              <br />
              <button
                type="button"
                className="auth-link"
                style={{ marginTop: '8px', display: 'inline-block' }}
                onClick={() => setView('create')}
              >
                {t('login.editEmailLink')}
              </button>
            </div>
          </div>
        )}

        {/* ============================================================
            VIEW 3: SIGN IN SCREEN WITH FORGOT PASSWORD LINK
            ============================================================ */}
        {/* ============================================================
            VIEW: AADHAAR KYC (after OTP, before signin)
            ============================================================ */}
        {view === 'aadhaar_kyc' && (
          <div>
            <div className="auth-badge" aria-label="Aadhaar Badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>

            <h1 className="auth-title">Aadhaar e-KYC Verification</h1>
            <p className="auth-subtitle">
              Link your Aadhaar to verify your identity. This helps secure your land records.
            </p>

            {error && <div className="auth-alert auth-alert-error">{error}</div>}
            {success && <div className="auth-alert auth-alert-success">{success}</div>}

            <div className="auth-form">
              <div className="auth-form-group">
                <label className="auth-label" htmlFor="aadhaar-input">
                  Aadhaar Number (12 digits)
                </label>
                <input
                  id="aadhaar-input"
                  type="text"
                  className="auth-input"
                  placeholder="XXXX XXXX XXXX"
                  maxLength={14}
                  value={aadhaarInput}
                  onChange={(e) => {
                    // Auto-format with spaces
                    const raw = e.target.value.replace(/\D/g, '').slice(0, 12)
                    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ')
                    setAadhaarInput(formatted)
                    if (error) setError('')
                  }}
                  disabled={aadhaarVerifying}
                />
              </div>

              <button
                type="button"
                className="auth-btn-primary"
                onClick={handleAadhaarVerify}
                disabled={aadhaarVerifying}
                style={{ position: 'relative' }}
              >
                {aadhaarVerifying ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span className="auth-spinner" /> Verifying with UIDAI...
                  </span>
                ) : (
                  'Verify Aadhaar'
                )}
              </button>

              <button
                type="button"
                className="auth-btn-secondary"
                onClick={handleSkipAadhaar}
                disabled={aadhaarVerifying}
                style={{ marginTop: '10px' }}
              >
                Skip for Now →
              </button>
            </div>

            <div className="auth-footer" style={{ marginTop: '16px', fontSize: '12px', color: '#94a3b8' }}>
              You can complete Aadhaar verification later from your Profile settings.
            </div>
          </div>
        )}

        {/* ============================================================
            VIEW 3: SIGN IN SCREEN WITH FORGOT PASSWORD LINK
            ============================================================ */}
        {view === 'signin' && (
          <div>
            <h1 className="auth-title">{t('login.signInTitle')}</h1>
            <p className="auth-subtitle" dangerouslySetInnerHTML={{ __html: t('login.signInSubtitle') }} />

            {error && <div className="auth-alert auth-alert-error">{error}</div>}
            {success && <div className="auth-alert auth-alert-success">{success}</div>}
            {isLockedOut && (
              <div className="auth-lockout-bar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                <span>Account locked. Try again in <strong>{lockoutSeconds}s</strong></span>
              </div>
            )}

            <form className="auth-form" onSubmit={handleSignIn}>
              <div className="auth-form-group">
                <label className="auth-label" htmlFor="signin-email">
                  {t('login.emailLabel')}
                </label>
                <input
                  id="signin-email"
                  type="email"
                  name="email"
                  className="auth-input"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('login.emailPlaceholder')}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="auth-form-group">
                <div className="auth-label-row">
                  <label className="auth-label" htmlFor="signin-password">
                    {t('login.passwordLabel')}
                  </label>
                  <button
                    type="button"
                    className="auth-link-subtle"
                    onClick={() => {
                      setError('')
                      setSuccess('')
                      setForgotEmail(formData.email || '')
                      setView('forgot_email')
                    }}
                  >
                    {t('login.forgotPasswordLink')}
                  </button>
                </div>
                <input
                  id="signin-password"
                  type="password"
                  name="password"
                  className="auth-input"
                  placeholder={t('login.signInPasswordPlaceholder')}
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
              </div>

              <button type="submit" className="auth-btn-primary" disabled={isLockedOut}>
                {isLockedOut ? `Locked (${lockoutSeconds}s)` : t('login.signInBtn')}
              </button>
            </form>

            <div className="auth-footer">
              {t('login.needAccount')}{' '}
              <button
                type="button"
                className="auth-link"
                onClick={() => {
                  setError('')
                  setSuccess('')
                  setView('create')
                }}
              >
                {t('login.createNewAccountLink')}
              </button>
            </div>
          </div>
        )}

        {/* ============================================================
            VIEW 4: FORGOT PASSWORD - STEP 1: ENTER EMAIL
            ============================================================ */}
        {view === 'forgot_email' && (
          <div>
            <div className="auth-badge" aria-label="Forgot Password Badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>

            <h1 className="auth-title">{t('login.resetPasswordTitle')}</h1>
            <p className="auth-subtitle">
              {t('login.resetPasswordSubtitle')}
            </p>

            {error && <div className="auth-alert auth-alert-error">{error}</div>}
            {success && <div className="auth-alert auth-alert-success">{success}</div>}

            <form className="auth-form" onSubmit={handleSendForgotOtp}>
              <div className="auth-form-group">
                <label className="auth-label" htmlFor="forgot-email">
                  {t('login.registeredEmailLabel')}
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  className="auth-input"
                  placeholder={t('login.emailPlaceholder')}
                  value={forgotEmail}
                  onChange={(e) => {
                    setForgotEmail(e.target.value)
                    if (error) setError('')
                  }}
                  autoComplete="email"
                  required
                />
              </div>

              <button type="submit" className="auth-btn-primary">
                {t('login.sendResetOtpBtn')}
              </button>
            </form>

            <div className="auth-footer">
              {t('login.rememberPassword')}{' '}
              <button
                type="button"
                className="auth-link"
                onClick={() => {
                  setError('')
                  setSuccess('')
                  setView('signin')
                }}
              >
                {t('login.backToSignInLink')}
              </button>
            </div>
          </div>
        )}

        {/* ============================================================
            VIEW 5: FORGOT PASSWORD - STEP 2: ENTER OTP
            ============================================================ */}
        {view === 'forgot_otp' && (
          <div>
            <div className="auth-badge" aria-label="OTP Badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>

            <h1 className="auth-title">{t('login.verifyResetCodeTitle')}</h1>
            <p className="auth-subtitle">
              {t('login.verifyResetCodeSubtitle1')}{' '}
              <strong style={{ color: '#0f172a' }}>{forgotEmail}</strong>.
            </p>

            {error && <div className="auth-alert auth-alert-error">{error}</div>}
            {success && <div className="auth-alert auth-alert-success">{success}</div>}

            <div className="auth-demo-otp-pill">
              {t('login.demoResetOtp')} <strong>{demoForgotOtp}</strong>
            </div>

            <form onSubmit={handleVerifyForgotOtp}>
              <div className="auth-otp-row">
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                  <input
                    key={idx}
                    id={`forgot-otp-${idx}`}
                    type="text"
                    maxLength={1}
                    className="auth-otp-input"
                    value={forgotOtpDigits[idx]}
                    onChange={(e) => {
                      const val = e.target.value.slice(-1)
                      const newArr = [...forgotOtpDigits]
                      newArr[idx] = val
                      setForgotOtpDigits(newArr)
                      if (val && idx < 5) {
                        document.getElementById(`forgot-otp-${idx + 1}`)?.focus()
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !forgotOtpDigits[idx] && idx > 0) {
                        document.getElementById(`forgot-otp-${idx - 1}`)?.focus()
                      }
                    }}
                    required
                  />
                ))}
              </div>

              <button type="submit" className="auth-btn-primary">
                {t('login.verifyOtpProceedBtn')}
              </button>
            </form>

            <div className="auth-footer">
              {t('login.didntReceiveCode')}{' '}
              <button
                type="button"
                className="auth-link"
                onClick={() => setSuccess(`New reset OTP sent to ${forgotEmail}`)}
              >
                {t('login.resendOtp')}
              </button>
              <br />
              <button
                type="button"
                className="auth-link"
                style={{ marginTop: '8px', display: 'inline-block' }}
                onClick={() => {
                  setError('')
                  setSuccess('')
                  setView('forgot_email')
                }}
              >
                {t('login.changeEmailLink')}
              </button>
            </div>
          </div>
        )}

        {/* ============================================================
            VIEW 6: FORGOT PASSWORD - STEP 3: SET NEW PASSWORD
            ============================================================ */}
        {view === 'forgot_reset' && (
          <div>
            <div className="auth-badge" aria-label="Key Badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="7.5" cy="15.5" r="5.5" />
                <path d="M12 11l8-8" />
                <path d="M17 3l4 4" />
                <path d="M14 6l2 2" />
              </svg>
            </div>

            <h1 className="auth-title">{t('login.setNewPasswordTitle')}</h1>
            <p className="auth-subtitle">
              {t('login.setNewPasswordSubtitle1')}{' '}
              <strong style={{ color: '#0f172a' }}>{forgotEmail}</strong>.
            </p>

            {error && <div className="auth-alert auth-alert-error">{error}</div>}
            {success && <div className="auth-alert auth-alert-success">{success}</div>}

            <form className="auth-form" onSubmit={handleResetPassword}>
              <div className="auth-form-group">
                <label className="auth-label" htmlFor="new-password">
                  {t('login.newPasswordLabel')}
                </label>
                <input
                  id="new-password"
                  type="password"
                  className="auth-input"
                  placeholder={t('login.newPasswordPlaceholder')}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value)
                    if (error) setError('')
                  }}
                  autoComplete="new-password"
                  required
                />
              </div>

              <div className="auth-form-group">
                <label className="auth-label" htmlFor="confirm-password">
                  {t('login.confirmNewPasswordLabel')}
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  className="auth-input"
                  placeholder={t('login.confirmNewPasswordPlaceholder')}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (error) setError('')
                  }}
                  autoComplete="new-password"
                  required
                />
              </div>

              <button type="submit" className="auth-btn-primary">
                {t('login.changePasswordSignInBtn')}
              </button>
            </form>

            <div className="auth-footer">
              <button
                type="button"
                className="auth-link"
                onClick={() => {
                  setError('')
                  setSuccess('')
                  setView('signin')
                }}
              >
                {t('login.cancelReturnSignInLink')}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
