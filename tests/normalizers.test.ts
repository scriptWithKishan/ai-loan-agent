import { describe, it, expect } from 'vitest'
import {
  normalizeAmountInr,
  normalizeTenureYears,
  normalizePropertyType,
  normalizeOwnership,
  normalizeIncomeMode,
} from '../src/services/normalizers'

describe('Normalizers', () => {
  describe('normalizeAmountInr', () => {
    it('normalizes numerical values and strings correctly', () => {
      expect(normalizeAmountInr(7500000)).toBe(7500000)
      expect(normalizeAmountInr('7500000')).toBe(7500000)
      expect(normalizeAmountInr('75,00,000')).toBe(7500000)
      expect(normalizeAmountInr('₹50,00,000')).toBe(5000000)
    })

    it('normalizes lakh and crore expressions', () => {
      expect(normalizeAmountInr('75 lakh')).toBe(7500000)
      expect(normalizeAmountInr('75 lakhs')).toBe(7500000)
      expect(normalizeAmountInr('75L')).toBe(7500000)
      expect(normalizeAmountInr('1 crore')).toBe(10000000)
      expect(normalizeAmountInr('1.5 crore')).toBe(15000000)
      expect(normalizeAmountInr('2.5 cr')).toBe(25000000)
      expect(normalizeAmountInr('50k')).toBe(50000)
    })

    it('normalizes Hindi number words', () => {
      expect(normalizeAmountInr('pachattar lakh')).toBe(7500000)
      expect(normalizeAmountInr('pachhattar lakh')).toBe(7500000)
      expect(normalizeAmountInr('bees lakh')).toBe(2000000)
      expect(normalizeAmountInr('ek crore')).toBe(10000000)
      expect(normalizeAmountInr('pachaas lakh')).toBe(5000000)
    })
  })

  describe('normalizeTenureYears', () => {
    it('normalizes tenure expressions in years and months', () => {
      expect(normalizeTenureYears(10)).toBe(10)
      expect(normalizeTenureYears('5 years')).toBe(5)
      expect(normalizeTenureYears('15 yrs')).toBe(15)
      expect(normalizeTenureYears('10 saal')).toBe(10)
      expect(normalizeTenureYears('paanch saal')).toBe(5)
      expect(normalizeTenureYears('60 months')).toBe(5)
    })
  })

  describe('normalizePropertyType', () => {
    it('identifies property categories correctly', () => {
      expect(normalizePropertyType('flat in Bangalore')).toBe('residential')
      expect(normalizePropertyType('residential apartment')).toBe('residential')
      expect(normalizePropertyType('commercial shop in Chandni Chowk')).toBe('commercial')
      expect(normalizePropertyType('mera office hai')).toBe('commercial')
      expect(normalizePropertyType('warehouse in industrial area')).toBe('industrial')
      expect(normalizePropertyType('kheti ki zameen')).toBe('agricultural')
      expect(normalizePropertyType('agricultural farmland')).toBe('agricultural')
    })
  })

  describe('normalizeOwnership', () => {
    it('identifies sole and joint ownership', () => {
      expect(normalizeOwnership('sole owner')).toBe('sole')
      expect(normalizeOwnership('in my own name only')).toBe('sole')
      expect(normalizeOwnership('mera akela hai')).toBe('sole')
      expect(normalizeOwnership('joint with my wife')).toBe('joint')
      expect(normalizeOwnership('family property, shared')).toBe('joint')
    })
  })

  describe('normalizeIncomeMode', () => {
    it('identifies bank vs cash mode', () => {
      expect(normalizeIncomeMode('credited to bank account')).toBe('bank')
      expect(normalizeIncomeMode('salary in HDFC bank')).toBe('bank')
      expect(normalizeIncomeMode('cash in hand')).toBe('cash')
      expect(normalizeIncomeMode('rokad milta hai')).toBe('cash')
    })
  })
})
