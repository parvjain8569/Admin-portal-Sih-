import React from 'react'
import { useLanguage } from '../i18n/LanguageContext'

// HeroSection: Modern split-screen layout matching the user's BhoomIntelli design
// Left: Headings, CTAs, trust badges
// Right: Visual comparison of vintage paper document -> verified digital structured card
export default function HeroSection({
  user,
  lastUploadedDoc,
  onUpload,
  onScrollToSteps,
  onViewRecords
}) {
  const sampleOwnerName = user?.name || 'Ramesh Kumar'
  const { t } = useLanguage()

  return (
    <section className="bhoomi-hero-v2">
      <div className="bhoomi-hero-container">

        {/* ── LEFT COLUMN: Text, CTAs & Badges ── */}
        <div className="bhoomi-hero-left">
          
          {/* Top Pill Tag */}
          <div className="bhoomi-pill-tag">
            <img src="/bhoomintelli-icon.png" alt="" className="hero-pill-brand-icon" />
            <span>Digital India • Smarter Land Records</span>
          </div>

          {/* Hero Headline */}
          <h1 className="bhoomi-hero-title-v2">
            {t('hero.title.part1')}
            <br />
            <span className="bhoomi-title-highlight">
              {t('hero.title.part2')}
              <svg className="bhoomi-curve-underline" viewBox="0 0 420 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 13C120 4 280 4 417 14" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="bhoomi-hero-subtitle-v2">
            {t('hero.subtitle')}
          </p>

          {/* Active Upload Banner if doc was picked */}
          {lastUploadedDoc && (
            <div className="bhoomi-uploaded-banner-v2">
              <div className="bhoomi-uploaded-info">
                <div className="bhoomi-uploaded-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div>
                  <div className="bhoomi-uploaded-name">{lastUploadedDoc.name}</div>
                  <div className="bhoomi-uploaded-sub">{lastUploadedDoc.size} · Just Uploaded</div>
                </div>
              </div>
              <button className="bhoomi-view-records-btn" onClick={onViewRecords}>
                View Records →
              </button>
            </div>
          )}

          {/* Action CTAs */}
          <div className="bhoomi-hero-cta-row">
            <button className="bhoomi-btn-primary-v2" onClick={onUpload}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                <path d="M12 12v9" />
                <path d="m8 16 4-4 4 4" />
              </svg>
              <span>{t('hero.btn.upload')}</span>
              <span className="bhoomi-btn-arrow"></span>
            </button>

            <button className="bhoomi-btn-secondary-v2" onClick={onScrollToSteps}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                <polygon points="10 8 16 12 10 16 10 8" />
              </svg>
              <span>{t('hero.btn.howItWorks')}</span>
            </button>
          </div>

          {/* Trust Badges Row */}
          <div className="bhoomi-trust-row">
            <div className="bhoomi-trust-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.4">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span>Fast &amp; Accurate</span>
            </div>

            <div className="bhoomi-trust-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.4">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Secure &amp; Private</span>
            </div>

            <div className="bhoomi-trust-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
              <span>Built for a Smarter India</span>
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN: Vintage Paper -> Digital Card Comparison ── */}
        <div className="bhoomi-hero-right">
          <div className="bhoomi-visual-wrapper">
            
            {/* Background glowing organic blob */}
            <div className="bhoomi-glow-blob" />

            {/* Vintage Paper Document */}
            <div className="bhoomi-vintage-paper" title="Scanned physical land document">
              <div className="vintage-paper-header">
                <span className="vintage-stamp">तहसील कार्यालय</span>
                <h4 className="vintage-title">ज़मीन का खसरा</h4>
                <span className="vintage-sub">Jamabandi / Patwari Register</span>
              </div>
              <div className="vintage-paper-lines">
                <div className="vintage-row">
                  <span className="v-lbl">खाता सं.:</span>
                  <span className="v-val">४२/०८ (1984)</span>
                </div>
                <div className="vintage-row">
                  <span className="v-lbl">काश्तकार:</span>
                  <span className="v-val">{sampleOwnerName}</span>
                </div>
                <div className="vintage-row">
                  <span className="v-lbl">रकबा / बीघा:</span>
                  <span className="v-val">2.50 एकड़ (सिंचित)</span>
                </div>
                <div className="vintage-table-sim">
                  <div className="v-col">खसरा नं.</div>
                  <div className="v-col">तहसील</div>
                  <div className="v-col">लगान</div>
                  <div className="v-col">67/3</div>
                  <div className="v-col">मोहाली</div>
                  <div className="v-col">₹ 14.50</div>
                </div>
              </div>
              <div className="vintage-bottom-stamp">
                <span>मोहर राजस्व विभाग ✓</span>
              </div>
            </div>

            {/* Curved Connecting Arrow with text */}
            <div className="bhoomi-transition-arrow">
              <span className="transition-text">From paper...<br />to progress</span>
              <svg width="60" height="36" viewBox="0 0 60 36" fill="none">
                <path d="M4 8 C 24 32, 42 28, 56 16" stroke="#166534" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="3 3" />
                <path d="M50 14 L 56 16 L 53 22" stroke="#166534" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Modern Processed Digital Record Card */}
            <div className="bhoomi-digital-card">
              {/* Card Header */}
              <div className="digital-card-header">
                <img src="/bhoomintelli-icon.png" alt="" className="digital-header-brand-icon" />
                <span className="digital-header-text">Document Processed Successfully</span>
              </div>

              {/* Status Verification Pills */}
              <div className="digital-pills-row">
                <span className="digital-status-pill">✓ OCR</span>
                <span className="digital-status-pill">✓ Validation</span>
                <span className="digital-status-pill">✓ Structuring</span>
                <span className="digital-status-pill verified">✓ Verified</span>
              </div>

              {/* Extracted Details Box */}
              <div className="digital-extracted-box">
                <div className="digital-box-title">Extracted Land Record</div>
                <div className="digital-details-table">
                  <div className="detail-row">
                    <span className="detail-label">Landowner Name</span>
                    <span className="detail-sep">:</span>
                    <span className="detail-value highlight">{sampleOwnerName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Plot Area</span>
                    <span className="detail-sep">:</span>
                    <span className="detail-value">2.50 Acre</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">District</span>
                    <span className="detail-sep">:</span>
                    <span className="detail-value">Mohali</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Registration No.</span>
                    <span className="detail-sep">:</span>
                    <span className="detail-value">12345</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Survey No.</span>
                    <span className="detail-sep">:</span>
                    <span className="detail-value">67/3</span>
                  </div>
                </div>
              </div>

              {/* Bottom Verified Badge */}
              <div className="digital-card-footer">
                <div className="verified-success-pill">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="m5 12 5 5L20 7" />
                  </svg>
                  <span>Verified</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
