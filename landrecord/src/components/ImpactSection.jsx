import React from 'react'
import { useLanguage } from '../i18n/LanguageContext'

// ImpactSection: Technical Architecture & System Benchmarks (SS 2 in White & Green theme)
export default function ImpactSection() {
  const { t } = useLanguage()
  return (
    <section className="bhoomi-benchmarks-section" id="about">
      <div className="bhoomi-benchmarks-container">

        {/* Section Header */}
        <div className="bhoomi-benchmarks-header">
          <span className="bhoomi-benchmarks-tag">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            {t('impact.tag')}
          </span>
          <h2 className="bhoomi-benchmarks-title">
            {t('impact.title')}
          </h2>
          <p className="bhoomi-benchmarks-subtitle">
            {t('impact.subtitle')}
          </p>
        </div>

        {/* 2x2 Grid of Technical Benchmark Cards (White & Green Theme) */}
        <div className="bhoomi-benchmarks-grid">

          {/* ────────────────────────────────────────────────
              CARD 1: 98% PaddleOCR Field Precision
              ──────────────────────────────────────────────── */}
          <div className="bhoomi-benchmark-card">
            <div className="benchmark-card-top">
              <div className="benchmark-icon-wrap">
                {/* OCR Scanner Icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 7V4h3" />
                  <path d="M20 7V4h-3" />
                  <path d="M4 17v3h3" />
                  <path d="M20 17v3h-3" />
                  <rect x="7" y="7" width="10" height="10" rx="2" stroke="#166534" strokeWidth="1.8" />
                  <line x1="9" y1="11" x2="15" y2="11" stroke="#166534" strokeWidth="1.6" />
                  <line x1="9" y1="14" x2="13" y2="14" stroke="#166534" strokeWidth="1.6" />
                </svg>
              </div>
              <h3 className="benchmark-card-title">{t('impact.card1.title')}</h3>
            </div>

            {/* Progress Bar Container */}
            <div className="benchmark-progress-section">
              <div className="benchmark-progress-track">
                <div className="benchmark-progress-fill" style={{ width: '98%' }}></div>
              </div>
              <span className="benchmark-progress-label">98%</span>
            </div>

            {/* Explanatory details */}
            <div className="benchmark-card-body">
              <p className="benchmark-desc-main">
                {t('impact.card1.desc')}
              </p>
              <p className="benchmark-desc-sub">
                {t('impact.card1.sub')}
              </p>
            </div>

            {/* Pill Status */}
            <div className="benchmark-card-footer">
              <span className="benchmark-pill benchmark-pill-pass">
                <span className="pill-dot"></span>
                {t('impact.card1.pill')}
              </span>
            </div>
          </div>

          {/* ────────────────────────────────────────────────
              CARD 2: <2.0s Database Triangulation Latency
              ──────────────────────────────────────────────── */}
          <div className="bhoomi-benchmark-card">
            <div className="benchmark-card-top">
              <div className="benchmark-icon-wrap">
                {/* Database + Latency Timer Icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <ellipse cx="12" cy="5" rx="9" ry="3" />
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                  <path d="M3 5v14c0 1.66 4 3 9 3 2.39 0 4.57-.31 6.13-.85" />
                  <circle cx="18" cy="18" r="4" fill="#ffffff" stroke="#166534" strokeWidth="1.8" />
                  <polyline points="18 16 18 18 19.5 18" stroke="#166534" strokeWidth="1.6" />
                </svg>
              </div>
              <h3 className="benchmark-card-title">{t('impact.card2.title')}</h3>
            </div>

            {/* Big Metric Display */}
            <div className="benchmark-stat-highlight">
              <span className="benchmark-stat-num">1.47s</span>
              <span className="benchmark-stat-unit">{t('impact.card2.avg')}</span>
            </div>

            <p className="benchmark-desc-subtle">
              {t('impact.card2.desc')}
            </p>

            {/* Latency Sparkline Graph SVG */}
            <div className="benchmark-sparkline-wrap">
              <svg viewBox="0 0 320 64" className="benchmark-sparkline-svg" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="latencyGreenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* SLA 2.0s threshold dashed line */}
                <line x1="0" y1="12" x2="320" y2="12" stroke="#e2e8f0" strokeWidth="1.2" strokeDasharray="3 3" />
                <text x="316" y="10" fill="#94a3b8" fontSize="8.5" textAnchor="end" fontWeight="600">2.0s SLA</text>
                
                {/* Gradient area fill under line */}
                <polygon
                  points="0,48 24,42 56,38 88,46 120,34 152,40 184,30 216,36 248,26 280,32 312,22 312,64 0,64"
                  fill="url(#latencyGreenGrad)"
                />
                {/* Main line curve */}
                <polyline
                  points="0,48 24,42 56,38 88,46 120,34 152,40 184,30 216,36 248,26 280,32 312,22"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Highlight active latency point */}
                <circle cx="280" cy="32" r="4.5" fill="#15803d" stroke="#ffffff" strokeWidth="2" />
                <circle cx="280" cy="32" r="8" fill="#22c55e" opacity="0.3" className="benchmark-pulse-ring" />
              </svg>
            </div>

            {/* Pill Status */}
            <div className="benchmark-card-footer">
              <span className="benchmark-pill benchmark-pill-pass">
                <span className="pill-dot"></span>
                {t('impact.card2.pill')}
              </span>
            </div>
          </div>

          {/* ────────────────────────────────────────────────
              CARD 3: Bhu-Naksha / ULPIN Geometric Mapping
              ──────────────────────────────────────────────── */}
          <div className="bhoomi-benchmark-card">
            <div className="benchmark-card-top">
              <div className="benchmark-icon-wrap">
                {/* Cadastral Map Pin & Mesh Icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                  <line x1="9" y1="3" x2="9" y2="18" />
                  <line x1="15" y1="6" x2="15" y2="21" />
                  <circle cx="12" cy="12" r="2" fill="#166534" />
                </svg>
              </div>
              <div>
                <h3 className="benchmark-card-title">{t('impact.card3.title')}</h3>
                <div className="benchmark-card-sub-rate" dangerouslySetInnerHTML={{ __html: t('impact.card3.rate') }}></div>
              </div>
            </div>

            {/* Geometric Cadastral Parcel Map Visual */}
            <div className="benchmark-map-visual">
              <svg viewBox="0 0 260 110" className="benchmark-cadastral-svg">
                {/* Grid guidelines */}
                <line x1="20" y1="20" x2="240" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="20" y1="55" x2="240" y2="55" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="20" y1="90" x2="240" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                
                {/* Surrounding parcels */}
                <polygon points="35,30 90,20 110,50 60,65" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1.5" />
                <polygon points="90,20 165,15 175,48 110,50" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.2" />
                <polygon points="175,48 235,38 245,75 190,82" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1.5" />
                <polygon points="60,65 110,50 125,95 75,100" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.2" />
                
                {/* Active Target Cadastral Parcel (Highlighted Green with Mesh & Coordinates) */}
                <polygon points="110,50 175,48 190,82 125,95" fill="#dcfce7" stroke="#16a34a" strokeWidth="2.2" />
                <line x1="110" y1="50" x2="190" y2="82" stroke="#16a34a" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                <line x1="175" y1="48" x2="125" y2="95" stroke="#16a34a" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

                {/* Vertex pins */}
                <circle cx="110" cy="50" r="2.5" fill="#166534" />
                <circle cx="175" cy="48" r="2.5" fill="#166534" />
                <circle cx="190" cy="82" r="2.5" fill="#166534" />
                <circle cx="125" cy="95" r="2.5" fill="#166534" />

                {/* Center Pin & Radar Ping */}
                <circle cx="150" cy="68" r="4.5" fill="#15803d" stroke="#ffffff" strokeWidth="2" />
                <circle cx="150" cy="68" r="9" fill="#16a34a" opacity="0.25" className="benchmark-pulse-ring" />

                {/* Coordinate marker label */}
                <rect x="156" y="58" width="86" height="20" rx="4" fill="#ffffff" stroke="#86efac" strokeWidth="1" />
                <text x="162" y="72" fill="#166534" fontSize="9" fontWeight="700">{t('impact.card3.parcel')}</text>
              </svg>
            </div>

            {/* Cadastral Info line */}
            <div className="benchmark-meta-detail" dangerouslySetInnerHTML={{ __html: t('impact.card3.meta') }}>
            </div>

            {/* Pill Status */}
            <div className="benchmark-card-footer">
              <span className="benchmark-pill benchmark-pill-verified">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {t('impact.card3.pill')}
              </span>
            </div>
          </div>

          {/* ────────────────────────────────────────────────
              CARD 4: Zero-Trust Fallback Routing
              ──────────────────────────────────────────────── */}
          <div className="bhoomi-benchmark-card">
            <div className="benchmark-card-top">
              <div className="benchmark-icon-wrap">
                {/* Shield with routing arrows icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" stroke="#166534" strokeWidth="2" />
                </svg>
              </div>
              <div>
                <h3 className="benchmark-card-title">{t('impact.card4.title')}</h3>
                <div className="benchmark-card-sub-rate">{t('impact.card4.sub')}</div>
              </div>
            </div>

            {/* Flowchart Vector Layout */}
            <div className="benchmark-flow-diagram">
              <div className="flow-step-box unreadable">
                <span className="flow-step-dot"></span>
                {t('impact.card4.flow1')}
              </div>

              <div className="flow-arrow-connector">
                <svg width="22" height="14" viewBox="0 0 24 14" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="2" y1="7" x2="20" y2="7" />
                  <polyline points="15 2 20 7 15 12" />
                </svg>
              </div>

              <div className="flow-step-box router">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
                {t('impact.card4.flow2')}
              </div>

              <div className="flow-arrow-connector">
                <svg width="22" height="14" viewBox="0 0 24 14" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="2" y1="7" x2="20" y2="7" />
                  <polyline points="15 2 20 7 15 12" />
                </svg>
              </div>

              <div className="flow-step-box reviewer">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {t('impact.card4.flow3')}
              </div>
            </div>

            {/* Resolved & Logged status branch */}
            <div className="benchmark-resolved-row">
              <div className="resolved-check-badge">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span className="resolved-text">{t('impact.card4.resolved')}</span>
            </div>

            {/* Pill Status */}
            <div className="benchmark-card-footer">
              <span className="benchmark-pill benchmark-pill-audit">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                {t('impact.card4.pill')}
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
