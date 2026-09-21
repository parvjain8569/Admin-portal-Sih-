import React from 'react'
import { useLanguage } from '../i18n/LanguageContext'

// FetchingDetailsOverlay: Full-screen animated overlay shown right after file upload
// Disappears after ~1.6s and leads to DocumentReviewPage
export default function FetchingDetailsOverlay({ fileName }) {
  const { t } = useLanguage()
  return (
    <div className="fetching-overlay">
      <div className="fetching-card">
        <div className="fetching-spinner-ring">
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
            <circle cx="26" cy="26" r="22" stroke="#e5e7eb" strokeWidth="4" />
            <circle
              cx="26" cy="26" r="22"
              stroke="#16a34a"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="69 69"
              style={{ animation: 'fetching-spin 1s linear infinite', transformOrigin: 'center' }}
            />
          </svg>
        </div>
        <h2 className="fetching-title">{t('fetching.title')}</h2>
        <p className="fetching-sub">
          {t('fetching.sub1')}
          <br />
          <strong>{fileName || t('fetching.sub2')}</strong>
        </p>
        <div className="fetching-steps">
          <div className="fetching-step fetching-step-done">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {t('fetching.step1')}
          </div>
          <div className="fetching-step fetching-step-active">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" style={{ animation: 'fetching-spin 1s linear infinite', transformOrigin: 'center' }}>
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            {t('fetching.step2')}
          </div>
          <div className="fetching-step fetching-step-pending">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
            </svg>
            {t('fetching.step3')}
          </div>
        </div>
      </div>
    </div>
  )
}
