export default function SettingsPage({ user }) {
  const profileFields = [
    { label: 'Full Name', value: user?.name || 'Admin' },
    { label: 'Email Address', value: user?.email || 'admin@bhoomintelli.in' },
    { label: 'Phone Number', value: user?.phone || '+91 98765 43210' },
    { label: 'Role', value: user?.role || 'Super Admin' },
    { label: 'Department', value: user?.department || 'Land Records Division' },
    { label: 'Date Joined', value: user?.joinDate || '15 Jan 2025' },
  ]

  return (
    <div className="admin-settings-grid">
      {/* Profile Card */}
      <div className="admin-settings-card full-width">
        <h3 className="admin-settings-card-title">Admin Profile</h3>

        <div className="admin-profile-header">
          <div className="admin-profile-avatar-lg">
            {(user?.name?.[0] || 'A').toUpperCase()}
          </div>
          <div className="admin-profile-info">
            <h4 className="admin-profile-name">{user?.name || 'Admin'}</h4>
            <p className="admin-profile-email">{user?.email || 'admin@bhoomintelli.in'} · {user?.role || 'Super Admin'}</p>
          </div>
        </div>

        <div className="admin-settings-form">
          {profileFields.map((field, i) => (
            <div className="admin-settings-row" key={i}>
              <span className="admin-settings-label">{field.label}</span>
              <div className="admin-settings-value">{field.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* System Info */}
      <div className="admin-settings-card">
        <h3 className="admin-settings-card-title">System Information</h3>
        <div className="admin-settings-form">
          <div className="admin-settings-row">
            <span className="admin-settings-label">Platform</span>
            <div className="admin-settings-value">BhoomiIntelli v1.0.0</div>
          </div>
          <div className="admin-settings-row">
            <span className="admin-settings-label">Environment</span>
            <div className="admin-settings-value">Development (Prototype)</div>
          </div>
          <div className="admin-settings-row">
            <span className="admin-settings-label">Frontend</span>
            <div className="admin-settings-value">React 19 + Vite 8</div>
          </div>
          <div className="admin-settings-row">
            <span className="admin-settings-label">Backend</span>
            <div className="admin-settings-value">Node.js + Express</div>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="admin-settings-card">
        <h3 className="admin-settings-card-title">Security</h3>
        <div className="admin-settings-form">
          <div className="admin-settings-row">
            <span className="admin-settings-label">Authentication</span>
            <div className="admin-settings-value">Email + Password (Client-Side)</div>
          </div>
          <div className="admin-settings-row">
            <span className="admin-settings-label">Session</span>
            <div className="admin-settings-value">localStorage (Prototype)</div>
          </div>
          <div className="admin-settings-row">
            <span className="admin-settings-label">Account Lockout</span>
            <div className="admin-settings-value">3 failed attempts → 30s cooldown</div>
          </div>
          <div className="admin-settings-row">
            <span className="admin-settings-label">Dev Mode</span>
            <div className="admin-settings-value">
              {localStorage.getItem('adminDevMode') === 'true' ? '✅ Enabled' : '❌ Disabled'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
