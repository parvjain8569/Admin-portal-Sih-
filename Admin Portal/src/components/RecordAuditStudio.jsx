import { useState } from 'react'

export default function RecordAuditStudio({ record, onBack, onUpdateRecord }) {
  // Current admin verification state for fields
  const [fields, setFields] = useState(record.fields || [])
  const [overallStatus, setOverallStatus] = useState(record.status || 'Under Review')
  const [adminNotes, setAdminNotes] = useState(record.adminNotes || '')
  const [activeHighlight, setActiveHighlight] = useState(null)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [notificationSent, setNotificationSent] = useState(false)
  const [sealSuccess, setSealSuccess] = useState(false)
  const [editingFieldId, setEditingFieldId] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [mobileTab, setMobileTab] = useState('matrix') // 'document' | 'ocr' | 'matrix'

  // Handle field admin action (Pass, Flag, Edit)
  const handleFieldDecision = (id, decision) => {
    setFields(prev => prev.map(f => {
      if (f.id === id) {
        return { ...f, adminDecision: decision }
      }
      return f
    }))
  }

  const startEditField = (f) => {
    setEditingFieldId(f.id)
    setEditValue(f.adminOverrideValue || f.citizenValue || f.ocrValue)
  }

  const saveEditField = (id) => {
    setFields(prev => prev.map(f => {
      if (f.id === id) {
        return { ...f, adminOverrideValue: editValue, adminDecision: 'EDITED' }
      }
      return f
    }))
    setEditingFieldId(null)
  }

  // Handle final verdict actions
  const handleApproveAndSeal = () => {
    setOverallStatus('Good')
    setSealSuccess(true)
    const updated = {
      ...record,
      status: 'Good',
      adminNotes,
      fields,
      lastAudited: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    }
    onUpdateRecord(updated)
    setTimeout(() => setSealSuccess(false), 3000)
  }

  const handleFlagDiscrepancy = () => {
    setOverallStatus('High Risk')
    setShowNotificationModal(true)
  }

  const confirmSendNotice = () => {
    const updated = {
      ...record,
      status: 'High Risk',
      adminNotes,
      fields,
      noticeSent: true,
      lastAudited: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    }
    onUpdateRecord(updated)
    setNotificationSent(true)
    setTimeout(() => {
      setNotificationSent(false)
      setShowNotificationModal(false)
    }, 1800)
  }

  const handleRejectRecord = () => {
    setOverallStatus('High Risk')
    const updated = {
      ...record,
      status: 'Rejected',
      adminNotes,
      fields,
      lastAudited: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    }
    onUpdateRecord(updated)
  }

  // Count discrepancy items
  const discrepanciesCount = fields.filter(f => f.hasDiscrepancy || f.citizenAction === 'MODIFIED' || f.citizenAction === 'REJECTED').length

  return (
    <div className="admin-audit-container">
      {/* ── Top Header Toolbar ── */}
      <div className="admin-audit-topbar">
        <div className="admin-audit-topbar-left">
          <button className="admin-audit-back-btn" onClick={onBack} title="Return to records">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Records
          </button>
          <div className="admin-audit-title-block">
            <div className="admin-audit-id-badge">
              <span>{record.id}</span>
              <span className="admin-audit-parcel">{record.parcel}</span>
            </div>
            <h1 className="admin-audit-doc-name">{record.documentType || 'Registered Sale Deed / 7-12 Extract'}</h1>
          </div>
        </div>

        <div className="admin-audit-topbar-right">
          <div className="admin-audit-uploader-info">
            <span className="admin-audit-uploader-label">Citizen / Uploader:</span>
            <strong className="admin-audit-uploader-name">{record.owner}</strong>
            <span className="admin-audit-uploader-date">Uploaded on {record.date}</span>
          </div>

          <div className="admin-audit-status-pill-group">
            <span className="admin-audit-grade-label">Record Grade:</span>
            <div className={`admin-badge large ${
              overallStatus === 'Good' || overallStatus === 'Verified' ? 'verified' :
              overallStatus === 'High Risk' || overallStatus === 'Rejected' ? 'rejected' :
              overallStatus === 'Under Review' ? 'pending' : 'default'
            }`}>
              <span className="admin-badge-dot" />
              {overallStatus === 'Good' ? '🟢 Good / Verified' :
               overallStatus === 'High Risk' ? '🔴 Flagged / High Risk' :
               overallStatus === 'Under Review' ? '🟡 Under Review' : overallStatus}
            </div>
          </div>
        </div>
      </div>

      {/* Discrepancy Alert Banner */}
      {discrepanciesCount > 0 && (
        <div className="admin-audit-alert-banner">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <strong>Discrepancy Detection Alert:</strong> {record.owner} flagged or manually modified {discrepanciesCount} field(s) differing from the AI OCR scan. Please verify against Pane 1 (Original Deed) before sealing.
          </div>
        </div>
      )}

      {/* Success Banner */}
      {sealSuccess && (
        <div className="admin-audit-success-banner">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Record {record.id} successfully verified, digitally signed & stamped as <strong>Good Record (Green)</strong>!
        </div>
      )}

      {/* ── Mobile Viewport Tab Switcher (< 1024px) ── */}
      <div className="admin-audit-mobile-tabs">
        <button
          className={`admin-audit-tab-btn ${mobileTab === 'document' ? 'active' : ''}`}
          onClick={() => setMobileTab('document')}
        >
          📄 1. Original Deed
        </button>
        <button
          className={`admin-audit-tab-btn ${mobileTab === 'ocr' ? 'active' : ''}`}
          onClick={() => setMobileTab('ocr')}
        >
          🤖 2. AI OCR ({fields.length})
        </button>
        <button
          className={`admin-audit-tab-btn ${mobileTab === 'matrix' ? 'active' : ''}`}
          onClick={() => setMobileTab('matrix')}
        >
          ⚖️ 3. Audit Matrix {discrepanciesCount > 0 ? `(${discrepanciesCount} ⚠️)` : ''}
        </button>
      </div>

      {/* ── 3-Column Split View (1/3 : 1/3 : 1/3) ── */}
      <div className="admin-audit-tri-grid">
        
        {/* ══════════════════════════════════════════════════════════
            PANE 1 (1/3 SCREEN): ORIGINAL DOCUMENT VIEWER
           ══════════════════════════════════════════════════════════ */}
        <section className={`admin-audit-pane pane-document mobile-tab-content ${mobileTab === 'document' ? 'mobile-active' : 'mobile-hidden'}`}>
          <div className="admin-audit-pane-header">
            <div className="admin-audit-pane-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span>1. Original Document</span>
            </div>
            
            <div className="admin-audit-zoom-controls">
              <button 
                className="admin-audit-ctrl-btn" 
                onClick={() => setZoomLevel(prev => Math.max(70, prev - 15))}
                title="Zoom Out"
              >
                -
              </button>
              <span className="admin-audit-zoom-text">{zoomLevel}%</span>
              <button 
                className="admin-audit-ctrl-btn" 
                onClick={() => setZoomLevel(prev => Math.min(140, prev + 15))}
                title="Zoom In"
              >
                +
              </button>
              <button 
                className="admin-audit-ctrl-btn" 
                onClick={() => setZoomLevel(100)}
                title="Reset Zoom"
              >
                ↺
              </button>
            </div>
          </div>

          <div className="admin-audit-pane-content doc-canvas-wrap">
            <div className="admin-audit-doc-meta-badge">
              <span>SHA-256: <code>e83b...49f1</code> (Authentic)</span>
              <span>Sub-Registrar: {record.district}, {record.state}</span>
            </div>

            {/* Document Parchment Paper */}
            <div 
              className="admin-audit-paper" 
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            >
              <div className="admin-audit-paper-seal">
                <div className="admin-audit-emblem">सत्यमेव जयते</div>
                <div className="admin-audit-seal-text">GOVERNMENT OF INDIA • REGISTRATION & STAMPS</div>
              </div>

              <div className="admin-audit-paper-heading">
                <h2>DEED OF CONVEYANCE & TITLE TRANSFER</h2>
                <p className="admin-audit-paper-sub">Form 7/12 (Land Registry Act, Section 17)</p>
              </div>

              <div className="admin-audit-paper-body">
                <p className="admin-audit-para">
                  This Registered Deed is executed on this{' '}
                  <span className={`admin-doc-highlight ${activeHighlight === 'date' ? 'active' : ''}`}>
                    {record.docDetails?.date || '12/05/2023'}
                  </span>{' '}
                  at the Office of Sub-Registrar, {record.district}, between the undersigned parties:
                </p>

                <p className="admin-audit-para">
                  <strong>VENDOR (Seller):</strong> Sri{' '}
                  <span className={`admin-doc-highlight ${activeHighlight === 'vendor' ? 'active' : ''}`}>
                    {record.docDetails?.vendor || 'Suresh Kumar'}
                  </span>, Resident of Tehsil {record.district}.
                </p>

                <p className="admin-audit-para">
                  <strong>VENDEE (Buyer / Claimant):</strong> Sri / Smt{' '}
                  <span className={`admin-doc-highlight ${activeHighlight === 'owner' ? 'active' : ''}`}>
                    {record.owner}
                  </span>, S/o Late R.K. Jain, residing at Sector 4.
                </p>

                <div className="admin-audit-paper-divider" />

                <h4 className="admin-audit-paper-section-title">SCHEDULE OF PROPERTY:</h4>
                <div className="admin-audit-prop-grid">
                  <div className="admin-audit-prop-item">
                    <span className="label">Khasra / Survey No:</span>
                    <span className={`value highlight ${activeHighlight === 'khasra' ? 'active' : ''}`}>
                      {record.khasra || '128/3'}
                    </span>
                  </div>

                  <div className="admin-audit-prop-item">
                    <span className="label">Registered Area:</span>
                    <span className={`value highlight ${activeHighlight === 'area' ? 'active' : ''}`}>
                      {record.docDetails?.rawArea || '2.10 Hectares'}
                    </span>
                  </div>

                  <div className="admin-audit-prop-item">
                    <span className="label">Parcel Identifier:</span>
                    <span className={`value highlight ${activeHighlight === 'parcel' ? 'active' : ''}`}>
                      {record.parcel || 'HR-40221'}
                    </span>
                  </div>

                  <div className="admin-audit-prop-item">
                    <span className="label">Mutation Reference:</span>
                    <span className={`value highlight ${activeHighlight === 'mutation' ? 'active' : ''}`}>
                      {record.docDetails?.mutationId || 'MUT-2023-4421'}
                    </span>
                  </div>
                </div>

                <div className="admin-audit-paper-stamps">
                  <div className="admin-audit-stamp-box">
                    <span className="stamp-title">STAMP DUTY PAID</span>
                    <span className="stamp-val">₹ 1,45,000/-</span>
                    <span className="stamp-code">CHQ: #940291</span>
                  </div>
                  <div className="admin-audit-signature-box">
                    <div className="sig-line" />
                    <span>Sub-Registrar Digital Seal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            PANE 2 (1/3 SCREEN): AI OCR EXTRACTED INTELLIGENCE
           ══════════════════════════════════════════════════════════ */}
        <section className={`admin-audit-pane pane-ocr mobile-tab-content ${mobileTab === 'ocr' ? 'mobile-active' : 'mobile-hidden'}`}>
          <div className="admin-audit-pane-header">
            <div className="admin-audit-pane-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span>2. AI OCR Extraction</span>
            </div>
            <span className="admin-audit-ai-pill">Bhoomi-Vision v3.2</span>
          </div>

          <div className="admin-audit-pane-content">
            <div className="admin-audit-ocr-overview">
              <div className="admin-audit-ocr-stat">
                <span className="stat-label">Avg OCR Confidence</span>
                <strong className="stat-val high">{record.ocrConfidence || '94.2%'}</strong>
              </div>
              <div className="admin-audit-ocr-stat">
                <span className="stat-label">Model Time</span>
                <strong className="stat-val">1.28 sec</strong>
              </div>
              <div className="admin-audit-ocr-stat">
                <span className="stat-label">Detected Script</span>
                <strong className="stat-val">English + Hindi</strong>
              </div>
            </div>

            <p className="admin-audit-hint-text">
              Hover over an extracted field to see its bounding box in Pane 1.
            </p>

            <div className="admin-audit-field-list">
              {fields.map(f => (
                <div 
                  key={f.id}
                  className={`admin-audit-ocr-card ${activeHighlight === f.id ? 'highlighted' : ''}`}
                  onMouseEnter={() => setActiveHighlight(f.id)}
                  onMouseLeave={() => setActiveHighlight(null)}
                >
                  <div className="admin-audit-ocr-card-top">
                    <span className="admin-audit-ocr-field-label">{f.label}</span>
                    <span className={`admin-audit-confidence-badge ${
                      f.confidence >= 90 ? 'conf-high' : f.confidence >= 70 ? 'conf-med' : 'conf-low'
                    }`}>
                      {f.confidence}% Conf.
                    </span>
                  </div>

                  <div className="admin-audit-ocr-value-row">
                    <span className="admin-audit-ocr-value">{f.ocrValue}</span>
                  </div>

                  {f.ocrWarning && (
                    <div className="admin-audit-ocr-warning">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      <span>{f.ocrWarning}</span>
                    </div>
                  )}

                  <div className="admin-audit-ocr-meta">
                    <span>Bounding Box: [{f.bbox || 'x:45, y:120, w:310, h:40'}]</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            PANE 3 (1/3 SCREEN): CITIZEN REVIEW & ADMIN AUDIT MATRIX
           ══════════════════════════════════════════════════════════ */}
        <section className={`admin-audit-pane pane-matrix mobile-tab-content ${mobileTab === 'matrix' ? 'mobile-active' : 'mobile-hidden'}`}>
          <div className="admin-audit-pane-header">
            <div className="admin-audit-pane-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <polyline points="16 11 18 13 22 9" />
              </svg>
              <span>3. Citizen Input & Admin Audit</span>
            </div>
            <span className="admin-audit-pane-badge">Decision Matrix</span>
          </div>

          <div className="admin-audit-pane-content">
            <div className="admin-audit-citizen-summary">
              <div className="citizen-avatar">
                {(record.owner?.[0] || 'P').toUpperCase()}
              </div>
              <div className="citizen-info">
                <strong>{record.owner}</strong>
                <span>Citizen Self-Verification Status</span>
              </div>
            </div>

            <div className="admin-audit-matrix-list">
              {fields.map(f => {
                const isMismatch = f.citizenAction === 'MODIFIED' || f.hasDiscrepancy
                const isRejected = f.citizenAction === 'REJECTED'

                return (
                  <div 
                    key={f.id}
                    className={`admin-audit-matrix-card ${
                      isMismatch ? 'card-mismatch' : isRejected ? 'card-rejected' : 'card-accepted'
                    }`}
                  >
                    <div className="admin-audit-matrix-card-header">
                      <span className="matrix-field-name">{f.label}</span>
                      <span className={`citizen-badge ${
                        f.citizenAction === 'ACCEPTED' ? 'badge-acc' :
                        f.citizenAction === 'MODIFIED' ? 'badge-mod' : 'badge-rej'
                      }`}>
                        Citizen: {f.citizenAction || 'ACCEPTED'}
                      </span>
                    </div>

                    {/* Comparison Row */}
                    <div className="admin-audit-comparison-row">
                      <div className="comp-item ocr-side">
                        <span className="comp-label">OCR Extracted:</span>
                        <span className="comp-val">{f.ocrValue}</span>
                      </div>
                      <div className="comp-divider">➔</div>
                      <div className="comp-item citizen-side">
                        <span className="comp-label">Citizen Submitted:</span>
                        <span className={`comp-val ${isMismatch ? 'modified-val' : ''}`}>
                          {f.citizenValue}
                        </span>
                      </div>
                    </div>

                    {/* Show Citizen discrepancy notes */}
                    {isMismatch && (
                      <div className="admin-audit-discrepancy-note">
                        ⚠️ <strong>Discrepancy:</strong> Citizen altered value from <em>"{f.ocrValue}"</em> to <em>"{f.citizenValue}"</em>.
                        {f.citizenRemarks && <div className="user-remark">Citizen note: "{f.citizenRemarks}"</div>}
                      </div>
                    )}

                    {/* Admin Field Override / Inline Editor */}
                    {editingFieldId === f.id ? (
                      <div className="admin-field-editor">
                        <input
                          type="text"
                          className="admin-edit-input"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                        />
                        <button className="admin-edit-save-btn" onClick={() => saveEditField(f.id)}>Save</button>
                        <button className="admin-edit-cancel-btn" onClick={() => setEditingFieldId(null)}>Cancel</button>
                      </div>
                    ) : f.adminOverrideValue ? (
                      <div className="admin-override-callout">
                        <span>Admin Override: <strong>{f.adminOverrideValue}</strong></span>
                      </div>
                    ) : null}

                    {/* Admin Field-Level Decision Buttons */}
                    <div className="admin-field-actions-bar">
                      <span className="admin-action-prompt">Admin Verdict:</span>
                      <div className="admin-action-btn-group">
                        <button
                          className={`admin-action-btn btn-pass ${f.adminDecision === 'PASS' ? 'selected' : ''}`}
                          onClick={() => handleFieldDecision(f.id, 'PASS')}
                          title="Verify and pass this field"
                        >
                          ✓ Pass
                        </button>
                        <button
                          className={`admin-action-btn btn-flag ${f.adminDecision === 'FLAG' ? 'selected' : ''}`}
                          onClick={() => handleFieldDecision(f.id, 'FLAG')}
                          title="Flag this field as suspicious or incorrect"
                        >
                          ⚠️ Flag
                        </button>
                        <button
                          className="admin-action-btn btn-edit"
                          onClick={() => startEditField(f)}
                          title="Manually correct field value"
                        >
                          ✎ Edit
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Admin Audit Notes & Final Verdict Section */}
            <div className="admin-audit-verdict-box">
              <h4 className="admin-verdict-heading">Administrator Verdict & Classification</h4>
              
              <div className="admin-notes-wrap">
                <label className="admin-notes-label">Internal Audit Notes & Observations:</label>
                <textarea
                  className="admin-notes-textarea"
                  rows={3}
                  placeholder="Enter audit remarks (e.g., 'Survey numbers verified with state GIS registry; plot area corrected after physical check')..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>

              {/* Status Grade Selector */}
              <div className="admin-grade-selector-wrap">
                <span className="selector-title">Mark Entire Record Status:</span>
                <div className="admin-grade-buttons">
                  <button
                    className={`grade-btn grade-green ${overallStatus === 'Good' || overallStatus === 'Verified' ? 'active' : ''}`}
                    onClick={() => setOverallStatus('Good')}
                  >
                    🟢 Good Record (Pass)
                  </button>
                  <button
                    className={`grade-btn grade-yellow ${overallStatus === 'Under Review' ? 'active' : ''}`}
                    onClick={() => setOverallStatus('Under Review')}
                  >
                    🟡 Needs Attention
                  </button>
                  <button
                    className={`grade-btn grade-red ${overallStatus === 'High Risk' || overallStatus === 'Rejected' ? 'active' : ''}`}
                    onClick={() => setOverallStatus('High Risk')}
                  >
                    🔴 Flagged / High Risk
                  </button>
                </div>
              </div>

              {/* Final Actions */}
              <div className="admin-final-actions-row">
                <button 
                  className="admin-verdict-btn btn-approve"
                  onClick={handleApproveAndSeal}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Approve & Digitally Sign
                </button>

                <button 
                  className="admin-verdict-btn btn-query"
                  onClick={handleFlagDiscrepancy}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  Issue Notice to {record.owner.split(' ')[0]}
                </button>

                <button 
                  className="admin-verdict-btn btn-reject"
                  onClick={handleRejectRecord}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  Reject Record
                </button>
              </div>
            </div>

          </div>
        </section>

      </div>

      {/* ── Notification Modal ── */}
      {showNotificationModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card">
            <div className="admin-modal-header">
              <h3>Issue Discrepancy Notice to {record.owner}</h3>
              <button className="admin-modal-close" onClick={() => setShowNotificationModal(false)}>✕</button>
            </div>
            
            <div className="admin-modal-body">
              <p>The following discrepancy notification will be dispatched to citizen portal and registered SMS/Email:</p>
              
              <div className="admin-notice-preview">
                <strong>To:</strong> {record.owner} ({record.parcel})<br />
                <strong>Subject:</strong> Clarification Required: Land Record Audit for {record.id}<br />
                <strong>Notice Body:</strong><br />
                <em>
                  "During administrative OCR and Registry verification of your uploaded Deed, a discrepancy was identified (Plot Area difference between 2.10 Ha in deed vs 2.40 Ha claimed). Please upload updated mutation certificate or schedule a physical verification."
                </em>
              </div>

              {notificationSent ? (
                <div className="admin-notice-sent-pill">
                  ✓ Official Discrepancy Notice Issued & Logged!
                </div>
              ) : null}
            </div>

            <div className="admin-modal-footer">
              <button className="admin-btn-secondary" onClick={() => setShowNotificationModal(false)}>Cancel</button>
              <button className="admin-btn-primary" onClick={confirmSendNotice} disabled={notificationSent}>
                {notificationSent ? 'Dispatched...' : 'Send Official Notice & Mark Red'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
