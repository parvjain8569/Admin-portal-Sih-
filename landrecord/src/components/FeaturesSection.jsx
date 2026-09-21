import React from 'react'
import { useLanguage } from '../i18n/LanguageContext'

// FeaturesSection: 4 Core technology capabilities matching the BhoomIntelli design
export default function FeaturesSection() {
  const { t } = useLanguage()
  const features = [
    {
      id: 'ocr',
      title: t('features.ocr.title'),
      desc: t('features.ocr.desc'),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 8V4m0 0h4M4 4l5 5m11-5v4m0-4h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      )
    },
    {
      id: 'structuring',
      title: t('features.structuring.title'),
      desc: t('features.structuring.desc'),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
      )
    },
    {
      id: 'duplicate',
      title: t('features.duplicate.title'),
      desc: t('features.duplicate.desc'),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      )
    },
    {
      id: 'security',
      title: t('features.security.title'),
      desc: t('features.security.desc'),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          <circle cx="12" cy="16" r="1.5" />
        </svg>
      )
    }
  ]

  return (
    <section className="bhoomi-features-section" id="features">
      <div className="bhoomi-features-container">
        <div className="bhoomi-features-grid">
          {features.map((feat) => (
            <div key={feat.id} className="bhoomi-feature-card">
              <div className="bhoomi-feature-icon-box">
                {feat.icon}
              </div>
              <h3 className="bhoomi-feature-title">{feat.title}</h3>
              <p className="bhoomi-feature-desc">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
