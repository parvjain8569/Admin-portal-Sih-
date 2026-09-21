/**
 * JSON Schema definition for Indian land record extraction.
 * Used with Gemini's structured output (responseJsonSchema) to guarantee
 * consistent, typed extraction from scanned documents.
 */

import { Type } from '@google/genai'

/**
 * Supported document types for classification
 */
export const DOCUMENT_TYPES = [
  'Khasra',
  'Khatauni',
  'Jamabandi',
  'Sale Deed',
  'Mutation Record',
  'Revenue Record',
  'Fard',
  'RoR (Record of Rights)',
  'Patta',
  'Other',
]

/**
 * Gemini responseJsonSchema for land record extraction.
 * Every field is STRING to avoid parse errors — the model transliterates
 * Hindi/Devnagari text into English automatically.
 */
export const landRecordSchema = {
  type: Type.OBJECT,
  description: 'Structured data extracted from an Indian land record document',
  properties: {
    documentType: {
      type: Type.STRING,
      description: `Type of land record document. Must be one of: ${DOCUMENT_TYPES.join(', ')}`,
    },
    khasraNo: {
      type: Type.STRING,
      description: 'Khasra number or Survey number (खसरा संख्या). Leave empty string if not found.',
    },
    khataNo: {
      type: Type.STRING,
      description: 'Khata number (खाता संख्या). Leave empty string if not found.',
    },
    ownerName: {
      type: Type.STRING,
      description: 'Full name(s) of current owner(s) (स्वामी/मालिक). If multiple owners, separate with commas. Transliterate Hindi names to English.',
    },
    fatherName: {
      type: Type.STRING,
      description: 'Father\'s name or Husband\'s name (पिता/पति का नाम). Transliterate to English. Leave empty string if not found.',
    },
    village: {
      type: Type.STRING,
      description: 'Village name (ग्राम/गाँव). Transliterate to English.',
    },
    tehsil: {
      type: Type.STRING,
      description: 'Tehsil or Taluka name (तहसील). Transliterate to English. Leave empty string if not found.',
    },
    district: {
      type: Type.STRING,
      description: 'District name (जिला). Transliterate to English.',
    },
    state: {
      type: Type.STRING,
      description: 'State name (राज्य). Transliterate to English.',
    },
    area: {
      type: Type.STRING,
      description: 'Total land area with unit, e.g. "2.5 Hectare" or "3 Bigha 10 Biswa" (क्षेत्रफल). Include the original unit.',
    },
    landUse: {
      type: Type.STRING,
      description: 'Land use classification — Agricultural, Residential, Commercial, Industrial, Barren, or Other (भूमि का उपयोग). Leave empty string if not found.',
    },
    registrationNo: {
      type: Type.STRING,
      description: 'Registration number or Deed number (पंजीकरण संख्या). Leave empty string if not found.',
    },
    date: {
      type: Type.STRING,
      description: 'Date of the record in DD/MM/YYYY format. Convert from any format found in the document. Leave empty string if not found.',
    },
    remarks: {
      type: Type.STRING,
      description: 'Any additional important notes, encumbrances, liens, disputes, or annotations found in the document. Leave empty string if none.',
    },
    confidence: {
      type: Type.STRING,
      description: 'Overall extraction confidence: "high" if text is clearly readable, "medium" if partially degraded, "low" if heavily degraded or mostly illegible.',
    },
    rawTextSummary: {
      type: Type.STRING,
      description: 'A brief 2-3 sentence summary of the document content in English, regardless of the original language.',
    },
  },
  propertyOrdering: [
    'documentType', 'khasraNo', 'khataNo', 'ownerName', 'fatherName',
    'village', 'tehsil', 'district', 'state', 'area', 'landUse',
    'registrationNo', 'date', 'remarks', 'confidence', 'rawTextSummary',
  ],
}
