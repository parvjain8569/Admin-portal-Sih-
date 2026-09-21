import { useState, useEffect, useRef } from 'react'
import RecordAuditStudio from '../components/RecordAuditStudio.jsx'
import { getLandRecords, saveLandRecord } from 'sih-database'

export default function RecordsPage() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [auditingRecord, setAuditingRecord] = useState(null)
  
  // OCR specific states
  const [isOcrProcessing, setIsOcrProcessing] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getLandRecords()
        // Map the Supabase UI model slightly to match the admin portal's expected fields
        const mapped = data.map(r => ({
          id: r.id,
          owner: r.ownerName,
          parcel: r.parcelId,
          khasra: r.khasraNo,
          district: r.district || 'Unknown',
          state: r.state || 'Unknown',
          area: r.area || 'Unknown',
          date: r.date,
          status: r.status,
          documentType: r.documentName || 'Document',
          ocrConfidence: '95%', // Placeholder until OCR integration is complete
          adminNotes: r.disputeStatus === 'Clear' ? 'Clean record.' : r.disputeStatus,
          docDetails: {
            vendor: r.verifiedBy || 'Unknown',
            rawArea: r.area,
            date: r.date,
            mutationId: r.digitalHash ? r.digitalHash.substring(0, 15) : 'N/A'
          },
          fields: [
            { id: 'owner', label: 'Owner Name', ocrValue: r.ownerName, citizenValue: r.ownerName, citizenAction: 'ACCEPTED', confidence: 99, adminDecision: 'PASS' },
            { id: 'khasra', label: 'Khasra Number', ocrValue: r.khasraNo, citizenValue: r.khasraNo, citizenAction: 'ACCEPTED', confidence: 96, adminDecision: 'PASS' },
            { id: 'area', label: 'Plot Area', ocrValue: r.area, citizenValue: r.area, citizenAction: 'ACCEPTED', confidence: 98, adminDecision: 'PASS' }
          ]
        }))
        setRecords(mapped)
      } catch (err) {
        console.error("Failed to load records:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Update a single record after audit studio verdict
  const handleUpdateRecord = async (updated) => {
    // If it's a new record that isn't in our list yet, add it
    if (!records.find(r => r.id === updated.id)) {
      setRecords(prev => [updated, ...prev])
    } else {
      setRecords(prev => prev.map(r => r.id === updated.id ? updated : r))
    }
    setAuditingRecord(null) // Return to list view
    
    // Save to the database
    try {
      await saveLandRecord(null, updated)
    } catch (err) {
      console.error("Failed to save updated record to DB:", err)
    }
  }

  // Handle OCR file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setIsOcrProcessing(true)
    const formData = new FormData()
    formData.append('document', file)

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/ocr/extract`, {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error(`OCR API failed: ${response.statusText}`)
      }

      const result = await response.json()
      const extracted = result.data

      // Transform extracted data into the Audit Studio record schema
      const newRecord = {
        id: `NEW-${Math.floor(Math.random() * 10000)}`,
        owner: extracted.ownerName || 'Unknown',
        parcel: 'PENDING-GEN',
        khasra: extracted.khasraNo || 'N/A',
        district: extracted.district || 'Unknown',
        state: extracted.state || 'Unknown',
        area: extracted.area || 'Unknown',
        date: extracted.date || new Date().toLocaleDateString('en-GB'),
        status: 'Pending',
        documentType: extracted.documentType || 'Unknown Document',
        ocrConfidence: extracted.confidence === 'high' ? '98%' : extracted.confidence === 'medium' ? '80%' : '50%',
        adminNotes: 'Newly extracted via PaddleOCR. Requires manual audit.',
        docDetails: {
          vendor: 'Admin Upload',
          rawArea: extracted.area || 'Unknown',
          date: extracted.date || 'Unknown',
          mutationId: 'N/A'
        },
        fields: [
          { id: 'owner', label: 'Owner Name', ocrValue: extracted.ownerName || '', citizenValue: '', citizenAction: 'PENDING', confidence: 95, adminDecision: 'PENDING' },
          { id: 'khasra', label: 'Khasra Number', ocrValue: extracted.khasraNo || '', citizenValue: '', citizenAction: 'PENDING', confidence: 95, adminDecision: 'PENDING' },
          { id: 'khata', label: 'Khata Number', ocrValue: extracted.khataNo || '', citizenValue: '', citizenAction: 'PENDING', confidence: 90, adminDecision: 'PENDING' },
          { id: 'area', label: 'Plot Area', ocrValue: extracted.area || '', citizenValue: '', citizenAction: 'PENDING', confidence: 90, adminDecision: 'PENDING' },
          { id: 'district', label: 'District', ocrValue: extracted.district || '', citizenValue: '', citizenAction: 'PENDING', confidence: 99, adminDecision: 'PENDING' },
          { id: 'state', label: 'State', ocrValue: extracted.state || '', citizenValue: '', citizenAction: 'PENDING', confidence: 99, adminDecision: 'PENDING' }
        ]
      }
      
      // Instantly open it in Audit Studio for verification
      setAuditingRecord(newRecord)
    } catch (err) {
      console.error(err)
      alert("Error processing document via OCR: " + err.message)
    } finally {
      setIsOcrProcessing(false)
      // Reset input so the same file can be uploaded again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // Filter records
  const filtered = records.filter(r => {
    const matchesSearch = (
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.owner.toLowerCase().includes(search.toLowerCase()) ||
      r.district.toLowerCase().includes(search.toLowerCase()) ||
      r.state.toLowerCase().includes(search.toLowerCase()) ||
      r.parcel.toLowerCase().includes(search.toLowerCase())
    )

    if (!matchesSearch) return false

    if (statusFilter === 'ALL') return true
    if (statusFilter === 'GOOD') return r.status === 'Good' || r.status === 'Verified'
    if (statusFilter === 'FLAGGED') return r.status === 'High Risk' || r.status === 'Rejected'
    if (statusFilter === 'REVIEW') return r.status === 'Under Review'
    if (statusFilter === 'PENDING') return r.status === 'Pending'
    return true
  })

  // If user is currently auditing a record, display the Tri-Pane Audit Studio
  if (auditingRecord) {
    return (
      <RecordAuditStudio 
        record={auditingRecord}
        onBack={() => setAuditingRecord(null)}
        onUpdateRecord={handleUpdateRecord}
      />
    )
  }

  return (
    <div className="admin-section-card" style={{ position: 'relative' }}>
      
      {/* ── Loading Overlay during OCR Processing ── */}
      {isOcrProcessing && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(255,255,255,0.8)', zIndex: 10,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(4px)', borderRadius: '12px'
        }}>
          <div className="admin-spinner" style={{ width: '40px', height: '40px', border: '4px solid var(--accent-light)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <h3 style={{ marginTop: '20px', color: 'var(--text-primary)' }}>AI Extracting Data...</h3>
          <p style={{ color: 'var(--text-secondary)' }}>PaddleOCR is processing the document.</p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* ── Page Header & Context Banner ── */}
      <div className="admin-records-header-row">
        <div>
          <h2 className="admin-records-heading">Citizen Land Record Verification Registry</h2>
          <p className="admin-records-sub">
            Review uploaded land deeds, cross-verify AI OCR extractions with citizen submissions, and issue official approvals or discrepancy flags.
          </p>
        </div>

        <div className="admin-records-stats-summary">
          <span className="stat-pill green">
            <span className="dot" /> {records.filter(r => r.status === 'Good' || r.status === 'Verified').length} Good (Green)
          </span>
          <span className="stat-pill yellow">
            <span className="dot" /> {records.filter(r => r.status === 'Under Review').length} Needs Review
          </span>
          <span className="stat-pill red">
            <span className="dot" /> {records.filter(r => r.status === 'High Risk' || r.status === 'Rejected').length} Flagged (Red)
          </span>
        </div>
      </div>

      {/* ── Filter Tabs & Search Toolbar ── */}
      <div className="admin-filter-tabs-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div className="admin-tab-group">
          <button 
            className={`admin-tab-pill ${statusFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setStatusFilter('ALL')}
          >
            All Records ({records.length})
          </button>
          <button 
            className={`admin-tab-pill tab-flagged ${statusFilter === 'FLAGGED' ? 'active' : ''}`}
            onClick={() => setStatusFilter('FLAGGED')}
          >
            🔴 Flagged / Needs Action ({records.filter(r => r.status === 'High Risk' || r.status === 'Rejected').length})
          </button>
          <button 
            className={`admin-tab-pill tab-review ${statusFilter === 'REVIEW' ? 'active' : ''}`}
            onClick={() => setStatusFilter('REVIEW')}
          >
            🟡 Under Review ({records.filter(r => r.status === 'Under Review').length})
          </button>
          <button 
            className={`admin-tab-pill tab-good ${statusFilter === 'GOOD' ? 'active' : ''}`}
            onClick={() => setStatusFilter('GOOD')}
          >
            🟢 Good / Verified ({records.filter(r => r.status === 'Good' || r.status === 'Verified').length})
          </button>
          <button 
            className={`admin-tab-pill ${statusFilter === 'PENDING' ? 'active' : ''}`}
            onClick={() => setStatusFilter('PENDING')}
          >
            🔵 Pending Queue ({records.filter(r => r.status === 'Pending').length})
          </button>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="admin-search-wrap" style={{ margin: 0 }}>
            <svg className="admin-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="admin-search-input"
              type="text"
              placeholder="Search by ID, name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <button 
            className="admin-action-btn primary"
            onClick={() => fileInputRef.current?.click()}
            style={{ 
              padding: '10px 16px', borderRadius: '8px', border: 'none', 
              background: 'var(--accent-primary)', color: 'white', fontWeight: '500', 
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 4px 12px rgba(99,102,241,0.2)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Process New Document
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="image/*,application/pdf" 
            style={{ display: 'none' }} 
          />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Record ID</th>
              <th>Citizen / Owner</th>
              <th>Parcel ID</th>
              <th>Khasra No</th>
              <th>District & State</th>
              <th>Registered Area</th>
              <th>Submission Date</th>
              <th>Classification Grade</th>
              <th>Audit Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="9" className="admin-table-empty">
                  No land records found matching your filter criteria.
                </td>
              </tr>
            ) : (
              filtered.map(r => {
                const isGood = r.status === 'Good' || r.status === 'Verified'
                const isFlagged = r.status === 'High Risk' || r.status === 'Rejected'
                const isReview = r.status === 'Under Review'

                return (
                  <tr key={r.id} className={r.owner === 'Parv Jain' ? 'admin-tr-highlight' : ''}>
                    <td>
                      <span className="admin-record-id-badge">{r.id}</span>
                      {r.noticeSent && <span className="admin-notice-tag">Notice Sent</span>}
                    </td>
                    <td>
                      <div className="admin-owner-cell">
                        <strong>{r.owner}</strong>
                        {r.owner === 'Parv Jain' && (
                          <span className="admin-demo-tag">Sample Uploader</span>
                        )}
                      </div>
                    </td>
                    <td><code>{r.parcel}</code></td>
                    <td>{r.khasra}</td>
                    <td>{r.district}, {r.state}</td>
                    <td>{r.area}</td>
                    <td>{r.date}</td>
                    <td>
                      <span className={`admin-badge ${
                        isGood ? 'verified' : isFlagged ? 'rejected' : isReview ? 'pending' : 'default'
                      }`}>
                        <span className="admin-badge-dot" />
                        {isGood ? 'Good (Green)' :
                         isFlagged ? 'Flagged (Red)' :
                         isReview ? 'Needs Review (Yellow)' : r.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className={`admin-audit-launch-btn ${isFlagged ? 'btn-priority' : ''}`}
                        onClick={() => setAuditingRecord(r)}
                        title="Open 3-Column Split View Audit Studio"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        Review & Audit
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
