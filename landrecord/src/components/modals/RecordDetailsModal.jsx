import { useLanguage } from '../../i18n/LanguageContext'

export default function RecordDetailsModal({
  isOpen,
  onClose,
  isProcessing,
  lastUploadedDoc,
  selectedRecord,
  onNavigateToRecords,
}) {
  const { t } = useLanguage()
  if (!isOpen) return null

  return (
    <div className="bhoomi-modal-overlay" onClick={() => !isProcessing && onClose()}>
      <div className="bhoomi-modal" onClick={(e) => e.stopPropagation()}>
        <div className="bhoomi-modal-header">
          <h3 className="bhoomi-modal-title">
            {isProcessing ? t('recordDetails.processingTitle') : t('recordDetails.verifiedTitle')}
          </h3>
          {!isProcessing && (
            <button className="bhoomi-modal-close" onClick={onClose} aria-label="Close modal">
              ✕
            </button>
          )}
        </div>

        {isProcessing ? (
          <div className="bhoomi-upload-status">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#16a34a"
              strokeWidth="2.5"
              style={{ animation: 'spin 1s linear infinite' }}
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14.5px', color: '#111827' }}>
                {t('recordDetails.reading')} {lastUploadedDoc?.name}
              </div>
              <div style={{ fontSize: '13px', color: '#4b5563' }}>
                {t('recordDetails.extracting')}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div
              className="bhoomi-upload-status"
              style={{
                backgroundColor: selectedRecord?.status === 'Verified' ? '#ecfdf5' : '#fffbeb',
                borderColor: selectedRecord?.status === 'Verified' ? '#a7f3d0' : '#fde68a',
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke={selectedRecord?.status === 'Verified' ? '#16a34a' : '#d97706'}
                strokeWidth="2.5"
              >
                {selectedRecord?.status === 'Verified' ? (
                  <>
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="9 12 11 14 15 10"></polyline>
                  </>
                ) : (
                  <>
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </>
                )}
              </svg>
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: '14.5px',
                    color: selectedRecord?.status === 'Verified' ? '#166534' : '#92400e',
                  }}
                >
                  {selectedRecord?.status === 'Verified'
                    ? t('recordDetails.verifiedStatus')
                    : t('recordDetails.pendingStatus')}
                </div>
                <div
                  style={{
                    fontSize: '12.5px',
                    color: selectedRecord?.status === 'Verified' ? '#15803d' : '#b45309',
                  }}
                >
                  {selectedRecord?.status === 'Verified'
                    ? t('recordDetails.verifiedDesc')
                    : t('recordDetails.pendingDesc')}
                </div>
              </div>
            </div>

            {selectedRecord && (
              <div className="bhoomi-doc-details">
                <div className="bhoomi-doc-row">
                  <span style={{ color: '#6b7280' }}>{t('recordDetails.docFile')}:</span>
                  <strong style={{ color: '#111827' }}>
                    {selectedRecord.documentName || 'land_record.pdf'}
                  </strong>
                </div>
                <div className="bhoomi-doc-row">
                  <span style={{ color: '#6b7280' }}>{t('recordDetails.ownerName')}:</span>
                  <strong style={{ color: '#111827' }}>{selectedRecord.ownerName}</strong>
                </div>
                <div className="bhoomi-doc-row">
                  <span style={{ color: '#6b7280' }}>{t('recordDetails.parcelId')}:</span>
                  <strong style={{ color: '#111827' }}>{selectedRecord.parcelId}</strong>
                </div>
                <div className="bhoomi-doc-row">
                  <span style={{ color: '#6b7280' }}>{t('recordDetails.khasra')}:</span>
                  <strong style={{ color: '#111827' }}>{selectedRecord.khasraNo}</strong>
                </div>
                <div className="bhoomi-doc-row">
                  <span style={{ color: '#6b7280' }}>{t('recordDetails.location')}:</span>
                  <strong style={{ color: '#111827' }}>
                    {selectedRecord.village ? `${selectedRecord.village}, ` : ''}{selectedRecord.tehsil ? `${selectedRecord.tehsil}, ` : ''}{selectedRecord.district}, {selectedRecord.state}
                  </strong>
                </div>
                {selectedRecord.khatouniNo && (
                  <div className="bhoomi-doc-row">
                    <span style={{ color: '#6b7280' }}>Khatouni No:</span>
                    <strong style={{ color: '#111827' }}>{selectedRecord.khatouniNo}</strong>
                  </div>
                )}
                <div className="bhoomi-doc-row">
                  <span style={{ color: '#6b7280' }}>{t('recordDetails.totalArea')}:</span>
                  <strong style={{ color: '#111827' }}>{selectedRecord.area}</strong>
                </div>
                <div className="bhoomi-doc-row">
                  <span style={{ color: '#6b7280' }}>Dispute Status:</span>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: selectedRecord.disputeStatus === 'Clear' ? '#dcfce7' : '#fef3c7',
                    color: selectedRecord.disputeStatus === 'Clear' ? '#15803d' : '#b45309'
                  }}>
                    ✓ {selectedRecord.disputeStatus || 'Clear'}
                  </span>
                </div>
                {selectedRecord.digitalHash && (
                  <div className="bhoomi-doc-row" style={{ alignItems: 'flex-start' }}>
                    <span style={{ color: '#6b7280' }}>Cryptographic Hash:</span>
                    <span style={{
                      fontFamily: 'monospace',
                      fontSize: '11px',
                      background: '#f1f5f9',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      color: '#0f172a',
                      wordBreak: 'break-all',
                      maxWidth: '240px'
                    }}>
                      🔒 {selectedRecord.digitalHash}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {selectedRecord?.documentUrl && (
                <a
                  href={selectedRecord.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-how-it-works-downward"
                  style={{ flex: '1 1 100%', justifyContent: 'center', textDecoration: 'none', background: '#f0fdf4', color: '#15803d', borderColor: '#86efac' }}
                >
                  🔗 View Stored Document (Supabase)
                </a>
              )}
              <button
                className="btn-upload-primary"
                style={{ flex: '1 1 180px', justifyContent: 'center' }}
                onClick={() => {
                  alert(t('recordDetails.downloadAlert').replace('{id}', selectedRecord?.parcelId))
                  onClose()
                }}
              >
                {t('recordDetails.downloadCert')}
              </button>
              <button
                className="btn-how-it-works-downward"
                style={{ flex: '1 1 140px', justifyContent: 'center' }}
                onClick={() => {
                  onClose()
                  if (onNavigateToRecords) onNavigateToRecords()
                }}
              >
                {t('recordDetails.goRecords')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
