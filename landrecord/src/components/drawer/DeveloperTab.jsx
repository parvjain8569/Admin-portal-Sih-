import React from 'react'

export default function DeveloperTab() {
  return (
    <div className="bhoomi-tab-content fade-in">
      <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
        <img 
          src="/bhoomintelli-icon.png" 
          alt="BhoomIntelli Logo" 
          style={{ width: '80px', height: '80px', marginBottom: '1rem' }} 
        />
        <h3 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '0.5rem' }}>
          Developed by AI
        </h3>
        <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
          This application was built with the assistance of advanced AI agents, designed to create a robust, secure, and modern property record management system.
        </p>

        <div style={{ 
          background: '#f8fafc', 
          border: '1px solid #e2e8f0', 
          borderRadius: '12px', 
          padding: '1.5rem',
          textAlign: 'left'
        }}>
          <h4 style={{ color: '#334155', fontSize: '1.1rem', marginBottom: '1rem' }}>
            Key Features Implemented:
          </h4>
          <ul style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.8', paddingLeft: '1.2rem', margin: 0 }}>
            <li>Advanced UI with responsive design</li>
            <li>Secure Authentication & e-KYC flow</li>
            <li>Global "Dev Mode" autofill system</li>
            <li>Session Timeout Management</li>
            <li>Property specific record tracking</li>
            <li>Multilingual support (i18n ready)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
