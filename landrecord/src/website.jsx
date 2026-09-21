import { useState, useRef, useEffect, useCallback } from 'react'
import './website.css'
import { extractCleanUsername, formatDisplayName } from './utils/userUtils'

// ── Layout Components ──────────────────────────────────────────
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import FeaturesSection from './components/FeaturesSection'
import ThreeStepsSection from './components/ThreeStepsSection'
import ImpactSection from './components/ImpactSection'
import TransformationFlow from './components/TransformationFlow'
import MyRecordsSection from './components/MyRecordsSection'
import Footer from './components/Footer'

// ── Drawer (Logo Menu) ─────────────────────────────────────────
import MenuDrawer from './components/drawer/MenuDrawer'

// ── Modals ─────────────────────────────────────────────────────
import AuthRequiredModal from './components/modals/AuthRequiredModal'
import RecordDetailsModal from './components/modals/RecordDetailsModal'

// ── Document Review & Fetching overlay ─────────────────────────
import DocumentReviewPage from './components/DocumentReviewPage'
import FetchingDetailsOverlay from './components/FetchingDetailsOverlay'
import CaptchaVerification from './components/CaptchaModal'

// ── Supabase Database & Storage Services ───────────────────────
import { getLandRecords, saveLandRecord, subscribeToRecordChanges } from './lib/index.js'


// ── Initial Sample Records for Demo Registry ───────────────────
const INITIAL_RECORDS = [
  { id: 'REC-20391', ownerName: 'Ramesh Kumar', parcelId: 'HR-20391', date: '04 Sep 2026', status: 'Verified', khasraNo: '45/12', district: 'Gurugram', state: 'Haryana', area: '2.45 Acres', documentName: 'khasra_khatouni_ramesh.pdf' },
  { id: 'REC-18776', ownerName: 'Sunita Devi', parcelId: 'HR-18776', date: '28 Aug 2026', status: 'Verified', khasraNo: '118/4', district: 'Karnal', state: 'Haryana', area: '1.80 Acres', documentName: 'sale_deed_sunita.pdf' },
  { id: 'REC-17402', ownerName: 'Mahesh Yadav', parcelId: 'HR-17402', date: '15 Aug 2026', status: 'Needs Review', khasraNo: '92/1', district: 'Rewari', state: 'Haryana', area: '3.10 Acres', documentName: 'mutation_doc_mahesh.jpg' },
]

const INITIAL_NOTIFICATIONS = [
  { id: 'n1', type: 'processing', title: 'Document OCR Complete', message: 'khasra_khatouni_ramesh.pdf processed. 14 boundary coordinates extracted.', time: '12 mins ago', unread: true },
  { id: 'n2', type: 'status', title: 'Registry Verification Confirmed', message: 'Parcel HR-20391: Digital hash #98AF42 confirmed by Revenue Inspector against Tehsil records.', time: '1 hour ago', unread: true },
  { id: 'n3', type: 'decision', title: 'Application Accepted', message: '✅ Land Parcel HR-20391 application approved for digital certificate issuance.', time: '4 hours ago', unread: true },
]

// ─────────────────────────────────────────────────────────────────────────────
export default function Website({ user, onLogout, onOpenLogin, onOpenLanguage }) {
  // ── Page state ──────────────────────────────────────────────────────────────
  const [activeNav, setActiveNav] = useState('Home') // 'Home' | 'My Records'

  // ── Menu Drawer state ───────────────────────────────────────────────────────
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeDrawerTab, setActiveDrawerTab] = useState('profile')
  const [verificationAlert, setVerificationAlert] = useState(false)

  // ── Profile data (starts clean, populated when user signs in with email) ─────
  const emailUsername = user?.email ? extractCleanUsername(user.email) : ''
  const defaultDisplayName = user?.name || (emailUsername ? formatDisplayName(emailUsername) : '')
  const defaultUsername = user?.username || emailUsername || ''

  const [profileData, setProfileData] = useState({
    name: defaultDisplayName,
    username: defaultUsername,
    email: user?.email || '',
    contact: '',
    isPhoneVerified: false,
    gender: '',
    dob: '',
    address: '',
    district: '',
    state: 'Haryana',
  })

  // Sync profile when user logs in or user prop changes
  useEffect(() => {
    if (user) {
      const uUsername = user.username || (user.email ? extractCleanUsername(user.email) : '')
      const uName = user.name || (uUsername ? formatDisplayName(uUsername) : 'Landholder')
      setProfileData((prev) => ({
        ...prev,
        name: uName,
        username: uUsername,
        email: user.email || prev.email,
        ...(user.aadhaarVerified && user.aadhaarDetails
          ? {
              aadhaarVerified: true,
              aadhaarDetails: user.aadhaarDetails,
              dob: user.aadhaarDetails.dob,
              gender: user.aadhaarDetails.gender,
              address: user.aadhaarDetails.address,
              district: user.aadhaarDetails.district,
              state: user.aadhaarDetails.state,
              contact: user.aadhaarDetails.contact,
              isPhoneVerified: true,
            }
          : {}),
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  // ── Notifications ───────────────────────────────────────────────────────────
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const unreadCount = notifications.filter((n) => n.unread).length

  // ── Records & document upload ───────────────────────────────────────────────
  const [records, setRecords] = useState(INITIAL_RECORDS)
  const [lastUploadedDoc, setLastUploadedDoc] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedRecordForModal, setSelectedRecordForModal] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showAuthPromptModal, setShowAuthPromptModal] = useState(false)

  // ── Load Land Records from Supabase on mount ───────────────────────────────
  useEffect(() => {
    let isMounted = true
    const loadRecords = async () => {
      try {
        const fetched = await getLandRecords()
        if (isMounted && fetched && fetched.length > 0) {
          setRecords(fetched)
        }
      } catch (err) {
        console.warn('[BhoomIntelli] Error fetching records from Supabase:', err)
      }
    }

    loadRecords()

    // Realtime postgres changes subscription
    const unsubscribe = subscribeToRecordChanges(() => {
      loadRecords()
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  // ── New: Fetching overlay + Document Review page + CAPTCHA ───────────────
  const [showFetching, setShowFetching] = useState(false)
  const [showDocReview, setShowDocReview] = useState(false)
  const [reviewFileName, setReviewFileName] = useState(null)
  const [showCaptcha, setShowCaptcha] = useState(false)
  const [extractedOcrData, setExtractedOcrData] = useState(null)

  const stepsRef = useRef(null)
  const fileInputRef = useRef(null)

  // ── Inactivity Session Timeout (10 min = 600s, warning at 8 min = 480s) ────
  const TIMEOUT_MS = 10 * 60 * 1000 // 10 minutes
  const WARNING_MS = 8 * 60 * 1000  // 8 minutes
  const [showInactivityWarning, setShowInactivityWarning] = useState(false)
  const inactivityTimerRef = useRef(null)
  const warningTimerRef = useRef(null)

  const resetInactivityTimer = useCallback(() => {
    if (!user) return
    setShowInactivityWarning(false)
    clearTimeout(inactivityTimerRef.current)
    clearTimeout(warningTimerRef.current)

    warningTimerRef.current = setTimeout(() => {
      setShowInactivityWarning(true)
    }, WARNING_MS)

    inactivityTimerRef.current = setTimeout(() => {
      setShowInactivityWarning(false)
      if (onLogout) onLogout()
    }, TIMEOUT_MS)
  }, [user, onLogout])

  useEffect(() => {
    if (!user) return
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart']
    events.forEach((e) => window.addEventListener(e, resetInactivityTimer))
    resetInactivityTimer()
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetInactivityTimer))
      clearTimeout(inactivityTimerRef.current)
      clearTimeout(warningTimerRef.current)
    }
  }, [user, resetInactivityTimer])

  useEffect(() => {
    const handleDevModeChange = () => {
      const isDev = localStorage.getItem('devMode') === 'true'
      if (isDev) {
        // Inject mock authenticated data
        setProfileData((prev) => ({
          ...prev,
          name: 'Dev User',
          username: 'devuser',
          email: 'dev@bhoomintelli.in',
          contact: '9876543210',
          isPhoneVerified: true,
          gender: 'Male',
          dob: '1995-06-15',
          address: 'Village Khandsa, Gurugram',
          district: 'Gurugram',
          state: 'Haryana',
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
          },
        }))
      } else {
        // Reset to defaults
        setProfileData({
          name: defaultDisplayName,
          username: defaultUsername,
          email: user?.email || '',
          contact: '',
          isPhoneVerified: false,
          gender: '',
          dob: '',
          address: '',
          district: '',
          state: 'Haryana',
        })
      }
    }
    
    handleDevModeChange()
    window.addEventListener('devModeChange', handleDevModeChange)
    return () => window.removeEventListener('devModeChange', handleDevModeChange)
  }, [user, defaultDisplayName, defaultUsername])

  // ── Navigation helpers ──────────────────────────────────────────────────────
  const scrollToSection = (sectionId) => {
    if (activeNav !== 'Home') {
      setActiveNav('Home')
    }
    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setTimeout(() => {
      const el = document.getElementById(sectionId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 80)
  }

  // ── Upload logic (Gated by Login AND Mobile Number OTP Verification) ────────
  const triggerUpload = () => {
    // 1. Must be logged in
    if (!user) {
      setShowAuthPromptModal(true)
      return
    }

    // 2. Must have verified mobile number in profile
    if (!profileData.isPhoneVerified || !profileData.contact) {
      setVerificationAlert(true)
      setActiveDrawerTab('profile')
      setIsDrawerOpen(true)
      return
    }

    // 3. Show CAPTCHA + OTP verification before opening file picker
    setVerificationAlert(false)
    setShowCaptcha(true)
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const sizeStr = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      : `${(file.size / 1024).toFixed(1)} KB`

    setLastUploadedDoc({
      name: file.name,
      size: sizeStr,
      uploadTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })

    // Show the "Fetching Details" overlay first
    setReviewFileName(file.name)
    setShowFetching(true)

    let extracted = null;
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
      const response = await fetch(`${baseUrl}/api/ocr/extract`, {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        const result = await response.json()
        extracted = result.data || {}
        setExtractedOcrData(extracted)
      } else {
        setExtractedOcrData(null)
      }
    } catch (err) {
      console.error('[BhoomIntelli] OCR API Error:', err)
      setExtractedOcrData(null)
    }

    // Add to records immediately in background
    const newParcelId = 'HR-' + Math.floor(21000 + Math.random() * 8000)
    const newRecord = {
      id: 'REC-' + Math.floor(10000 + Math.random() * 90000),
      ownerName: extracted?.ownerName || profileData.name || user?.name || user?.username || 'Authorized Landholder',
      userEmail: profileData.email || user?.email || 'citizen@bhoomintelli.in',
      parcelId: newParcelId,
      date: extracted?.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Verified',
      khasraNo: extracted?.khasraNo || `${Math.floor(20 + Math.random() * 150)}/${Math.floor(1 + Math.random() * 15)}`,
      khatouniNo: extracted?.khataNo || `KH-${Math.floor(100 + Math.random() * 900)}`,
      tehsil: 'Gurugram Sadar',
      village: 'Khandsa',
      district: extracted?.district || profileData.district || 'Gurugram',
      state: extracted?.state || profileData.state || 'Haryana',
      area: extracted?.area || '2.1 Hectares',
      disputeStatus: 'Clear',
      verifiedBy: 'Tehsildar Office (Revenue Registry)',
      documentName: file.name,
      fileSize: sizeStr,
      isNew: true,
    }
    setRecords((prev) => [newRecord, ...prev])

    // Save record row to Supabase PostgreSQL & upload document to Storage
    saveLandRecord(file, newRecord)
      .then((saved) => {
        if (saved) {
          setRecords((curr) =>
            curr.map((r) => (r.id === newRecord.id ? { ...r, ...saved } : r))
          )
        }
      })
      .catch((err) => {
        console.warn('[BhoomIntelli] Supabase record save warning:', err)
      })

    setNotifications((prev) => [{
      id: 'n-' + Date.now(),
      type: 'processing',
      title: 'Document Uploaded & Digitized',
      message: `${file.name} successfully parsed. Parcel ${newParcelId} created.`,
      time: 'Just now',
      unread: true,
    }, ...prev])

    setShowFetching(false)
    setShowDocReview(true)
  }

  // ── Profile & Settings update handlers ─────────────────────────────────────
  const handleProfileSave = (updates) => {
    setProfileData((prev) => ({ ...prev, ...updates }))
    if (updates.isPhoneVerified) {
      setVerificationAlert(false)
    }
  }

  // ── Drawer helpers ──────────────────────────────────────────────────────────
  const openDrawer = (tab = 'profile') => {
    setVerificationAlert(false)
    setActiveDrawerTab(tab)
    setIsDrawerOpen(true)
  }

  // ───────────────────────────────────────────────────────────────────────────
  return (
    <div className="bhoomi-container">

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        style={{ display: 'none' }}
      />

      {/* ── CAPTCHA + OTP VERIFICATION (shown before file picker opens) ── */}
      {showCaptcha && (
        <CaptchaVerification
          phoneNumber={profileData.contact}
          onAllVerified={() => {
            setShowCaptcha(false)
            fileInputRef.current?.click()
          }}
          onClose={() => setShowCaptcha(false)}
        />
      )}

      {/* ── FETCHING DETAILS OVERLAY (full-screen, shown right after upload) ── */}
      {showFetching && <FetchingDetailsOverlay fileName={reviewFileName} />}

      {/* ── DOCUMENT REVIEW PAGE (full-page after fetching completes) ── */}
      {showDocReview && (
        <DocumentReviewPage
          uploadedFileName={reviewFileName}
          extractedData={extractedOcrData}
          onBack={() => {
            setShowDocReview(false)
            setActiveNav('My Records')
          }}
        />
      )}

      {/* ── Main site layout (hidden when in document review) ── */}
      {!showDocReview && !showFetching && (
        <>
          {/* ── Navigation Bar ── */}
          <Navbar
            user={user}
            unreadCount={unreadCount}
            onOpenDrawer={() => openDrawer(user ? 'profile' : 'about')}
            onOpenNotifications={() => openDrawer('notification')}
            onOpenProfile={() => openDrawer('profile')}
            onOpenAbout={() => openDrawer('about')}
            onOpenSupport={() => openDrawer('help')}
            onOpenLogin={onOpenLogin}
            onLogout={onLogout}
            onScrollToSection={scrollToSection}
            onOpenLanguage={onOpenLanguage}
          />

          {/* ── Logo Menu Drawer (Profile, Notifications, Settings, Help, About) ── */}
          {isDrawerOpen && (
            <MenuDrawer
              user={user}
              activeTab={activeDrawerTab}
              onTabChange={setActiveDrawerTab}
              onClose={() => {
                setIsDrawerOpen(false)
                setVerificationAlert(false)
              }}
              profileData={profileData}
              onProfileSave={handleProfileSave}
              onProfileUpdate={handleProfileSave}
              notifications={notifications}
              onMarkAllRead={() => setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))}
              unreadCount={unreadCount}
              verificationAlert={verificationAlert}
            />
          )}

          {/* ── AUTH REQUIRED MODAL (shown when unauthenticated user clicks Upload) ── */}
          {showAuthPromptModal && (
            <AuthRequiredModal
              onClose={() => setShowAuthPromptModal(false)}
              onProceedToLogin={() => {
                setShowAuthPromptModal(false)
                if (onOpenLogin) onOpenLogin('signin')
              }}
            />
          )}

          {/* ── RECORD DETAILS / PROCESSING MODAL ── */}
          <RecordDetailsModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            isProcessing={isProcessing}
            lastUploadedDoc={lastUploadedDoc}
            selectedRecord={selectedRecordForModal}
            onNavigateToRecords={() => setActiveNav('My Records')}
          />

          {/* ── HOME VIEW ── */}
          {activeNav === 'Home' && (
            <main>
              {/* Split Hero Section */}
              <HeroSection
                user={user}
                lastUploadedDoc={lastUploadedDoc}
                onUpload={triggerUpload}
                onScrollToSteps={() => scrollToSection('three-steps')}
                onViewRecords={() => setActiveNav('My Records')}
              />

              {/* 4-Card Technology Features Grid */}
              <FeaturesSection />

              {/* Three Simple Steps Section */}
              <ThreeStepsSection ref={stepsRef} />

              {/* Impact & Metric Statistics Section */}
              <ImpactSection />

              {/* Transformation Flow */}
              <TransformationFlow />
            </main>
          )}

          {/* ── MY RECORDS VIEW ── */}
          {activeNav === 'My Records' && (
            <MyRecordsSection
              records={records}
              onUpload={triggerUpload}
              onViewRecord={(rec) => {
                setSelectedRecordForModal(rec)
                setIsProcessing(false)
                setShowModal(true)
              }}
            />
          )}

          <Footer />

          {/* ── Inactivity Warning Toast ── */}
          {showInactivityWarning && (
            <div style={{
              position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
              background: '#fef3c7', border: '1px solid #f59e0b', color: '#92400e',
              padding: '12px 24px', borderRadius: '10px', fontSize: '13px', fontWeight: '600',
              zIndex: 9999, boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              You will be logged out in 2 minutes due to inactivity.
            </div>
          )}

        </>
      )}
    </div>
  )
}
