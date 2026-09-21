import { useState } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'

export default function NotificationsTab({ notifications, onMarkAllRead }) {
  const { t } = useLanguage()
  const [filter, setFilter] = useState('all') // 'all' | 'processing' | 'status' | 'decision'

  const filtered = notifications.filter(
    (n) => filter === 'all' || n.type === filter
  )

  return (
    <div>
      {/* Filter Pills with clean realistic SVG icons */}
      <div className="notif-filter-bar">
        <button
          className={`notif-filter-pill ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          {t('notifications.all')} ({notifications.length})
        </button>

        <button
          className={`notif-filter-pill ${filter === 'processing' ? 'active' : ''}`}
          onClick={() => setFilter('processing')}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <line x1="10" y1="9" x2="8" y2="9" />
          </svg>
          <span>{t('notifications.processing')}</span>
        </button>

        <button
          className={`notif-filter-pill ${filter === 'status' ? 'active' : ''}`}
          onClick={() => setFilter('status')}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
          <span>{t('notifications.verification')}</span>
        </button>

        <button
          className={`notif-filter-pill ${filter === 'decision' ? 'active' : ''}`}
          onClick={() => setFilter('decision')}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 3h5v5" />
            <path d="M8 3H3v5" />
            <path d="M12 22V8" />
            <path d="M4 12l4-4 4 4" />
            <path d="M20 12l-4-4-4 4" />
          </svg>
          <span>{t('notifications.decision')}</span>
        </button>
      </div>

      {/* Notification List */}
      <div className="notif-list">
        {filtered.map((n) => (
          <div key={n.id} className={`notif-item ${n.unread ? 'unread' : ''}`}>
            <div
              className="notif-icon-circle"
              style={{
                backgroundColor:
                  n.type === 'decision' ? '#fef3c7' : n.type === 'status' ? '#dcfce7' : '#e0e7ff',
                color:
                  n.type === 'decision' ? '#d97706' : n.type === 'status' ? '#15803d' : '#4338ca',
              }}
            >
              {n.type === 'decision' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 3h5v5" />
                  <path d="M8 3H3v5" />
                  <path d="M12 22V8" />
                  <path d="M4 12l4-4 4 4" />
                  <path d="M20 12l-4-4-4 4" />
                </svg>
              ) : n.type === 'status' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              )}
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div className="notif-title-row">
                <h4 className="notif-title">{n.title}</h4>
                <span className="notif-time">{n.time}</span>
              </div>
              <p className="notif-message">{n.message}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button className="btn-view-record" onClick={onMarkAllRead}>
          ✓ {t('notifications.markAllRead')}
        </button>
      </div>
    </div>
  )
}
