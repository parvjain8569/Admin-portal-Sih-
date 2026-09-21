import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

// ─── Generate a random 6-char alphanumeric CAPTCHA string ──────────────────
function generateCaptcha(length = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

// ─── Draw distorted CAPTCHA on a canvas ───────────────────────────────────
function drawCaptcha(canvas, text) {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const w = canvas.width
  const h = canvas.height

  ctx.clearRect(0, 0, w, h)

  const bg = ctx.createLinearGradient(0, 0, w, h)
  bg.addColorStop(0, '#f0fdf4')
  bg.addColorStop(1, '#dcfce7')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  for (let i = 0; i < 6; i++) {
    ctx.strokeStyle = `hsla(${Math.random() * 360},50%,60%,0.35)`
    ctx.lineWidth = 1.2
    ctx.beginPath()
    ctx.moveTo(Math.random() * w, Math.random() * h)
    ctx.bezierCurveTo(
      Math.random() * w, Math.random() * h,
      Math.random() * w, Math.random() * h,
      Math.random() * w, Math.random() * h
    )
    ctx.stroke()
  }

  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = `hsla(${Math.random() * 360},50%,50%,0.2)`
    ctx.beginPath()
    ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 2, 0, Math.PI * 2)
    ctx.fill()
  }

  const charW = w / (text.length + 1)
  text.split('').forEach((ch, i) => {
    ctx.save()
    const x = charW * (i + 0.7) + Math.random() * 6 - 3
    const y = h / 2 + Math.random() * 8 - 4
    ctx.translate(x, y)
    ctx.rotate((Math.random() - 0.5) * 0.45)
    ctx.font = `bold ${22 + Math.random() * 8}px "Courier New", monospace`
    ctx.fillStyle = `hsl(${140 + Math.random() * 60},60%,${25 + Math.random() * 20}%)`
    ctx.textBaseline = 'middle'
    ctx.fillText(ch, 0, 0)
    ctx.restore()
  })
}

function generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1: Alphabet CAPTCHA Modal
// ─────────────────────────────────────────────────────────────────────────────
function CaptchaStep({ onVerified, onClose }) {
  const { t } = useLanguage()
  const canvasRef = useRef(null)
  const [captchaText, setCaptchaText] = useState(() => generateCaptcha())
  const [userInput, setUserInput] = useState('')
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)

  useEffect(() => {
    drawCaptcha(canvasRef.current, captchaText)
    
    // DevMode Autofill
    const handleDevMode = () => {
      if (localStorage.getItem('devMode') === 'true') {
        setUserInput(captchaText)
      }
    }
    handleDevMode()
    window.addEventListener('devModeChange', handleDevMode)
    return () => window.removeEventListener('devModeChange', handleDevMode)
  }, [captchaText])

  const refresh = () => {
    const newText = generateCaptcha()
    setCaptchaText(newText)
    setUserInput('')
    setError('')
    setTimeout(() => drawCaptcha(canvasRef.current, newText), 0)
  }

  const handleVerify = () => {
    if (userInput.trim().toLowerCase() === captchaText.toLowerCase()) {
      setError('')
      onVerified()
    } else {
      setError(t('captcha.error'))
      setShake(true)
      setTimeout(() => setShake(false), 600)
      refresh()
      setUserInput('')
    }
  }

  return (
    <div className="captcha-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`captcha-modal ${shake ? 'captcha-shake' : ''}`}>
        <div className="captcha-modal-header">
          <div className="captcha-modal-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <div>
            <h2 className="captcha-modal-title">{t('captcha.title')}</h2>
            <p className="captcha-modal-subtitle">{t('captcha.subtitle')}</p>
          </div>
          <button className="captcha-close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="captcha-progress-bar">
          <div className="captcha-progress-fill" style={{ width: '50%' }} />
        </div>

        <div className="captcha-modal-body">
          <p className="captcha-instruction">{t('captcha.instruction')}</p>

          <div className="captcha-canvas-wrapper">
            <canvas ref={canvasRef} width={260} height={72} className="captcha-canvas" />
            <button className="captcha-refresh-btn" onClick={refresh} title="Refresh" type="button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </button>
          </div>

          <input
            className="captcha-input"
            type="text"
            placeholder={t('captcha.placeholder')}
            value={userInput}
            onChange={(e) => { setUserInput(e.target.value); setError('') }}
            onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
            maxLength={8}
            autoComplete="off"
            spellCheck={false}
          />

          {error && <p className="captcha-error">{error}</p>}

          <button className="captcha-verify-btn" onClick={handleVerify} disabled={!userInput.trim()}>
            {t('captcha.verifyBtn')}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2: OTP Verification Modal
// ─────────────────────────────────────────────────────────────────────────────
function OTPStep({ phoneNumber, onVerified, onClose }) {
  const { t } = useLanguage()
  const [otp] = useState(() => generateOTP())
  const [inputs, setInputs] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [resendCooldown, setResendCooldown] = useState(30)
  const [shake, setShake] = useState(false)
  const inputRefs = useRef([])

  useEffect(() => {
    console.log(`[DEMO OTP] Your OTP is: ${otp}`)
    
    // DevMode Autofill
    const handleDevMode = () => {
      if (localStorage.getItem('devMode') === 'true') {
        setInputs(otp.split(''))
      }
    }
    handleDevMode()
    window.addEventListener('devModeChange', handleDevMode)
    return () => window.removeEventListener('devModeChange', handleDevMode)
  }, [otp])

  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [resendCooldown])

  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...inputs]
    next[index] = digit
    setInputs(next)
    setError('')
    if (digit && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !inputs[index] && index > 0) inputRefs.current[index - 1]?.focus()
    if (e.key === 'Enter') handleVerify()
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setInputs(pasted.split(''))
      inputRefs.current[5]?.focus()
    }
    e.preventDefault()
  }

  const handleVerify = () => {
    const entered = inputs.join('')
    if (entered.length < 6) { setError(t('otp.errorIncomplete')); return }
    if (entered === otp) {
      setError('')
      onVerified()
    } else {
      setError(t('otp.errorIncorrect'))
      setShake(true)
      setTimeout(() => setShake(false), 600)
      setInputs(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    }
  }

  const maskedPhone = phoneNumber
    ? phoneNumber.replace(/(\d{2})\d+(\d{2})/, '$1••••••$2')
    : '••••••••••'

  return (
    <div className="captcha-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`captcha-modal ${shake ? 'captcha-shake' : ''}`}>
        <div className="captcha-modal-header">
          <div className="captcha-modal-icon captcha-modal-icon--otp">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2">
              <rect x="5" y="2" width="14" height="20" rx="2" />
              <path d="M12 18h.01" />
            </svg>
          </div>
          <div>
            <h2 className="captcha-modal-title">{t('otp.title')}</h2>
            <p className="captcha-modal-subtitle">{t('otp.subtitle')}</p>
          </div>
          <button className="captcha-close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="captcha-progress-bar">
          <div className="captcha-progress-fill" style={{ width: '100%' }} />
        </div>

        <div className="captcha-modal-body">
          <p className="captcha-instruction" dangerouslySetInnerHTML={{ __html: t('otp.instruction').replace('{phone}', maskedPhone) }}></p>

          <div className="captcha-otp-demo-hint">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
            </svg>
            <span dangerouslySetInnerHTML={{ __html: t('otp.demoHint').replace('{otp}', otp) }}></span>
          </div>

          <div className="captcha-otp-boxes" onPaste={handlePaste}>
            {inputs.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                className={`captcha-otp-box ${digit ? 'captcha-otp-box--filled' : ''}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                autoFocus={i === 0}
                autoComplete="off"
              />
            ))}
          </div>

          {error && <p className="captcha-error">{error}</p>}

          <button
            className="captcha-verify-btn"
            onClick={handleVerify}
            disabled={inputs.join('').length < 6}
          >
            {t('otp.verifyBtn')}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>

          <button
            className={`captcha-resend-btn ${resendCooldown > 0 ? 'captcha-resend-disabled' : ''}`}
            onClick={() => {
              if (resendCooldown > 0) return
              setInputs(['', '', '', '', '', ''])
              setError('')
              setResendCooldown(30)
              inputRefs.current[0]?.focus()
            }}
            disabled={resendCooldown > 0}
          >
            {resendCooldown > 0 ? t('otp.resendCooldown').replace('{time}', resendCooldown) : t('otp.resend')}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export — step 1 → step 2
// ─────────────────────────────────────────────────────────────────────────────
export default function CaptchaVerification({ phoneNumber, onAllVerified, onClose }) {
  const [step, setStep] = useState(1)

  return step === 1
    ? <CaptchaStep onVerified={() => setStep(2)} onClose={onClose} />
    : <OTPStep phoneNumber={phoneNumber} onVerified={onAllVerified} onClose={onClose} />
}
