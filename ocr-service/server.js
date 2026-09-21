/**
 * BhoomiIntelli OCR Microservice
 * 
 * Express server that accepts document uploads (images/PDFs)
 * and extracts structured Indian land record data using Gemini API.
 * 
 * Endpoints:
 *   GET  /api/ocr/health    — Health check
 *   POST /api/ocr/extract   — Upload & extract land record data
 */

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { extractLandRecord, getMimeType, SUPPORTED_EXTENSIONS } from './lib/gemini.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// ── Middleware ──────────────────────────────────────────────
app.use(cors())
app.use(express.json())

// ── Mock Database Setup ─────────────────────────────────────
const dbPath = process.env.VERCEL ? path.join('/tmp', 'db.json') : path.join(__dirname, 'db.json')

function readDB() {
  if (!fs.existsSync(dbPath)) return []
  try {
    const data = fs.readFileSync(dbPath, 'utf8')
    return JSON.parse(data)
  } catch (err) {
    console.error('Failed to read db.json', err)
    return []
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
  } catch (err) {
    console.error('Failed to write to db.json', err)
  }
}

// ── Mock DB Endpoints ──────────────────────────────────────
app.get('/api/records', (req, res) => {
  res.json(readDB())
})

app.post('/api/records', (req, res) => {
  const newRecord = req.body
  const records = readDB()
  
  // Check if it's an update (matching ID)
  const existingIndex = records.findIndex(r => r.id === newRecord.id)
  
  if (existingIndex >= 0) {
    records[existingIndex] = { ...records[existingIndex], ...newRecord }
  } else {
    records.unshift(newRecord) // Add to top
  }
  
  writeDB(records)
  res.json({ success: true, record: newRecord })
})

// ── File Upload Config ─────────────────────────────────────
const uploadsDir = process.env.VERCEL ? '/tmp/uploads' : path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e6)}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  },
})

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB max
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (SUPPORTED_EXTENSIONS.includes(ext)) {
      cb(null, true)
    } else {
      cb(new Error(`Unsupported file type: ${ext}. Supported: ${SUPPORTED_EXTENSIONS.join(', ')}`))
    }
  },
})

// ── Health Check ───────────────────────────────────────────
app.get('/api/ocr/health', (req, res) => {
  const hasKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_api_key_here'
  res.json({
    status: 'ok',
    service: 'bhoomintelli-ocr',
    version: '1.0.0',
    geminiConfigured: hasKey,
    supportedFormats: SUPPORTED_EXTENSIONS,
    maxFileSizeMB: 20,
    timestamp: new Date().toISOString(),
  })
})

// ── OCR Extraction Endpoint ────────────────────────────────
app.post('/api/ocr/extract', upload.single('document'), async (req, res) => {
  const startTime = Date.now()

  try {
    // Validate file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded. Send a file with field name "document".',
        supportedFormats: SUPPORTED_EXTENSIONS,
      })
    }

    const { path: filePath, originalname, size } = req.file
    const ext = path.extname(originalname).toLowerCase()
    const mimeType = getMimeType(ext)

    if (!mimeType) {
      // Clean up uploaded file
      fs.unlinkSync(filePath)
      return res.status(400).json({
        success: false,
        error: `Could not determine MIME type for extension: ${ext}`,
      })
    }

    console.log(`\n${'═'.repeat(60)}`)
    console.log(`[OCR] New extraction request`)
    console.log(`[OCR] File: ${originalname} (${(size / 1024).toFixed(1)} KB)`)
    console.log(`[OCR] Type: ${mimeType}`)
    console.log(`${'═'.repeat(60)}`)

    // Optional user hint about the document
    const userHint = req.body?.hint || null

    // Extract data using Gemini
    const result = await extractLandRecord(filePath, mimeType, userHint)

    // Add original filename to meta
    result.meta.originalFilename = originalname
    result.meta.totalTimeMs = Date.now() - startTime

    // Clean up uploaded file after processing
    fs.unlinkSync(filePath)

    console.log(`[OCR] ✅ Extraction successful — ${result.data.documentType || 'Unknown'} document`)
    console.log(`[OCR] Owner: ${result.data.ownerName || 'N/A'}`)
    console.log(`[OCR] Confidence: ${result.data.confidence || 'N/A'}`)
    console.log(`[OCR] Total time: ${result.meta.totalTimeMs}ms\n`)

    res.json(result)
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path)
    }

    console.error(`[OCR] ❌ Extraction failed:`, error.message)

    // Determine error type for appropriate status code
    const isAuthError = error.message.includes('API_KEY') || error.message.includes('401') || error.message.includes('403')
    const isQuotaError = error.message.includes('429') || error.message.includes('quota')

    const statusCode = isAuthError ? 401 : isQuotaError ? 429 : 500

    res.status(statusCode).json({
      success: false,
      error: error.message,
      hint: isAuthError
        ? 'Check your GEMINI_API_KEY in .env — get a free key at https://aistudio.google.com/apikey'
        : isQuotaError
          ? 'API rate limit reached. Wait a moment and try again.'
          : 'Internal server error during OCR extraction.',
    })
  }
})

// ── Multer Error Handler ───────────────────────────────────
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        error: 'File too large. Maximum size is 20MB.',
      })
    }
    return res.status(400).json({
      success: false,
      error: `Upload error: ${err.message}`,
    })
  }
  if (err) {
    return res.status(400).json({
      success: false,
      error: err.message,
    })
  }
  next()
})

// ── Start Server ───────────────────────────────────────────
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV === undefined) {
  app.listen(PORT, () => {
    const hasKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_api_key_here'

    console.log(`\n${'═'.repeat(60)}`)
    console.log(`  🔍 BhoomiIntelli OCR Service`)
    console.log(`  📡 Running on http://localhost:${PORT}`)
    console.log(`  📋 Health:  GET  http://localhost:${PORT}/api/ocr/health`)
    console.log(`  📄 Extract: POST http://localhost:${PORT}/api/ocr/extract`)
    console.log(`  🔑 Gemini API Key: ${hasKey ? '✅ Configured' : '❌ NOT SET — add to .env'}`)
    console.log(`  📁 Supported: ${SUPPORTED_EXTENSIONS.join(', ')}`)
    console.log(`${'═'.repeat(60)}\n`)
  })
}

export default app;
