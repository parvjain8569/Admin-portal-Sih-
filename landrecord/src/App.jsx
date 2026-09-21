import { useState } from 'react'
import Login from './login.jsx'
import Website from './website.jsx'
import LanguageSelectModal from './components/modals/LanguageSelectModal.jsx'
import './login.css'
import './App.css'

export default function App() {
  const getDevUser = () => ({
    email: 'dev@bhoomintelli.in',
    name: 'Dev User',
    username: 'devuser',
    aadhaarVerified: true,
    aadhaarDetails: {
      aadhaarNumber: '234567891234',
      formattedAadhaar: '2345 6789 1234',
      maskedAadhaar: 'XXXX XXXX 1234',
      name: 'Dev User',
      dob: '15/06/1995',
      gender: 'Male',
      address: 'Village Khandsa, Gurugram',
      district: 'Gurugram',
      state: 'Haryana',
      pincode: '122001',
      contact: '9876543210',
    }
  })

  // Default to 'website' when opening the site as requested!
  const [currentPage, setCurrentPage] = useState('website')
  const [devMode, setDevMode] = useState(() => {
    try {
      return localStorage.getItem('devMode') === 'true'
    } catch {
      return false
    }
  })
  
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return localStorage.getItem('devMode') === 'true' ? getDevUser() : null
    } catch {
      return null
    }
  })
  
  const [authMode, setAuthMode] = useState('signin') // 'signin' or 'create'
  // Always show language popup modal as soon as website opens so user doesn't have to search for option
  const [showLangModal, setShowLangModal] = useState(true)

  const toggleDevMode = () => {
    const next = !devMode
    setDevMode(next)
    try {
      localStorage.setItem('devMode', String(next))
    } catch {}
    window.dispatchEvent(new Event('devModeChange'))
    
    if (next) {
      handleLoginSuccess(getDevUser())
    } else {
      handleLogout()
    }
  }

  // Called when user clicks "Login" or is asked to login before upload
  const handleOpenLogin = (mode = 'signin') => {
    setAuthMode(mode)
    setCurrentPage('auth')
  }

  // Called when sign in succeeds -> leads to website as authenticated user
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData)
    setCurrentPage('website')
  }

  // Logout handler resets user and stays on website as guest
  const handleLogout = () => {
    setCurrentUser(null)
    setCurrentPage('website')
    if (devMode) {
      setDevMode(false)
      localStorage.setItem('devMode', 'false')
      window.dispatchEvent(new Event('devModeChange'))
    }
  }

  return (
    <div className="app-root">
      <LanguageSelectModal 
        forceShow={showLangModal} 
        onClose={() => setShowLangModal(false)} 
      />
      {currentPage === 'website' ? (
        <Website
          user={currentUser}
          onLogout={handleLogout}
          onOpenLogin={handleOpenLogin}
          onOpenLanguage={() => setShowLangModal(true)}
        />
      ) : (
        <Login
          initialView={authMode}
          onLoginSuccess={handleLoginSuccess}
          onBackToWebsite={() => setCurrentPage('website')}
        />
      )}

      {/* ── Global Dev Mode Toggle Button ── */}
      <button
        onClick={toggleDevMode}
        title={devMode ? 'Dev Mode: ON — Click to disable' : 'Dev Mode: OFF — Click to enable'}
        style={{
          position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999,
          width: '44px', height: '44px', borderRadius: '50%',
          border: devMode ? '2px solid #16a34a' : '2px solid #94a3b8',
          background: devMode ? '#dcfce7' : '#f1f5f9',
          color: devMode ? '#15803d' : '#64748b',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.12)', transition: 'all 0.2s ease',
          fontSize: '18px',
        }}
      >
        {devMode ? '✓' : '⚙'}
      </button>
    </div>
  )
}
