import { useLanguage } from '../../i18n/LanguageContext'

export default function AuthRequiredModal({ onClose, onProceedToLogin }) {
  const { t } = useLanguage()
  return (
    <div className="bhoomi-modal-overlay" onClick={onClose}>
      <div
        className="bhoomi-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '440px', textAlign: 'center' }}
      >
        <div
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '12px',
            backgroundColor: '#ecfdf5',
            color: '#166534',
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
          {t('authModal.title')}
        </h3>
        <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: 1.5, margin: '0 0 24px 0' }}>
          {t('authModal.desc')}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            className="btn-upload-primary"
            style={{ justifyContent: 'center', width: '100%' }}
            onClick={onProceedToLogin}
          >
            {t('authModal.signInBtn')}
          </button>
          <button
            className="btn-how-it-works-downward"
            style={{ width: '100%' }}
            onClick={onClose}
          >
            {t('authModal.cancelBtn')}
          </button>
        </div>
      </div>
    </div>
  )
}
