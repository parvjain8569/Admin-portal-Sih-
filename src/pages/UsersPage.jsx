import { useState } from 'react'

const MOCK_USERS = [
  { id: 1, name: 'Ravi Sharma', email: 'ravi.sharma@gmail.com', phone: '+91 98765 43210', district: 'Gurugram', state: 'Haryana', role: 'User', status: 'Active', joined: '12 Sep 2026' },
  { id: 2, name: 'Priya Patel', email: 'priya.patel@gmail.com', phone: '+91 87654 32109', district: 'Ahmedabad', state: 'Gujarat', role: 'User', status: 'Active', joined: '17 Sep 2026' },
  { id: 3, name: 'Admin', email: 'admin@bhoomintelli.in', phone: '+91 98765 43210', district: 'New Delhi', state: 'Delhi', role: 'Admin', status: 'Active', joined: '15 Jan 2025' },
  { id: 4, name: 'Sunita Devi', email: 'sunita.devi@yahoo.com', phone: '+91 76543 21098', district: 'Faridabad', state: 'Haryana', role: 'User', status: 'Active', joined: '18 Sep 2026' },
  { id: 5, name: 'Mohammad Khan', email: 'mkhan@outlook.com', phone: '+91 65432 10987', district: 'Lucknow', state: 'Uttar Pradesh', role: 'Reviewer', status: 'Active', joined: '10 Aug 2026' },
  { id: 6, name: 'Arjun Singh', email: 'arjun.s@gmail.com', phone: '+91 54321 09876', district: 'Jaipur', state: 'Rajasthan', role: 'User', status: 'Active', joined: '16 Sep 2026' },
  { id: 7, name: 'Lakshmi Nair', email: 'lakshmi.n@gmail.com', phone: '+91 43210 98765', district: 'Kochi', state: 'Kerala', role: 'Reviewer', status: 'Active', joined: '05 Jul 2026' },
  { id: 8, name: 'Deepak Verma', email: 'deepak.v@hotmail.com', phone: '+91 32109 87654', district: 'Bhopal', state: 'Madhya Pradesh', role: 'User', status: 'Active', joined: '15 Sep 2026' },
]

export default function UsersPage() {
  const [search, setSearch] = useState('')

  const filtered = MOCK_USERS.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  )

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'Admin':    return 'admin-role'
      case 'Reviewer': return 'reviewer-role'
      default:         return 'user-role'
    }
  }

  return (
    <div className="admin-section-card">
      {/* Toolbar */}
      <div className="admin-table-toolbar">
        <div className="admin-search-wrap">
          <svg className="admin-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="admin-search-input"
            type="text"
            placeholder="Search users by name, email, or role…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="admin-table-count">{filtered.length} user{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>District</th>
              <th>State</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="admin-table-empty">
                  No users found matching your search.
                </td>
              </tr>
            ) : (
              filtered.map(u => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td style={{ color: '#64748b' }}>{u.email}</td>
                  <td style={{ color: '#64748b' }}>{u.phone}</td>
                  <td>{u.district}</td>
                  <td>{u.state}</td>
                  <td>
                    <span className={`admin-badge ${getRoleBadgeClass(u.role)}`}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ color: '#94a3b8' }}>{u.joined}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
