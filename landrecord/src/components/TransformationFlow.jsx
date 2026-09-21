import React from 'react'
import { useLanguage } from '../i18n/LanguageContext'

// TransformationFlow: Visual "Land Document → Verified Digital Record" flow
// Displayed just above the footer on the home page
export default function TransformationFlow() {
  const { t } = useLanguage()
  return (
    <section className="bhoomi-flow-section">
      <div className="bhoomi-flow-wrapper">

        {/* Source Card: Original Paper Document */}
        <div className="flow-card-source">
          <div className="flow-card-icon-grey">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <div>
            <div className="flow-card-title">{t('flow.source.title')}</div>
            <div className="flow-card-sub">{t('flow.source.sub')}</div>
          </div>
        </div>

        {/* Arrow */}
        <div className="flow-arrow">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>

        {/* Target Card: Verified Digital Record */}
        <div className="flow-card-target">
          <div className="flow-card-icon-green">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <polyline points="9 12 11 14 15 10"></polyline>
            </svg>
          </div>
          <div>
            <div className="flow-card-title">{t('flow.target.title')}</div>
            <div className="flow-card-sub green">{t('flow.target.sub')}</div>
          </div>
        </div>

      </div>
    </section>
  )
}
