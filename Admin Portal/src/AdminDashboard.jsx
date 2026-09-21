import { useState, useRef, useEffect } from 'react'
import DashboardHome from './pages/DashboardHome.jsx'
import RecordsPage from './pages/RecordsPage.jsx'
import UsersPage from './pages/UsersPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import AnalyticsPage from './pages/AnalyticsPage.jsx'

const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: 'records',
    label: 'Records',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    id: 'users',
    label: 'Users',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
]

export default function AdminDashboard({ user, onLogout }) {
  const [activePage, setActivePage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      type: 'discrepancy',
      title: 'Discrepancy Alert: Parv Jain (Deed-142)',
      desc: 'Citizen altered plot area from 2.10 Ha to 2.40 Ha. Urgent audit required.',
      time: '12 mins ago',
      unread: true,
      recordId: 'REC-28452',
      badge: 'Discrepancy',
      badgeClass: 'red'
    },
    {
      id: 'notif-2',
      type: 'review',
      title: 'New Submission: Sunita Devi (Khatauni)',
      desc: 'Record REC-28450 for Varanasi District uploaded and queued for audit.',
      time: '1 hour ago',
      unread: true,
      recordId: 'REC-28450',
      badge: 'New Upload',
      badgeClass: 'yellow'
    },
    {
      id: 'notif-3',
      type: 'dispute',
      title: 'Disputed Survey Claim: Priya Patel',
      desc: 'Overlapping survey claim on Khasra 22/5 in Ahmedabad, Gujarat.',
      time: '3 hours ago',
      unread: true,
      recordId: 'REC-28448',
      badge: 'Disputed',
      badgeClass: 'red'
    },
    {
      id: 'notif-4',
      type: 'system',
      title: 'Cadastral Registry Sync Complete',
      desc: '1,420 land records successfully verified & synced with state nodes.',
      time: '5 hours ago',
      unread: false,
      badge: 'System',
      badgeClass: 'green'
    }
  ])

  const notifRef = useRef(null)

  // Click outside to close notification dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false)
      }
    }
    if (notificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [notificationsOpen])

  const unreadCount = notifications.filter(n => n.unread).length

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  }

  const handleNotificationClick = (notif) => {
    // Mark this specific notification as read
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, unread: false } : n))
    setNotificationsOpen(false)
    // If it relates to a record, open the records page
    if (notif.recordId) {
      setActivePage('records')
    }
  }

  const pageTitle = NAV_ITEMS.find(item => item.id === activePage)?.label || 'Dashboard'

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardHome user={user} />
      case 'records':   return <RecordsPage />
      case 'users':     return <UsersPage />
      case 'settings':  return <SettingsPage user={user} />
      case 'analytics': return <AnalyticsPage />
      default:          return <DashboardHome user={user} />
    }
  }

  return (
    <div className="admin-layout">

      {/* ── Mobile Overlay ── */}
      <div
        className={`admin-sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* ── Sidebar ── */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>

        {/* Brand */}
        <div className="admin-sidebar-brand">
          <img src="/bhoomintelli-icon.png" alt="BhoomiIntelli" className="admin-sidebar-logo" />
          <div className="admin-sidebar-brand-text">
            <span className="admin-sidebar-brand-name">BhoomiIntelli</span>
            <span className="admin-sidebar-brand-label">Admin Portal</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="admin-sidebar-nav">
          <span className="admin-sidebar-section-label">Main Menu</span>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`admin-nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => {
                setActivePage(item.id)
                setSidebarOpen(false)
              }}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="admin-sidebar-footer">
          <button className="admin-sidebar-logout" onClick={onLogout}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <main className="admin-main">

        {/* Top Bar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            {/* Mobile hamburger */}
            <button
              className="admin-hamburger"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <h2 className="admin-topbar-title">{pageTitle}</h2>
          </div>

          <div className="admin-topbar-right">
            {/* ── Notification Bell with Dropdown ── */}
            <div className="admin-notif-wrapper" ref={notifRef}>
              <button 
                className={`admin-topbar-bell ${notificationsOpen ? 'active' : ''}`} 
                title="Notifications"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="Notifications"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadCount > 0 && (
                  <span className="admin-topbar-bell-dot">
                    <span className="admin-bell-ping" />
                  </span>
                )}
              </button>

              {/* Dropdown Menu */}
              {notificationsOpen && (
                <div className="admin-notif-dropdown">
                  <div className="admin-notif-header">
                    <div className="admin-notif-title-row">
                      <span className="admin-notif-heading">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="admin-notif-count-badge">{unreadCount} new</span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button className="admin-notif-mark-read" onClick={markAllAsRead}>
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="admin-notif-list">
                    {notifications.length === 0 ? (
                      <div className="admin-notif-empty">No notifications right now.</div>
                    ) : (
                      notifications.map(notif => (
                        <div 
                          key={notif.id} 
                          className={`admin-notif-item ${notif.unread ? 'unread' : ''}`}
                          onClick={() => handleNotificationClick(notif)}
                        >
                          <div className="admin-notif-item-top">
                            <span className={`admin-notif-tag ${notif.badgeClass}`}>
                              {notif.badge}
                            </span>
                            <span className="admin-notif-time">{notif.time}</span>
                          </div>
                          <h4 className="admin-notif-item-title">{notif.title}</h4>
                          <p className="admin-notif-item-desc">{notif.desc}</p>
                          {notif.recordId && (
                            <div className="admin-notif-action-hint">
                              Click to view in Audit Registry ➔
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  <div className="admin-notif-footer">
                    <button 
                      className="admin-notif-footer-btn"
                      onClick={() => {
                        setActivePage('records')
                        setNotificationsOpen(false)
                      }}
                    >
                      View All Records in Audit Registry
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Admin User Pill */}
            <div className="admin-topbar-user">
              <div className="admin-topbar-avatar">
                {(user?.name?.[0] || 'A').toUpperCase()}
              </div>
              <div className="admin-topbar-user-info">
                <span className="admin-topbar-user-name">{user?.name || 'Admin'}</span>
                <span className="admin-topbar-user-role">{user?.role || 'Administrator'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="admin-content" key={activePage}>
          {renderPage()}
        </div>
      </main>
    </div>
  )
}
