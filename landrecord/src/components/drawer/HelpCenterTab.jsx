import { useState } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'

const getFaqs = (t) => [
  {
    id: 'faq1',
    question: t('help.faq1Q'),
    answer: t('help.faq1A'),
  },
  {
    id: 'faq2',
    question: t('help.faq2Q'),
    answer: t('help.faq2A'),
  },
  {
    id: 'faq3',
    question: t('help.faq3Q'),
    answer: t('help.faq3A'),
  },
  {
    id: 'faq4',
    question: t('help.faq4Q'),
    answer: t('help.faq4A'),
  },
]

const getSupportChannels = (t) => [
  {
    href: 'mailto:support@bhoomintelli.gov.in',
    iconBg: '#ffffff',
    iconColor: '#ea4335',
    icon: (
      <svg width="22" height="22" viewBox="52 42 88 66" xmlns="http://www.w3.org/2000/svg">
        <path fill="#4285f4" d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6" />
        <path fill="#34a853" d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15v34z" />
        <path fill="#c5221f" d="M52 51v8l20 15V48l-5.6-4.29c-5.93-3.94-14.4.29-14.4 7.29z" />
        <path fill="#fbbc04" d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.71z" />
        <path fill="#ea4335" d="M72 74V48l24 18 24-18v26L96 92z" />
      </svg>
    ),
    label: t('help.emailSupport'),
    value: 'support@bhoomintelli.gov.in',
  },
  {
    href: 'https://wa.me/0000000000',
    iconBg: '#ecfdf5',
    iconColor: '#25D366',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#25D366">
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.76-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.71 4.3 3.8 2.53 1.09 2.53.73 2.98.69.46-.04 1.47-.6 1.68-1.18.21-.59.21-1.09.15-1.18-.06-.1-.23-.17-.48-.29"/>
      </svg>
    ),
    label: t('help.whatsapp'),
    value: '+00 0000000000',
  },
  {
    href: 'https://x.com/BhoomIntelli',
    iconBg: '#f8fafc',
    iconColor: '#0f172a',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#0f172a">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    label: t('help.twitter'),
    value: '@BhoomIntelli',
  },
  {
    href: 'https://instagram.com/bhoomintelli',
    iconBg: '#fdf2f8',
    iconColor: '#d6249f',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24">
        <defs>
          <linearGradient id="ig-grad-help" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop stopColor="#fdf497" offset="0%" />
            <stop stopColor="#fd5949" offset="45%" />
            <stop stopColor="#d6249f" offset="65%" />
            <stop stopColor="#285AEB" offset="100%" />
          </linearGradient>
        </defs>
        <path fill="url(#ig-grad-help)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    label: t('help.community'),
    value: '@bhoomintelli',
  },
]

export default function HelpCenterTab() {
  const { t } = useLanguage()
  const [openFaq, setOpenFaq] = useState('faq1')

  const faqs = getFaqs(t)
  const supportChannels = getSupportChannels(t)

  return (
    <div className="help-center-tab-content">
      <div className="help-center-header">
        <h3 style={{ margin: '0 0 6px 0', fontSize: '20px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>
          {t('help.title')}
        </h3>
        <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#64748b', lineHeight: 1.5 }}>
          {t('help.subtitle')}
        </p>
      </div>

      {/* FAQ Accordions */}
      <div className="faq-list-container">
        {faqs.map((faq) => (
          <div key={faq.id} className="help-guide-card">
            <div
              className="help-guide-header"
              onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
            >
              <span style={{ fontWeight: 700 }}>{faq.question}</span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>{openFaq === faq.id ? '▲' : '▼'}</span>
            </div>
            {openFaq === faq.id && (
              <div className="help-guide-body">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>

      {/* Support Channels */}
      <h4 style={{ margin: '28px 0 14px 0', fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
        {t('help.supportChannels')}
      </h4>
      <div className="help-channels-grid">
        {supportChannels.map((ch) => (
          <a
            key={ch.label}
            href={ch.href}
            className="help-channel-box"
            target="_blank"
            rel="noreferrer"
          >
            <div
              className="help-channel-icon"
              style={{ backgroundColor: ch.iconBg, color: ch.iconColor }}
            >
              {ch.icon}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>{ch.label}</div>
              <strong style={{ fontSize: '13.5px', color: '#0f172a' }}>{ch.value}</strong>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
