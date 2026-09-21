import { forwardRef } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

// ThreeStepsSection: Pixel-accurate to SS 4 with White & Green project color theme,
// giant faint step numbers, connector line, bottom illustrations, and trust pills.
const ThreeStepsSection = forwardRef(function ThreeStepsSection(_, ref) {
  const { t } = useLanguage()

  return (
    <section className="bhoomi-steps-section-v4" ref={ref} id="three-steps">
      {/* Soft crystal geometric background ambient */}
      <div className="steps-crystal-bg" aria-hidden="true">
        <svg viewBox="0 0 1440 600" preserveAspectRatio="none" className="steps-polygons-svg">
          <polygon points="0,0 350,0 200,280 0,180" fill="#f0fdf4" opacity="0.7" />
          <polygon points="350,0 900,0 750,190 200,280" fill="#ecfdf5" opacity="0.45" />
          <polygon points="900,0 1440,0 1440,260 1150,180" fill="#f0fdf4" opacity="0.65" />
          <polygon points="1440,260 1440,600 1180,480 1280,240" fill="#dcfce7" opacity="0.35" />
          <polygon points="0,180 200,280 140,540 0,600" fill="#ecfdf5" opacity="0.5" />
        </svg>
      </div>

      <div className="bhoomi-steps-wrapper-v4">
        {/* Top Header Row with Official Branding Tag (matching SS 4 top-left) */}
        <div className="bhoomi-steps-header-v4">
          <div className="steps-brand-tag">
            <img src="/bhoomintelli-icon.png" alt="" className="steps-brand-tag-icon" />
            <span className="steps-brand-tag-text">BhoomIntelli</span>
          </div>

          <h2 className="bhoomi-steps-title-v4">{t('steps.title')}</h2>
          <p className="bhoomi-steps-subtitle-v4">
            {t('steps.subtitle')}
          </p>
        </div>

        {/* 3 Step Cards Grid with Connecting Dashed Line */}
        <div className="bhoomi-steps-grid-v4">

          {/* ──────────────────────────────────────────────
              STEP 1: 01 Upload
              ────────────────────────────────────────────── */}
          <div className="bhoomi-step-card-v4">
            {/* Giant Faint Background Number */}
            <span className="step-ghost-number" aria-hidden="true">01</span>

            {/* Top Icon Container */}
            <div className="step-top-icon-wrap">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <circle cx="12" cy="15" r="4" fill="#ecfdf5" stroke="#166534" strokeWidth="1.8" />
                <polyline points="12 17 12 13" stroke="#166534" strokeWidth="2" />
                <polyline points="10 14 12 12 14 14" stroke="#166534" strokeWidth="2" />
              </svg>
            </div>

            {/* Step Title & Description */}
            <h3 className="step-card-title-v4">{t('steps.step1.title')}</h3>
            <p className="step-card-desc-v4">
              {t('steps.step1.desc')}
            </p>

            {/* Bottom Illustration: Hand holding document with upload cloud */}
            <div className="step-illustration-container">
              <svg viewBox="0 0 100 90" className="step-bottom-illustration" fill="none">
                {/* Cloud with upload arrow */}
                <path d="M42 28 C42 22 48 18 54 18 C59 18 64 21 65 25 C69 25 72 28 72 32 C72 36 69 39 65 39 L40 39 C36 39 33 36 33 32 C33 28 36 25 40 25 C41 25 41.5 25.2 42 25.5" fill="#dcfce7" stroke="#166534" strokeWidth="2.2" strokeLinejoin="round" />
                <path d="M52 35 L52 25 M48 29 L52 25 L56 29" stroke="#166534" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                {/* Document sheet */}
                <rect x="52" y="32" width="30" height="42" rx="3" fill="#ffffff" stroke="#166534" strokeWidth="2.2" />
                <line x1="57" y1="40" x2="76" y2="40" stroke="#86efac" strokeWidth="2" strokeLinecap="round" />
                <line x1="57" y1="46" x2="76" y2="46" stroke="#86efac" strokeWidth="2" strokeLinecap="round" />
                <line x1="57" y1="52" x2="71" y2="52" stroke="#86efac" strokeWidth="2" strokeLinecap="round" />
                <line x1="57" y1="58" x2="76" y2="58" stroke="#86efac" strokeWidth="2" strokeLinecap="round" />
                {/* Hand holding paper */}
                <path d="M30 68 L42 56 C44 54 48 54 50 56 L58 64 L50 72 L36 78 Z" fill="#dcfce7" stroke="#166534" strokeWidth="2.2" strokeLinejoin="round" />
                <path d="M48 56 L54 50 C55.5 48.5 58 48.5 59.5 50 C61 51.5 61 54 59.5 55.5 L55 60" stroke="#166534" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M26 72 L36 82 L28 88 L18 78 Z" fill="#f0fdf4" stroke="#166534" strokeWidth="2.2" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* ──────────────────────────────────────────────
              STEP 2: 02 Verify
              ────────────────────────────────────────────── */}
          <div className="bhoomi-step-card-v4">
            {/* Giant Faint Background Number */}
            <span className="step-ghost-number" aria-hidden="true">02</span>

            {/* Top Icon Container */}
            <div className="step-top-icon-wrap">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" stroke="#166534" strokeWidth="2.2" fill="#ecfdf5" />
                <polyline points="9 11 10.5 12.5 13.5 9.5" stroke="#166534" strokeWidth="2.2" />
                <line x1="16" y1="16" x2="21" y2="21" stroke="#166534" strokeWidth="2.6" />
              </svg>
            </div>

            {/* Step Title & Description */}
            <h3 className="step-card-title-v4">{t('steps.step2.title')}</h3>
            <p className="step-card-desc-v4">
              {t('steps.step2.desc')}
            </p>

            {/* Bottom Illustration: Checklist with inspection magnifying glass */}
            <div className="step-illustration-container">
              <svg viewBox="0 0 100 90" className="step-bottom-illustration" fill="none">
                {/* Checklist sheet */}
                <rect x="22" y="16" width="46" height="58" rx="4" fill="#ffffff" stroke="#166534" strokeWidth="2.2" />
                {/* Header bar on sheet */}
                <rect x="22" y="16" width="46" height="12" rx="4" fill="#dcfce7" stroke="#166534" strokeWidth="2.2" />
                <circle cx="30" cy="22" r="2" fill="#166534" />
                <circle cx="37" cy="22" r="2" fill="#166534" />
                {/* 3 Checkmark rows */}
                <rect x="28" y="34" width="8" height="8" rx="2" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />
                <path d="M30 38 L32 40 L35 36" stroke="#166534" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="40" y1="38" x2="60" y2="38" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />

                <rect x="28" y="46" width="8" height="8" rx="2" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />
                <path d="M30 50 L32 52 L35 48" stroke="#166534" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="40" y1="50" x2="60" y2="50" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />

                <rect x="28" y="58" width="8" height="8" rx="2" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />
                <path d="M30 62 L32 64 L35 60" stroke="#166534" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="40" y1="62" x2="56" y2="62" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />

                {/* Large magnifying glass inspecting */}
                <circle cx="64" cy="50" r="16" fill="#f0fdf4" stroke="#166534" strokeWidth="2.4" />
                <circle cx="64" cy="50" r="12" fill="#dcfce7" opacity="0.6" />
                <path d="M59 50 L63 54 L70 46" stroke="#166534" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="76" y1="62" x2="88" y2="74" stroke="#166534" strokeWidth="3.6" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* ──────────────────────────────────────────────
              STEP 3: 03 Get Digital Record
              ────────────────────────────────────────────── */}
          <div className="bhoomi-step-card-v4">
            {/* Giant Faint Background Number */}
            <span className="step-ghost-number" aria-hidden="true">03</span>

            {/* Top Icon Container */}
            <div className="step-top-icon-wrap">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="#166534" strokeWidth="2" />
                <circle cx="12" cy="12" r="4.5" fill="#ecfdf5" stroke="#166534" strokeWidth="1.8" />
                <path d="M12 9.5 L14.5 11 V13 C14.5 14.5 12 15.5 12 15.5 C12 15.5 9.5 14.5 9.5 13 V11 Z" fill="#16a34a" />
              </svg>
            </div>

            {/* Step Title & Description */}
            <h3 className="step-card-title-v4">{t('steps.step3.title')}</h3>
            <p className="step-card-desc-v4">
              {t('steps.step3.desc')}
            </p>

            {/* Bottom Illustration: Certificate with seal & QR code */}
            <div className="step-illustration-container">
              <svg viewBox="0 0 100 90" className="step-bottom-illustration" fill="none">
                {/* Certificate sheet */}
                <rect x="20" y="16" width="56" height="66" rx="4" fill="#ffffff" stroke="#166534" strokeWidth="2.2" />
                {/* Inner border */}
                <rect x="25" y="21" width="46" height="56" rx="2" stroke="#bbf7d0" strokeWidth="1.2" strokeDasharray="3 2" />
                {/* Top rosette ribbon seal */}
                <circle cx="48" cy="34" r="9" fill="#dcfce7" stroke="#166534" strokeWidth="2" />
                <path d="M44 34 L47 37 L52 32" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M43 42 L41 48 L46 45 L48 48 L48 42" fill="#86efac" stroke="#166534" strokeWidth="1.5" />
                <path d="M53 42 L55 48 L50 45 L48 48 L48 42" fill="#86efac" stroke="#166534" strokeWidth="1.5" />
                {/* Text lines */}
                <line x1="32" y1="50" x2="64" y2="50" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="32" y1="56" x2="58" y2="56" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" />
                {/* QR Code box */}
                <rect x="28" y="62" width="13" height="13" fill="#f0fdf4" stroke="#166534" strokeWidth="1.5" />
                <rect x="30" y="64" width="3" height="3" fill="#166534" />
                <rect x="36" y="64" width="3" height="3" fill="#166534" />
                <rect x="30" y="70" width="3" height="3" fill="#166534" />
                <rect x="35" y="69" width="4" height="4" fill="#166534" />
                {/* Verified green stamp badge */}
                <circle cx="70" cy="66" r="11" fill="#ecfdf5" stroke="#16a34a" strokeWidth="2" />
                <path d="M66 66 L69 69 L75 63" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

        </div>

        {/* Bottom Features Pill Row (SS 4) */}
        <div className="bhoomi-steps-pills-row">
          <div className="step-feature-pill">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
            <span>{t('steps.pill1')}</span>
          </div>

          <div className="step-feature-pill">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span>{t('steps.pill2')}</span>
          </div>

          <div className="step-feature-pill">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <span>{t('steps.pill3')}</span>
          </div>
        </div>

      </div>
    </section>
  )
})

export default ThreeStepsSection
