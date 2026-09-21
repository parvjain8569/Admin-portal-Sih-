import { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

// ── Fixed demo document content ───────────────────────────────────────────
const DEMO_DOCUMENT = {
  title: 'Document Review: Deed-142 (Varanasi District)',
  type: 'DEED OF CONVEYANCE',
  body: [
    { text: 'This Deed of Conveyance is made on this ', plain: true },
    { text: '12/05/2023', highlight: 'date', label: 'Date' },
    { text: ' between the parties.', plain: true },
  ],
  parties: [
    { text: 'The Vendor, ', plain: true },
    { text: 'Suresh Kumar', highlight: 'owner', label: 'Owner' },
    { text: ', hereby agrees to sell, transfer and convey the property situated at Varanasi District.', plain: true },
  ],
  propertyLines: [
    { label: 'Khasra Number:', value: '128/3', highlight: 'khasra' },
    { label: 'Plot Area:', value: '2.1 Hectares', highlight: 'area' },
    { label: 'Previous Mutation ID:', value: 'M-341', highlight: 'mutation-old' },
    { label: 'New Mutation Request:', value: 'MUT-2023-4421', highlight: 'mutation-new' },
  ],
}

// ── Fixed AI-extracted fields (no editing state) ──────────────────────────
const INITIAL_FIELDS = [
  { id: 'owner',    label: 'Owner Name',    value: 'Suresh Kumar',   reviewState: 'PENDING' },
  { id: 'khasra',  label: 'Khasra Number', value: '128/3',          reviewState: 'PENDING' },
  { id: 'area',    label: 'Plot Area',     value: '2.1 Hectares',   reviewState: 'PENDING' },
  { id: 'date',    label: 'Deed Date',     value: '12/05/2023',     reviewState: 'PENDING' },
  { id: 'mutation',label: 'Mutation ID',   value: 'MUT-2023-4421',  reviewState: 'PENDING' },
]

const HIGHLIGHT_COLORS = {
  owner:           { bg: '#dcfce7', border: '#86efac', text: '#166534' },
  khasra:          { bg: '#fef9c3', border: '#fde047', text: '#713f12' },
  area:            { bg: '#d1fae5', border: '#6ee7b7', text: '#065f46' },
  date:            { bg: '#fef3c7', border: '#fcd34d', text: '#92400e' },
  'mutation-old':  { bg: '#fee2e2', border: '#fca5a5', text: '#991b1b' },
  'mutation-new':  { bg: '#fce7f3', border: '#f9a8d4', text: '#9d174d' },
}

// ────────────────────────────────────────────────────────────────────────────
export default function DocumentReviewPage({ onBack, uploadedFileName }) {
  const { t } = useLanguage()
  const [fields, setFields] = useState(INITIAL_FIELDS)
  const [submitted, setSubmitted] = useState(false)
  const [activeFieldId, setActiveFieldId] = useState(null)

  const updateField = (id, patch) =>
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)))

  const reviewedCount = fields.filter((f) => f.reviewState !== 'PENDING').length
  const allReviewed = reviewedCount === fields.length

  const handleSubmitReview = () => {
    if (!allReviewed) return
    setSubmitted(true)
  }

  // ── Highlighted inline token ──────────────────────────────────────────────
  const HL = ({ id, children }) => {
    const colors = HIGHLIGHT_COLORS[id] || {}
    return (
      <span
        className={`doc-highlight ${activeFieldId === id ? 'doc-highlight-active' : ''}`}
        style={{ background: colors.bg, borderBottom: `2px solid ${colors.border}`, color: colors.text }}
        onClick={() => setActiveFieldId(id === activeFieldId ? null : id)}
      >
        {children}
      </span>
    )
  }

  return (
    <div className="doc-review-page">
      {/* ── Top bar ── */}
      <div className="doc-review-topbar">
        <button className="doc-back-btn" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          {t('review.backBtn')}
        </button>
        <h1 className="doc-review-title">{DEMO_DOCUMENT.title}</h1>
        {uploadedFileName && (
          <span className="doc-review-filename">📄 {uploadedFileName}</span>
        )}
      </div>

      {submitted ? (
        /* ── Success Screen ── */
        <div className="doc-review-success">
          <div className="doc-success-icon">
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
          </div>
          <h2 className="doc-success-heading">{t('review.successHeading')}</h2>
          <p className="doc-success-sub">{t('review.successSub').replace('{count}', fields.length)}</p>
          <div className="doc-success-badge">
            <strong>{t('review.parcelId')}:</strong> HR-Deed-142 &nbsp;|&nbsp; <strong>{t('review.khasra')}:</strong> 128/3 &nbsp;|&nbsp; <strong>{t('review.owner')}:</strong> Suresh Kumar
          </div>
          <button className="doc-success-back-btn" onClick={onBack}>
            {t('review.backHome')}
          </button>
        </div>
      ) : (
        <div className="doc-review-body">

          {/* ── LEFT: Document Viewer ── */}
          <div className="doc-viewer-panel">
            <div className="doc-viewer-header">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              {t('review.viewerTitle')}
            </div>
            <div className="doc-viewer-content">
              <div className="doc-paper">
                <h2 className="doc-paper-title">{DEMO_DOCUMENT.type}</h2>
                <p className="doc-paper-para">
                  {DEMO_DOCUMENT.body.map((t, i) =>
                    t.plain ? <span key={i}>{t.text}</span> : <HL key={i} id={t.highlight}>{t.text}</HL>
                  )}
                </p>
                <p className="doc-paper-para">
                  {DEMO_DOCUMENT.parties.map((t, i) =>
                    t.plain ? <span key={i}>{t.text}</span> : <HL key={i} id={t.highlight}>{t.text}</HL>
                  )}
                </p>
                <div className="doc-paper-divider" />
                <p className="doc-paper-section-title">{t('review.propDetails')}</p>
                {DEMO_DOCUMENT.propertyLines.map((line) => (
                  <p key={line.highlight} className="doc-paper-property-line">
                    <span className="doc-prop-label">{line.label}</span>{' '}
                    <HL id={line.highlight}>{line.value}</HL>
                  </p>
                ))}
                <div className="doc-paper-sig-row">
                  <div className="doc-sig-block">
                    <div className="doc-sig-line" />
                    <span>{t('review.sigVendor')}</span>
                  </div>
                  <div className="doc-sig-block">
                    <div className="doc-sig-line" />
                    <span>{t('review.sigVendee')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: AI Extracted Fields Panel ── */}
          <div className="doc-fields-panel">
            <div className="doc-fields-header">
              <div className="doc-fields-header-left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                  <polyline points="9 11 12 14 22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
                <span className="doc-fields-title">{t('review.extractedTitle')}</span>
              </div>
              <span className="doc-ai-badge">{t('review.actionAi')}</span>
            </div>

            <div className="doc-fields-progress">
              <span className="doc-fields-progress-text">{reviewedCount}/{fields.length} {t('review.fieldsAccepted')}</span>
              <div className="doc-fields-progress-bar">
                <div
                  className="doc-fields-progress-fill"
                  style={{ width: `${(reviewedCount / fields.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="doc-fields-list">
              {fields.map((field) => (
                <div
                  key={field.id}
                  className={`doc-field-card ${field.reviewState === 'ACCEPTED' ? 'doc-field-accepted' : ''} ${field.reviewState === 'FLAGGED' ? 'doc-field-flagged' : ''} ${activeFieldId === field.id ? 'doc-field-active' : ''}`}
                  onClick={() => setActiveFieldId(field.id === activeFieldId ? null : field.id)}
                >
                  <div className="doc-field-card-top">
                    <span className="doc-field-label">{field.label}</span>
                  </div>

                  <div className="doc-field-value-row">
                    <span className="doc-field-value">{field.value}</span>
                    {field.reviewState !== 'PENDING' && (
                      <span className={`doc-field-status ${field.reviewState === 'ACCEPTED' ? 'status-green' : 'status-red'}`}>
                        {field.reviewState === 'ACCEPTED' ? 'ACCEPTED' : 'FLAGGED'}
                      </span>
                    )}
                  </div>

                  {field.reviewState !== 'PENDING' && (
                    <div className="doc-field-status-row">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill={field.reviewState === 'ACCEPTED' ? '#16a34a' : '#dc2626'} stroke="none">
                        <rect width="24" height="24" rx="3" />
                      </svg>
                      <span style={{ fontSize: '11.5px', color: field.reviewState === 'ACCEPTED' ? '#15803d' : '#991b1b', fontWeight: 500 }}>
                        {field.reviewState === 'ACCEPTED' ? t('review.statusGreen', 'Validated') : t('review.statusRed', 'Flagged')}
                      </span>
                    </div>
                  )}

                  <div className="doc-field-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="doc-field-btn doc-btn-accept"
                      onClick={() => updateField(field.id, { reviewState: 'ACCEPTED' })}
                    >
                      {t('review.accept')}
                    </button>
                    <button
                      className="doc-field-btn doc-btn-flag"
                      onClick={() => updateField(field.id, { reviewState: 'FLAGGED' })}
                    >
                      {t('review.flag')}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="doc-submit-wrap">
              {!allReviewed && (
                <p className="doc-submit-hint">{t('review.submitHint').replace('{count}', fields.length)}</p>
              )}
              <button
                className={`doc-submit-btn ${allReviewed ? 'doc-submit-ready' : 'doc-submit-disabled'}`}
                onClick={handleSubmitReview}
                disabled={!allReviewed}
              >
                {t('review.submitBtn')}
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
