import { useState } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'

// SettingsTab handles: Change Email / Phone / Password, each with 3-step OTP verification
export default function SettingsTab({ profileData, onProfileUpdate }) {
  const { t } = useLanguage()
  const [subTab, setSubTab] = useState('email') // 'email' | 'phone' | 'password'
  const [step, setStep] = useState(1)           // 1: input, 2: verify OTP, 3: success

  const [newEmail, setNewEmail]         = useState('')
  const [newPhone, setNewPhone]         = useState('')
  const [currentPass, setCurrentPass]   = useState('')
  const [newPass, setNewPass]           = useState('')
  const [otpTarget, setOtpTarget]       = useState('')
  const [otpValue, setOtpValue]         = useState(['', '', '', '', '', ''])
  const [errorMsg, setErrorMsg]         = useState('')
  const [successMsg, setSuccessMsg]     = useState('')

  const resetForm = () => {
    setStep(1)
    setNewEmail('')
    setNewPhone('')
    setCurrentPass('')
    setNewPass('')
    setErrorMsg('')
    setSuccessMsg('')
    setOtpValue(['', '', '', '', '', ''])
  }

  const switchSubTab = (tab) => {
    setSubTab(tab)
    resetForm()
  }

  const handleSendOtp = () => {
    setErrorMsg('')
    setSuccessMsg('')

    if (subTab === 'email') {
      if (!newEmail || !newEmail.includes('@')) {
        setErrorMsg(t('settings.invalidEmail'))
        return
      }
      setOtpTarget(newEmail)
    } else if (subTab === 'phone') {
      if (!newPhone || newPhone.length < 10) {
        setErrorMsg(t('settings.invalidPhone'))
        return
      }
      setOtpTarget(newPhone)
    } else if (subTab === 'password') {
      if (!currentPass || !newPass) {
        setErrorMsg(t('settings.missingPassword'))
        return
      }
      if (newPass.length < 6) {
        setErrorMsg(t('settings.shortPassword'))
        return
      }
      setOtpTarget(profileData.email)
    }

    setStep(2)
    setOtpValue(['', '', '', '', '', ''])
  }

  const handleVerifyOtp = () => {
    const fullOtp = otpValue.join('')
    if (fullOtp.length < 6) {
      setErrorMsg(t('settings.invalidOtp'))
      return
    }

    // Apply the update and notify parent
    if (subTab === 'email') {
      onProfileUpdate({ email: otpTarget })
      setSuccessMsg(t('settings.emailUpdated').replace('{email}', otpTarget))
    } else if (subTab === 'phone') {
      onProfileUpdate({ contact: otpTarget })
      setSuccessMsg(t('settings.phoneUpdated').replace('{phone}', otpTarget))
    } else if (subTab === 'password') {
      setSuccessMsg(t('settings.passwordUpdated'))
    }

    setStep(3)
  }

  return (
    <div>
      {/* Sub-tab Navigation with realistic SVGs */}
      <div className="settings-subtabs">
        <button
          className={`settings-subtab-btn ${subTab === 'email' ? 'active' : ''}`}
          onClick={() => switchSubTab('email')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          <span>{t('settings.changeEmail')}</span>
        </button>

        <button
          className={`settings-subtab-btn ${subTab === 'phone' ? 'active' : ''}`}
          onClick={() => switchSubTab('phone')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
            <path d="M12 18h.01" />
          </svg>
          <span>{t('settings.changeNumber')}</span>
        </button>

        <button
          className={`settings-subtab-btn ${subTab === 'password' ? 'active' : ''}`}
          onClick={() => switchSubTab('password')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="7.5" cy="15.5" r="5.5" />
            <path d="M12 11l8-8" />
            <path d="M17 3l4 4" />
            <path d="M14 6l2 2" />
          </svg>
          <span>{t('settings.changePassword')}</span>
        </button>
      </div>

      <div className="settings-card">
        {/* Error / Success Alerts */}
        {errorMsg && (
          <div className="auth-alert auth-alert-error" style={{ marginBottom: '16px' }}>
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="auth-alert auth-alert-success" style={{ marginBottom: '16px' }}>
            {successMsg}
          </div>
        )}

        {/* STEP 1: Input Form */}
        {step === 1 && (
          <div>
            {subTab === 'email' && (
              <div className="settings-form-group">
                <label className="settings-label">{t('settings.currentEmail')}</label>
                <input
                  type="text"
                  disabled
                  className="profile-input"
                  value={profileData.email}
                  style={{ backgroundColor: '#f1f5f9' }}
                />
                <label className="settings-label" style={{ marginTop: '14px' }}>
                  {t('settings.newEmail')}
                </label>
                <input
                  type="email"
                  className="profile-input"
                  placeholder={t('settings.newEmailPlaceholder')}
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
                <button
                  className="btn-upload-primary"
                  style={{ marginTop: '18px' }}
                  onClick={handleSendOtp}
                >
                  {t('settings.sendEmailOtp')}
                </button>
              </div>
            )}

            {subTab === 'phone' && (
              <div className="settings-form-group">
                <label className="settings-label">{t('settings.currentMobile')}</label>
                <input
                  type="text"
                  disabled
                  className="profile-input"
                  value={profileData.contact}
                  style={{ backgroundColor: '#f1f5f9' }}
                />
                <label className="settings-label" style={{ marginTop: '14px' }}>
                  {t('settings.newMobile')}
                </label>
                <input
                  type="tel"
                  className="profile-input"
                  placeholder={t('settings.newMobilePlaceholder')}
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                />
                <button
                  className="btn-upload-primary"
                  style={{ marginTop: '18px' }}
                  onClick={handleSendOtp}
                >
                  {t('settings.sendSmsOtp')}
                </button>
              </div>
            )}

            {subTab === 'password' && (
              <div className="settings-form-group">
                <label className="settings-label">{t('settings.currentPass')}</label>
                <input
                  type="password"
                  className="profile-input"
                  placeholder={t('settings.currentPassPlaceholder')}
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                />
                <label className="settings-label" style={{ marginTop: '14px' }}>
                  {t('settings.newPass')}
                </label>
                <input
                  type="password"
                  className="profile-input"
                  placeholder={t('settings.newPassPlaceholder')}
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                />
                <button
                  className="btn-upload-primary"
                  style={{ marginTop: '18px' }}
                  onClick={handleSendOtp}
                >
                  {t('settings.sendPassOtp')}
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: OTP Verification */}
        {step === 2 && (
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#111827' }}>
              {t('settings.enterOtpTitle')}
            </h4>
            <p style={{ margin: 0, fontSize: '13.5px', color: '#64748b' }}>
              {t('settings.otpSentTo')} <strong>{otpTarget}</strong>
            </p>

            <div className="demo-otp-pill">
              💡 {t('settings.demoOtpInfo')}: <strong>482910</strong>
            </div>

            <div className="otp-box-row">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <input
                  key={idx}
                  id={`settings-otp-${idx}`}
                  type="text"
                  maxLength={1}
                  className="otp-digit-input"
                  value={otpValue[idx]}
                  onChange={(e) => {
                    const val = e.target.value.slice(-1)
                    const next = [...otpValue]
                    next[idx] = val
                    setOtpValue(next)
                    if (val && idx < 5) {
                      document.getElementById(`settings-otp-${idx + 1}`)?.focus()
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !otpValue[idx] && idx > 0) {
                      document.getElementById(`settings-otp-${idx - 1}`)?.focus()
                    }
                  }}
                />
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn-how-it-works-downward" onClick={() => setStep(1)}>
                {t('settings.back')}
              </button>
              <button className="btn-upload-primary" onClick={handleVerifyOtp}>
                {t('settings.verifyUpdate')}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Success Confirmation */}
        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#ecfdf5',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h4 style={{ fontSize: '18px', margin: '0 0 8px 0', color: '#15803d', fontWeight: 800 }}>
              {t('settings.successTitle')}
            </h4>
            <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '20px' }}>
              {t('settings.successDesc')}
            </p>
            <button className="btn-upload-primary" onClick={resetForm}>
              {t('settings.updateAnother')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
