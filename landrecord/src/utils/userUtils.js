// Helper utility for intelligent username extraction from emails
// Handles concatenated names like parvjain930 -> parv, randomlogin -> random,
// anilbadra123 -> anil, vikarantbansal1234 -> vikarant

export const COMMON_SUFFIXES = [
  // Surnames (ordered by length descending so longer ones match first)
  'chatterjee', 'mukherjee', 'srivastava', 'chaudhary', 'choudhary', 'shekhawat', 'tripathi', 'malhotra', 'kulkarni',
  'banerjee', 'bhadra', 'badra', 'bansal', 'singhal', 'bindal', 'jindal', 'mittal', 'shukla', 'saxena', 'pandey',
  'tiwari', 'chouhan', 'chauhan', 'agarwal', 'aggarwal', 'bhatia', 'deshmukh', 'gaikwad', 'solanki', 'rathore',
  'sharma', 'verma', 'gupta', 'patel', 'yadav', 'reddy', 'mishra', 'meena', 'mehta', 'rawat', 'joshi', 'dubey',
  'kumar', 'singh', 'naidu', 'thakur', 'rajput', 'pillai', 'iyengar', 'murthy', 'jadhav', 'khanna', 'oberoi',
  'dhawan', 'parmar', 'gehlot', 'tanwar', 'sisodia', 'kapoor', 'chopra', 'malik', 'dalal', 'patil', 'pawar',
  'shinde', 'sahni', 'kohli', 'bose', 'ghosh', 'dutta', 'khatri', 'nair', 'iyer', 'jain', 'shah', 'modi',
  'soni', 'dave', 'vyas', 'garg', 'goel', 'more', 'babu', 'sood', 'sethi', 'tomar', 'dey', 'das', 'sen', 'roy', 'rao',
  // Suffix words (login, user, account, etc.)
  'login', 'user', 'account', 'official', 'test', 'demo', 'dev', 'admin', 'work', 'real', 'mail', 'email', 'profile'
]

/**
 * Extracts the clean first name / username from an email address or input
 * Examples:
 *   parvjain930@gmail.com -> 'parv'
 *   randomlogin@gmail.com -> 'random'
 *   anilbadra123@gmail.com -> 'anil'
 *   vikarantbansal1234@gmail.com -> 'vikarant'
 *   john.doe@gmail.com -> 'john'
 */
export function extractCleanUsername(emailOrUsername) {
  if (!emailOrUsername) return 'user'

  // Extract prefix before @
  let raw = String(emailOrUsername).split('@')[0].trim().toLowerCase()

  // 1. If explicit separator exists (e.g. parv.jain or parv_930 or parv-bansal)
  if (/[._\-+]/.test(raw)) {
    const firstPart = raw.split(/[._\-+]/)[0].replace(/\d+$/, '')
    if (firstPart && firstPart.length >= 2) {
      return firstPart
    }
  }

  // 2. Strip trailing numbers (e.g. parvjain930 -> parvjain, anilbadra123 -> anilbadra)
  let cleaned = raw.replace(/\d+$/, '')

  // 3. Match and strip known surname or suffix words
  for (const suffix of COMMON_SUFFIXES) {
    if (cleaned.endsWith(suffix) && cleaned.length > suffix.length + 1) {
      cleaned = cleaned.slice(0, -suffix.length)
      break
    }
  }

  // 4. Strip any residual trailing symbols or numbers
  cleaned = cleaned.replace(/[\d._-]+$/, '')

  return cleaned || raw.replace(/\d+$/, '') || raw || 'user'
}

/**
 * Formats display name with capitalized first letter
 * Example: 'parv' -> 'Parv'
 */
export function formatDisplayName(username) {
  if (!username) return 'User'
  return username.charAt(0).toUpperCase() + username.slice(1)
}

// ── Aadhaar e-KYC Mock Data Generator ───────────────────────────────
const MOCK_NAMES = ['Ramesh Kumar', 'Sunita Devi', 'Ajay Singh', 'Priya Sharma', 'Mahesh Yadav', 'Rekha Verma', 'Sunil Gupta', 'Anita Kumari']
const MOCK_ADDRESSES = ['Village Khandsa, Gurugram', 'Mohalla Sadar, Karnal', 'Ward 5, Rewari', 'Sector 14, Faridabad', 'Near Bus Stand, Panipat']
const MOCK_DISTRICTS = ['Gurugram', 'Karnal', 'Rewari', 'Faridabad', 'Panipat', 'Hisar', 'Rohtak']
const MOCK_CONTACTS = ['9876543210', '9123456789', '8899776655', '7788994433', '9988776655']

export function generateMockAadhaarData(aadhaarNum) {
  const cleaned = aadhaarNum.replace(/\s/g, '')
  const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim()
  const masked = 'XXXX XXXX ' + cleaned.slice(-4)
  return {
    aadhaarNumber: cleaned,
    formattedAadhaar: formatted,
    maskedAadhaar: masked,
    name: MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)],
    dob: `${10 + Math.floor(Math.random() * 20)}/0${1 + Math.floor(Math.random() * 9)}/19${70 + Math.floor(Math.random() * 25)}`,
    gender: Math.random() > 0.5 ? 'Male' : 'Female',
    address: MOCK_ADDRESSES[Math.floor(Math.random() * MOCK_ADDRESSES.length)],
    district: MOCK_DISTRICTS[Math.floor(Math.random() * MOCK_DISTRICTS.length)],
    state: 'Haryana',
    pincode: `1${20 + Math.floor(Math.random() * 10)}0${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`,
    contact: MOCK_CONTACTS[Math.floor(Math.random() * MOCK_CONTACTS.length)],
  }
}

