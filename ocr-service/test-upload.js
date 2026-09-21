/**
 * Quick test script to upload a document to the OCR service.
 * Usage: node test-upload.js <path-to-image>
 */

import fs from 'fs'
import path from 'path'

const filePath = process.argv[2] || 'test-khasra.jpg'
const serverUrl = 'http://localhost:3001/api/ocr/extract'

async function testUpload() {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`)
    process.exit(1)
  }

  const fileBuffer = fs.readFileSync(filePath)
  const fileName = path.basename(filePath)

  // Build multipart form data manually
  const boundary = '----FormBoundary' + Math.random().toString(36).substring(2)
  const ext = path.extname(fileName).toLowerCase()
  const mimeTypes = {
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
    '.pdf': 'application/pdf', '.gif': 'image/gif', '.webp': 'image/webp',
    '.bmp': 'image/bmp', '.tiff': 'image/tiff', '.tif': 'image/tiff',
  }
  const mimeType = mimeTypes[ext] || 'application/octet-stream'

  const header = `--${boundary}\r\nContent-Disposition: form-data; name="document"; filename="${fileName}"\r\nContent-Type: ${mimeType}\r\n\r\n`
  const footer = `\r\n--${boundary}--\r\n`

  const body = Buffer.concat([
    Buffer.from(header),
    fileBuffer,
    Buffer.from(footer),
  ])

  console.log(`📄 Uploading: ${fileName} (${(fileBuffer.length / 1024).toFixed(1)} KB)`)
  console.log(`📡 Sending to: ${serverUrl}`)
  console.log(`⏳ Waiting for Gemini to extract data...\n`)

  const startTime = Date.now()

  const response = await fetch(serverUrl, {
    method: 'POST',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
    },
    body,
  })

  const elapsed = Date.now() - startTime
  const result = await response.json()

  if (result.success) {
    console.log(`✅ Extraction successful! (${elapsed}ms)\n`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('  EXTRACTED LAND RECORD DATA')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    const d = result.data
    const fields = [
      ['Document Type', d.documentType],
      ['Khasra No', d.khasraNo],
      ['Khata No', d.khataNo],
      ['Owner Name', d.ownerName],
      ['Father\'s Name', d.fatherName],
      ['Village', d.village],
      ['Tehsil', d.tehsil],
      ['District', d.district],
      ['State', d.state],
      ['Area', d.area],
      ['Land Use', d.landUse],
      ['Registration No', d.registrationNo],
      ['Date', d.date],
      ['Confidence', d.confidence],
      ['Remarks', d.remarks],
    ]

    for (const [label, value] of fields) {
      if (value) {
        console.log(`  ${label.padEnd(16)} : ${value}`)
      }
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    if (d.rawTextSummary) {
      console.log(`\n📝 Summary: ${d.rawTextSummary}`)
    }
    console.log(`\n⏱️  Processing: ${result.meta.processingTimeMs}ms | Model: ${result.meta.model}`)
  } else {
    console.log(`❌ Extraction failed: ${result.error}`)
    if (result.hint) console.log(`💡 Hint: ${result.hint}`)
  }
}

testUpload().catch(err => {
  console.error('❌ Error:', err.message)
})
