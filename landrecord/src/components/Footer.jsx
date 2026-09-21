import React from 'react'
import { useLanguage } from '../i18n/LanguageContext'

// Footer: Modern BhoomIntelli portal footer
export default function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="bhoomi-footer">
      <div className="bhoomi-footer-container">
        <div className="bhoomi-footer-left">
          <div className="bhoomi-footer-brand-wrap">
            <img
              src="/bhoomintelli-icon.png"
              alt="BhoomIntelli Icon"
              className="bhoomi-footer-icon"
            />
            <img
              src="/bhoomintelli-wordmark.png"
              alt="BhoomIntelli"
              className="bhoomi-footer-wordmark"
            />
          </div>
          <span className="bhoomi-footer-sep">·</span>
          <span className="bhoomi-footer-desc">{t('footer.desc')}</span>
        </div>
        <div className="bhoomi-footer-right">
          <span>{t('footer.digitalIndia')}</span>
          <span className="bhoomi-footer-sep">·</span>
          <span>{t('footer.security')}</span>
        </div>
      </div>
    </footer>
  )
}
