import { useState, useEffect } from 'react'
import { getLandRecords } from '../lib/index.js'


export default function DashboardHome({ user }) {
  const [totalRecords, setTotalRecords] = useState('0')
  const [pendingReview, setPendingReview] = useState('0')
  const [verified, setVerified] = useState('0')

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getLandRecords()
        setTotalRecords(data.length.toString())
        setPendingReview(data.filter(r => r.status === 'Under Review' || r.status === 'Pending').length.toString())
        setVerified(data.filter(r => r.status === 'Verified' || r.status === 'Good').length.toString())
      } catch (err) {
        console.error("Error fetching stats:", err)
      }
    }
    fetchStats()
  }, [])

  const stats = [
    {
      label: 'Total Records',
      value: totalRecords,
      change: '+12.5%',
      direction: 'up',
      colorClass: 'green',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      ),
    },
    {
      label: 'Pending Review',
      value: pendingReview,
      change: '-3.2%',
      direction: 'down',
      colorClass: 'amber',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      label: 'Verified',
      value: verified,
      change: '+8.1%',
      direction: 'up',
      colorClass: 'blue',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    {
      label: 'Active Users',
      value: '1,206',
      change: '+5.7%',
      direction: 'up',
      colorClass: 'purple',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
  ]

  const recentActivity = [
    { text: '<strong>Ravi Sharma</strong> uploaded a new land record — <strong>Khasra 45/2, Gurugram</strong>', time: '2 min ago', color: 'green' },
    { text: '<strong>System</strong> verified record <strong>REC-28451</strong> via blockchain', time: '15 min ago', color: 'blue' },
    { text: '<strong>Priya Patel</strong> registered a new account', time: '1 hr ago', color: 'purple' },
    { text: 'Record <strong>REC-28432</strong> flagged for manual review', time: '2 hrs ago', color: 'amber' },
    { text: '<strong>Admin</strong> approved 12 pending records in bulk', time: '3 hrs ago', color: 'green' },
    { text: 'Record <strong>REC-28410</strong> rejected — document mismatch detected', time: '5 hrs ago', color: 'red' },
  ]

  return (
    <>
      {/* ── Welcome Banner ── */}
      <div className="admin-welcome-banner">
        <h2 className="admin-welcome-title">
          Welcome back, {user?.name || 'Admin'} 👋
        </h2>
        <p className="admin-welcome-sub">
          Here's an overview of land record activity across the BhoomiIntelli platform.
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="admin-stats-grid">
        {stats.map((stat, i) => (
          <div className="admin-stat-card" key={i}>
            <div className={`admin-stat-icon ${stat.colorClass}`}>
              {stat.icon}
            </div>
            <div className="admin-stat-info">
              <span className="admin-stat-label">{stat.label}</span>
              <span className="admin-stat-value">{stat.value}</span>
              <span className={`admin-stat-change ${stat.direction}`}>
                {stat.direction === 'up' ? '↑' : '↓'} {stat.change} this month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Recent Activity ── */}
      <div className="admin-section-card">
        <div className="admin-section-header">
          <h3 className="admin-section-title">Recent Activity</h3>
          <span className="admin-section-badge">{recentActivity.length} events</span>
        </div>
        <ul className="admin-activity-list">
          {recentActivity.map((item, i) => (
            <li className="admin-activity-item" key={i}>
              <span className={`admin-activity-dot ${item.color}`} />
              <span
                className="admin-activity-text"
                dangerouslySetInnerHTML={{ __html: item.text }}
              />
              <span className="admin-activity-time">{item.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
