import React from 'react'
import { useLanguage } from '../i18n/LanguageContext'

// MyRecordsSection: Displays the user's digitized land record ledger
// Each record shows owner, parcel ID, date, filename, status badge, and a "View Record" trigger
export default function MyRecordsSection({ records, onUpload, onViewRecord }) {
  const { t } = useLanguage()
  return (
    <main className="bhoomi-my-records-section">

      {/* Header: Title + Upload New Document button */}
      <div className="bhoomi-my-records-header">
        <div>
          <h1 className="bhoomi-records-title">{t('records.title')}</h1>
          <p className="bhoomi-records-subtitle">{t('records.subtitle')}</p>
        </div>
        <button className="btn-upload-primary" onClick={onUpload}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
            <path d="M12 12v9"></path>
            <path d="m8 16 4-4 4 4"></path>
          </svg>
          {t('records.uploadNew')}
        </button>
      </div>

      {/* Records List */}
      <div className="bhoomi-records-card">
        {records.map((rec) => (
          <div
            key={rec.id}
            className={`bhoomi-record-item ${rec.isNew ? 'newly-added' : ''}`}
          >
            {/* Left: owner name, parcel ID, date, filename */}
            <div className="bhoomi-record-left">
              <h3 className="bhoomi-record-owner">
                {rec.ownerName}
                {rec.isNew && (
                  <span style={{ fontSize: '11px', background: '#dcfce7', color: '#15803d', padding: '2px 7px', borderRadius: '4px', fontWeight: 600 }}>
                    {t('records.justUploaded')}
                  </span>
                )}
              </h3>
              <p className="bhoomi-record-meta">
                {t('records.parcelId')}: {rec.parcelId} · {rec.date}
              </p>
              {rec.documentName && (
                <span className="bhoomi-record-filename-tag">
                  📄 {rec.documentName} {rec.fileSize ? `(${rec.fileSize})` : ''}
                </span>
              )}
            </div>

            {/* Right: Status badge + View Record button */}
            <div className="bhoomi-record-right">
              {rec.status === 'Verified' ? (
                <span className="status-pill status-pill-verified">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="9 12 11 14 15 10"></polyline>
                  </svg>
                  {t('records.verified')}
                </span>
              ) : (
                <span className="status-pill status-pill-review">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  {t('records.needsReview')}
                </span>
              )}

              <button className="btn-view-record" onClick={() => onViewRecord(rec)}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                {t('records.viewRecord')}
              </button>
            </div>
          </div>
        ))}
      </div>

    </main>
  )
}
