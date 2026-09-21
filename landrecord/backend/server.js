// BhoomiSetu Node.js / Express Backend Server
import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const DB_PATH = path.join(__dirname, 'records.json')

// Helper to read records
function getRecords() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8')
    return JSON.parse(data).records || []
  } catch (err) {
    console.error('Error reading records file:', err)
    return []
  }
}

// Helper to save records
function saveRecords(records) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify({ records }, null, 2))
  } catch (err) {
    console.error('Error saving records:', err)
  }
}

// 1. Get all records
app.get('/api/records', (req, res) => {
  const records = getRecords()
  res.json({ success: true, records })
})

// 2. Upload and process land document
app.post('/api/upload', (req, res) => {
  const { fileName, fileSize, ownerName } = req.body

  if (!fileName) {
    return res.status(400).json({ success: false, message: 'Document name is required' })
  }

  // Simulate OCR validation & Cadastral Registry verification
  const newRecord = {
    id: 'REC-' + String(Date.now()).slice(-4),
    ownerName: ownerName || 'Document Holder',
    parcelId: 'HR-' + Math.floor(10000 + Math.random() * 90000),
    khasraNo: `${Math.floor(10 + Math.random() * 190)}/${Math.floor(1 + Math.random() * 20)}`,
    district: 'Gurugram',
    state: 'Haryana',
    area: (Math.random() * 3 + 0.5).toFixed(2) + ' Acres',
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    status: 'Verified',
    documentName: fileName,
    fileSize: fileSize || 'Unknown',
  }

  const records = getRecords()
  records.unshift(newRecord)
  saveRecords(records)

  res.json({
    success: true,
    message: 'Document successfully digitized and verified.',
    record: newRecord,
  })
})

// 3. Get single record by ID
app.get('/api/records/:id', (req, res) => {
  const records = getRecords()
  const record = records.find((r) => r.id === req.params.id)
  if (!record) {
    return res.status(404).json({ success: false, message: 'Record not found' })
  }
  res.json({ success: true, record })
})

app.listen(PORT, () => {
  console.log(`BhoomiSetu backend running on http://localhost:${PORT}`)
})
