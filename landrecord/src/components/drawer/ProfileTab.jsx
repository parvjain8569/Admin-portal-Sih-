import { useState, useEffect } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import { generateMockAadhaarData } from '../../utils/userUtils'

// ProfileTab: Minimal, high-contrast landholder profile with integrated mobile OTP verification
// Modeled after clean real-world portals (WhatsApp / Flipkart / DigiLocker)
export default function ProfileTab({
  profileData,
  onProfileSave,
  verificationAlert = false
}) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: profileData.name || '',
    username: profileData.username || '',
    email: profileData.email || '',
    contact: profileData.contact || '',
    isPhoneVerified: !!profileData.isPhoneVerified,
    gender: profileData.gender || '',
    dob: profileData.dob || '',
    address: profileData.address || '',
    district: profileData.district || '',
    state: profileData.state || 'Haryana',
  })

  // OTP Verification state
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', ''])
  const [otpError, setOtpError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveProgress, setSaveProgress] = useState(0)

  // ── Aadhaar e-KYC state ───────────────────────────────────────


  const [isAadhaarVerified, setIsAadhaarVerified] = useState(false)
  const [aadhaarDetails, setAadhaarDetails] = useState(null)
  const [aadhaarInput, setAadhaarInput] = useState('')
  const [aadhaarVerifying, setAadhaarVerifying] = useState(false)
  const [aadhaarError, setAadhaarError] = useState('')

  // Sync from parent profileData if aadhaar was set during login
  useEffect(() => {
    if (profileData?.aadhaarVerified && profileData?.aadhaarDetails) {
      setIsAadhaarVerified(true)
      setAadhaarDetails(profileData.aadhaarDetails)
    }
  }, [profileData])

  const handleAadhaarVerify = () => {
    const cleaned = aadhaarInput.replace(/\s/g, '')
    if (cleaned.length !== 12 || !/^\d+$/.test(cleaned)) {
      setAadhaarError('Please enter a valid 12-digit Aadhaar number.')
      return
    }
    setAadhaarError('')
    setAadhaarVerifying(true)
    setTimeout(() => {
      const mockData = generateMockAadhaarData(cleaned)
      setAadhaarDetails(mockData)
      setIsAadhaarVerified(true)
      setAadhaarVerifying(false)
      
      const updatedFormData = {
        ...formData,
        name: mockData.name,
        dob: mockData.dob,
        gender: mockData.gender,
        address: mockData.address,
        district: mockData.district,
        state: mockData.state,
        contact: mockData.contact,
        isPhoneVerified: true, // Assuming aadhaar phone is verified
      }
      setFormData(updatedFormData)
      
      // Update parent state
      onProfileSave({
        ...updatedFormData,
        aadhaarVerified: true,
        aadhaarDetails: mockData,
      })
    }, 2000)
  }

  const handleResetAadhaar = () => {
    setIsAadhaarVerified(false)
    setAadhaarDetails(null)
    setAadhaarInput('')
    setAadhaarError('')
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (saveSuccess) setSaveSuccess('')
  }

  // Handle triggering Phone OTP
  const handleSendPhoneOtp = (e) => {
    e.preventDefault()
    setOtpError('')
    if (!formData.contact || formData.contact.replace(/\D/g, '').length < 10) {
      setOtpError(t('profile.invalidPhoneError'))
      return
    }
    setShowOtpInput(true)
  }

  // Handle confirming Phone OTP
  const handleVerifyPhoneOtp = (e) => {
    e.preventDefault()
    const entered = otpDigits.join('')
    if (entered.length < 6) {
      setOtpError(t('profile.invalidOtpError'))
      return
    }
    // Accept demo OTP or any 6 digits for testing
    setFormData((prev) => ({ ...prev, isPhoneVerified: true }))
    setShowOtpInput(false)
    setOtpError('')
    setSaveSuccess(t('profile.phoneVerifiedSuccess'))

    // Auto update parent state with verified phone
    onProfileSave({
      ...formData,
      isPhoneVerified: true,
      contact: formData.contact,
    })
  }

  // Handle saving full profile
  const handleSaveAll = (e) => {
    e.preventDefault()
    if (isSaving) return

    setIsSaving(true)
    setSaveProgress(0)
    setSaveSuccess('')

    // Animate progress bar from 0 → 100 over ~800ms
    let prog = 0
    const interval = setInterval(() => {
      prog += Math.random() * 18 + 8
      if (prog >= 100) {
        prog = 100
        clearInterval(interval)
        // Save and finish
        onProfileSave(formData)
        setSaveProgress(100)
        setIsSaving(false)
        setSaveSuccess(t('profile.profileSavedSuccess'))
        // Scroll drawer body to top
        const drawerBody = document.querySelector('.bhoomi-drawer-body')
        if (drawerBody) drawerBody.scrollTo({ top: 0, behavior: 'smooth' })
        setTimeout(() => setSaveSuccess(''), 4000)
      } else {
        setSaveProgress(prog)
      }
    }, 80)
  }

  return (
    <div className="profile-tab-clean">

      {/* Loading Bar */}
      {isSaving && (
        <div className="profile-loading-bar-wrapper">
          <div className="profile-loading-bar-fill" style={{ width: `${saveProgress}%` }} />
        </div>
      )}

      {/* Upload Gating Alert Banner */}
      {(!formData.isPhoneVerified || verificationAlert) && (
        <div className="profile-verification-alert">
          <div className="alert-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2.2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <div className="alert-title">{t('profile.verifyIdentityRequired')}</div>
            <div className="alert-sub">
              {t('profile.verifyIdentityDesc')}
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {saveSuccess && (
        <div className="profile-alert-success">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.4">
            <path d="m5 12 5 5L20 7" />
          </svg>
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="profile-header-card">
        <div className="profile-avatar-initial">
          {((formData.username || formData.name)?.[0] || 'U').toUpperCase()}
        </div>
        <div className="profile-header-meta">
          <h3 className="profile-display-name">{formData.name || t('profile.landholderAccount')}</h3>
          <div className="profile-handle-row">
            {formData.username && <span className="profile-handle">@{formData.username}</span>}
            <span className={`profile-status-badge ${formData.isPhoneVerified ? 'verified' : 'unverified'}`}>
              {formData.isPhoneVerified ? t('profile.verifiedAccount') : t('profile.verificationPending')}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveAll} className="profile-form-clean">

        {/* ── SECTION 1: Account & Verification ── */}
        <div className="profile-form-section">
          <h4 className="section-title">{t('profile.accountSecurity')}</h4>

          {/* Email (Derived from login, verified) */}
          <div className="form-field-group">
            <label className="field-label" htmlFor="prof-email">
              {t('profile.registeredEmail')}
            </label>
            <div className="input-with-badge">
              <input
                id="prof-email"
                type="email"
                className="clean-input disabled"
                value={formData.email}
                disabled
              />
              <span className="input-side-badge">✓ {t('profile.loginAccount')}</span>
            </div>
          </div>

          {/* Mobile Number & OTP Verification */}
          <div className="form-field-group">
            <label className="field-label" htmlFor="prof-contact">
              {t('profile.mobileNumber')}
            </label>
            <div className="phone-verify-row">
              <input
                id="prof-contact"
                type="tel"
                className={`clean-input ${formData.isPhoneVerified ? 'phone-verified' : ''}`}
                placeholder={t('profile.mobilePlaceholder')}
                value={formData.contact}
                onChange={(e) => handleInputChange('contact', e.target.value.replace(/\D/g, '').slice(0, 10))}
                maxLength={10}
                required
              />

              {!formData.isPhoneVerified ? (
                <button
                  type="button"
                  className="btn-send-phone-otp"
                  onClick={handleSendPhoneOtp}
                >
                  {showOtpInput ? t('profile.resendOtp') : t('profile.verifyViaOtp')}
                </button>
              ) : (
                <div className="phone-verified-tag">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.5">
                    <path d="m5 12 5 5L20 7" />
                  </svg>
                  <span>{t('profile.verified')}</span>
                </div>
              )}
            </div>

            {otpError && <div className="field-error-text">{otpError}</div>}

            {/* OTP Input Box */}
            {showOtpInput && !formData.isPhoneVerified && (
              <div className="profile-otp-box">
                <div className="otp-box-header">
                  <span>{t('profile.enterCode')}:</span>
                  <span className="demo-code-pill">{t('profile.demoOtp')}: <strong>482910</strong></span>
                </div>

                <div className="otp-inputs-grid">
                  {[0, 1, 2, 3, 4, 5].map((idx) => (
                    <input
                      key={idx}
                      id={`prof-otp-${idx}`}
                      type="text"
                      maxLength={1}
                      className="clean-otp-input"
                      value={otpDigits[idx]}
                      onChange={(e) => {
                        const val = e.target.value.slice(-1)
                        const arr = [...otpDigits]
                        arr[idx] = val
                        setOtpDigits(arr)
                        if (val && idx < 5) {
                          document.getElementById(`prof-otp-${idx + 1}`)?.focus()
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
                          document.getElementById(`prof-otp-${idx - 1}`)?.focus()
                        }
                      }}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  className="btn-verify-otp-submit"
                  onClick={handleVerifyPhoneOtp}
                >
                  {t('profile.confirmVerify')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── AADHAAR e-KYC VERIFICATION ── */}
        <div className="profile-form-section">
          <h4 className="section-title">Aadhaar e-KYC Verification</h4>

          {!isAadhaarVerified ? (
            <div>
              <div className="form-field-group">
                <label className="field-label" htmlFor="prof-aadhaar">
                  Aadhaar Number (12 digits)
                </label>
                <input
                  id="prof-aadhaar"
                  type="text"
                  className="clean-input"
                  placeholder="XXXX XXXX XXXX"
                  maxLength={14}
                  value={aadhaarInput}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '').slice(0, 12)
                    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ')
                    setAadhaarInput(formatted)
                    if (aadhaarError) setAadhaarError('')
                  }}
                  disabled={aadhaarVerifying}
                />
                {aadhaarError && <div className="field-error-text">{aadhaarError}</div>}
              </div>
              <button
                type="button"
                className="btn-send-phone-otp"
                onClick={handleAadhaarVerify}
                disabled={aadhaarVerifying}
                style={{ marginTop: '8px', width: '100%' }}
              >
                {aadhaarVerifying ? 'Verifying with UIDAI...' : 'Verify Aadhaar'}
              </button>
            </div>
          ) : (
            <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500', marginBottom: '4px' }}>Aadhaar Number</div>
                  <div style={{ fontSize: '16px', color: '#0f172a', fontWeight: '600' }}>{aadhaarDetails?.maskedAadhaar || 'XXXX XXXX 1234'}</div>
                </div>
                <button
                  type="button"
                  onClick={handleResetAadhaar}
                  style={{ background: 'none', border: 'none', color: '#4f46e5', fontWeight: '500', cursor: 'pointer', fontSize: '14px', padding: '8px' }}
                >
                  Edit
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', fontSize: '13px', color: '#16a34a', fontWeight: '500' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><path d="m5 12 5 5L20 7" /></svg>
                Verified via e-KYC
              </div>
            </div>
          )}
        </div>

        {/* ── SECTION 2: Landholder Identity ── */}
        <div className="profile-form-section">
          <h4 className="section-title">{t('profile.landholderDetails')}</h4>

          {/* Full Name */}
          <div className="form-field-group">
            <label className="field-label" htmlFor="prof-name">
              {t('profile.fullLegalName')}
            </label>
            <input
              id="prof-name"
              type="text"
              className="clean-input"
              placeholder={t('profile.namePlaceholder')}
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          <div className="form-two-cols">
            {/* Gender */}
            <div className="form-field-group">
              <label className="field-label" htmlFor="prof-gender">
                {t('profile.gender')}
              </label>
              <select
                id="prof-gender"
                className="clean-input select"
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
              >
                <option value="">{t('profile.selectGender')}</option>
                <option value="Male">{t('profile.male')}</option>
                <option value="Female">{t('profile.female')}</option>
                <option value="Other">{t('profile.other')}</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div className="form-field-group">
              <label className="field-label" htmlFor="prof-dob">
                {t('profile.dob')}
              </label>
              <input
                id="prof-dob"
                type="date"
                className="clean-input"
                value={formData.dob}
                onChange={(e) => handleInputChange('dob', e.target.value)}
              />
            </div>
          </div>

          {/* Address */}
          <div className="form-field-group">
            <label className="field-label" htmlFor="prof-address">
              {t('profile.villageAddress')}
            </label>
            <input
              id="prof-address"
              type="text"
              className="clean-input"
              placeholder={t('profile.addressPlaceholder')}
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
          </div>

          <div className="form-two-cols">
            {/* District */}
            <div className="form-field-group">
              <label className="field-label" htmlFor="prof-district">
                {t('profile.district')}
              </label>
              <input
                id="prof-district"
                type="text"
                className="clean-input"
                placeholder={t('profile.districtPlaceholder')}
                value={formData.district}
                onChange={(e) => handleInputChange('district', e.target.value)}
              />
            </div>

            {/* State */}
            <div className="form-field-group">
              <label className="field-label" htmlFor="prof-state">
                {t('profile.stateUT')}
              </label>
              <input
                id="prof-state"
                type="text"
                className="clean-input"
                placeholder={t('profile.statePlaceholder')}
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="profile-form-footer">
          <button type="submit" className="bhoomi-btn-save-profile" disabled={isSaving}>
            {isSaving ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                {t('profile.saving')}
              </span>
            ) : t('profile.saveDetails')}
          </button>
        </div>

      </form>
    </div>
  )
}
