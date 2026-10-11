import { PropertyType, OwnershipType, OccupationType, IncomeModeType } from './eligibility'

/**
 * Maps Hindi and Indian English word numbers to numerical values
 */
const HINDI_NUMBER_WORDS: Record<string, number> = {
  ek: 1,
  do: 2,
  teen: 3,
  char: 4,
  paanch: 5,
  panch: 5,
  chhe: 6,
  che: 6,
  saat: 7,
  aath: 8,
  nau: 9,
  das: 10,
  gyarah: 11,
  barah: 12,
  pandrah: 15,
  bees: 20,
  pachees: 25,
  tees: 30,
  pentees: 35,
  chalis: 40,
  pachaas: 50,
  pachas: 50,
  saath: 60,
  sattar: 70,
  pachattar: 75,
  pachhattar: 75,
  assi: 80,
  nabbe: 90,
  sau: 100,
}

const ENGLISH_NUMBER_WORDS: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  fifteen: 15,
  twenty: 20,
  twentyfive: 25,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  seventyfive: 75,
  eighty: 80,
  ninety: 90,
}

/**
 * Normalizes currency and amount inputs into integer INR.
 * Handles "75 lakhs", "75L", "1.5 crore", "pachattar lakh", "7500000", etc.
 */
export function normalizeAmountInr(raw: string | number | null | undefined): number | null {
  if (raw === null || raw === undefined) return null
  if (typeof raw === 'number') {
    return isNaN(raw) || raw < 0 ? null : Math.round(raw)
  }

  const str = String(raw).toLowerCase().replace(/,/g, '').trim()
  if (!str) return null

  // Direct number check (e.g. "5000000" or "₹5000000")
  const pureNumMatch = str.match(/^[₹rs.\s]*(\d+(\.\d+)?)[₹rs.\s]*$/)
  if (pureNumMatch) {
    const val = parseFloat(pureNumMatch[1])
    return isNaN(val) ? null : Math.round(val)
  }

  // Handle Crores ("cr", "crore", "crores")
  const croreMatch = str.match(/([a-z0-9.]+)\s*(?:cr|crore|crores)/)
  if (croreMatch) {
    const numPart = resolveNumberWords(croreMatch[1])
    if (numPart !== null) {
      return Math.round(numPart * 1_00_00_000)
    }
  }

  // Handle Lakhs ("lakh", "lakhs", "lac", "lacs", "75l")
  const lakhMatch = str.match(/([a-z0-9.]+)\s*(?:lakh|lakhs|lac|lacs|\bl\b|l$)/)
  if (lakhMatch) {
    const numPart = resolveNumberWords(lakhMatch[1])
    if (numPart !== null) {
      return Math.round(numPart * 1_00_000)
    }
  }

  // Handle Thousands ("k", "thousand", "hazaar")
  const thousandMatch = str.match(/([a-z0-9.]+)\s*(?:thousand|thousands|hazaar|hazar|\bk\b|k$)/)
  if (thousandMatch) {
    const numPart = resolveNumberWords(thousandMatch[1])
    if (numPart !== null) {
      return Math.round(numPart * 1_000)
    }
  }

  // Word resolver fallback (e.g. "pachattar lakh")
  const words = str.split(/\s+/)
  if (words.includes('lakh') || words.includes('lakhs') || words.includes('lac')) {
    const prefixWord = words[0]
    const resolved = resolveNumberWords(prefixWord)
    if (resolved !== null) return Math.round(resolved * 1_00_000)
  }

  return null
}

function resolveNumberWords(token: string): number | null {
  const clean = token.toLowerCase().trim().replace(/-/g, ' ').replace(/[^a-z0-9.\s]/g, '')
  const parsed = parseFloat(clean)
  if (!isNaN(parsed)) return parsed

  const parts = clean.split(/\s+/).filter(Boolean)
  if (parts.length === 1) {
    const single = parts[0]
    if (HINDI_NUMBER_WORDS[single] !== undefined) return HINDI_NUMBER_WORDS[single]
    if (ENGLISH_NUMBER_WORDS[single] !== undefined) return ENGLISH_NUMBER_WORDS[single]
  } else if (parts.length === 2) {
    const tens = ENGLISH_NUMBER_WORDS[parts[0]] ?? HINDI_NUMBER_WORDS[parts[0]]
    const ones = ENGLISH_NUMBER_WORDS[parts[1]] ?? HINDI_NUMBER_WORDS[parts[1]]
    if (tens !== undefined && ones !== undefined) {
      return tens + ones
    }
  }

  return null
}

/**
 * Normalizes tenure in years.
 * e.g., "5 years", "10 saal", "15 yrs", "7" -> 5, 10, 15, 7
 */
export function normalizeTenureYears(raw: string | number | null | undefined): number | null {
  if (raw === null || raw === undefined) return null
  if (typeof raw === 'number') {
    return isNaN(raw) || raw <= 0 ? null : Math.round(raw)
  }

  const str = String(raw).toLowerCase().trim()
  const numMatch = str.match(/(\d+(\.\d+)?)/)
  if (numMatch) {
    const years = parseFloat(numMatch[1])
    if (str.includes('month') || str.includes('mahine')) {
      return Math.max(1, Math.round(years / 12))
    }
    return Math.round(years)
  }

  // Check Hindi/English words
  for (const [word, val] of Object.entries({ ...ENGLISH_NUMBER_WORDS, ...HINDI_NUMBER_WORDS })) {
    if (str.includes(word)) {
      return val
    }
  }

  return null
}

/**
 * Normalizes property types from spoken responses
 */
export function normalizePropertyType(raw: string | null | undefined): PropertyType | string | null {
  if (!raw) return null
  const s = raw.toLowerCase().trim()

  if (s.includes('agri') || s.includes('farm') || s.includes('kheti') || s.includes('khet')) {
    return 'agricultural'
  }
  if (s.includes('indus') || s.includes('factor') || s.includes('godown') || s.includes('warehouse') || s.includes('karkhana')) {
    return 'industrial'
  }
  if (s.includes('comm') || s.includes('shop') || s.includes('office') || s.includes('dukaan') || s.includes('dukan') || s.includes('complex')) {
    return 'commercial'
  }
  if (s.includes('residen') || s.includes('flat') || /\bhouse\b/.test(s) || s.includes('apartment') || s.includes('villa') || s.includes('ghar') || s.includes('makaan')) {
    return 'residential'
  }

  return s
}

/**
 * Normalizes ownership status
 */
export function normalizeOwnership(raw: string | null | undefined): OwnershipType | string | null {
  if (!raw) return null
  const s = raw.toLowerCase().trim()

  if (s.includes('joint') || s.includes('shared') || s.includes('wife') || s.includes('husband') || s.includes('family') || s.includes('partner') || s.includes('dono')) {
    return 'joint'
  }
  if (s.includes('sole') || s.includes('single') || s.includes('own') || s.includes('alone') || s.includes('individual') || s.includes('akela') || s.includes('mera hi')) {
    return 'sole'
  }

  return s
}

/**
 * Normalizes income mode
 */
export function normalizeIncomeMode(raw: string | null | undefined): IncomeModeType | string | null {
  if (!raw) return null
  const s = raw.toLowerCase().trim()

  if (s.includes('cash') || s.includes('rokad') || s.includes('nakad') || s.includes('hand')) {
    return 'cash'
  }
  if (s.includes('bank') || s.includes('account') || s.includes('online') || s.includes('neft') || s.includes('rtgs') || s.includes('transfer') || s.includes('cheque') || s.includes('salary ac')) {
    return 'bank'
  }

  return s
}
