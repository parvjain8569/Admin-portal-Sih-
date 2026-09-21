/**
 * Gemini API integration for document OCR extraction.
 * Uses @google/genai SDK with structured output to extract
 * land record data from images and PDFs.
 */

import { GoogleGenAI } from '@google/genai'
import { landRecordSchema } from './schema.js'
import { buildPrompt } from './prompt.js'
import fs from 'fs'

/** @type {GoogleGenAI|null} */
let ai = null

/**
 * Initialize the Gemini client (lazy singleton)
 * @returns {GoogleGenAI}
 */
function getClient() {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey || apiKey === 'your_api_key_here') {
      throw new Error(
        'GEMINI_API_KEY is not set. Get your free key at https://aistudio.google.com/apikey and add it to .env'
      )
    }
    ai = new GoogleGenAI({ apiKey })
  }
  return ai
}

/**
 * Map file extension / MIME type to the MIME type Gemini expects
 */
const MIME_MAP = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.bmp': 'image/bmp',
  '.tiff': 'image/tiff',
  '.tif': 'image/tiff',
  '.heic': 'image/heic',
  '.heif': 'image/heif',
  '.pdf': 'application/pdf',
  '.svg': 'image/svg+xml',
}

/**
 * Supported file extensions (all image types + PDF, excluding .docx)
 */
export const SUPPORTED_EXTENSIONS = Object.keys(MIME_MAP)

/**
 * Get the MIME type for a file extension
 * @param {string} ext - File extension including dot, e.g. ".jpg"
 * @returns {string|null}
 */
export function getMimeType(ext) {
  return MIME_MAP[ext.toLowerCase()] || null
}

/**
 * Extract structured land record data from a document file.
 *
 * @param {string} filePath - Absolute path to the uploaded file
 * @param {string} mimeType - MIME type of the file (e.g. 'image/jpeg', 'application/pdf')
 * @param {string} [userHint] - Optional hint about the document from the user
 * @returns {Promise<object>} Extracted land record data as JSON
 */
export async function extractLandRecord(filePath, mimeType, userHint) {
  const client = getClient()

  // Read file and convert to base64
  const fileBuffer = fs.readFileSync(filePath)
  const base64Data = fileBuffer.toString('base64')

  const prompt = buildPrompt(userHint)

  console.log(`[OCR] Processing document: ${filePath} (${mimeType})`)
  console.log(`[OCR] File size: ${(fileBuffer.length / 1024).toFixed(1)} KB`)

  const startTime = Date.now()

  const response = await client.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: [
      {
        inlineData: {
          mimeType,
          data: base64Data,
        },
      },
      { text: prompt },
    ],
    config: {
      responseMimeType: 'application/json',
      responseJsonSchema: landRecordSchema,
    },
  })

  const elapsed = Date.now() - startTime
  console.log(`[OCR] Extraction completed in ${elapsed}ms`)

  // Parse the structured JSON response
  const extracted = JSON.parse(response.text)

  return {
    success: true,
    data: extracted,
    meta: {
      model: 'gemini-3.6-flash',
      processingTimeMs: elapsed,
      fileSizeKB: Math.round(fileBuffer.length / 1024),
      mimeType,
    },
  }
}
