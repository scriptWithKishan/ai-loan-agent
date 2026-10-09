import { describe, it, expect } from 'vitest'
import { evaluateEligibility, MAX_LOAN_AMOUNT_INR } from '../src/services/eligibility'

describe('Eligibility Engine', () => {
  it('passes a fully compliant applicant (happy path)', () => {
    const result = evaluateEligibility({
      propertyType: 'residential',
      ownership: 'sole',
      originalDocuments: true,
      loanAmountInr: 50_00_000,
      occupation: 'salaried',
      incomeMode: 'bank',
      marketValueInr: 1_00_00_000,
      tenureYears: 10,
    })

    expect(result.status).toBe('eligible')
    expect(result.failedReason).toBeNull()
    expect(result.missingFields).toHaveLength(0)
  })

  it('passes boundary loan amount of exactly ₹75 Lakhs', () => {
    const result = evaluateEligibility({
      propertyType: 'commercial',
      ownership: 'joint',
      originalDocuments: true,
      loanAmountInr: 75_00_000,
      occupation: 'self_employed',
      incomeMode: 'bank',
      marketValueInr: 1_50_00_000,
      tenureYears: 15,
    })

    expect(result.status).toBe('eligible')
  })

  it('fails immediately when loan amount exceeds ₹75 Lakhs', () => {
    const result = evaluateEligibility({
      propertyType: 'residential',
      ownership: 'sole',
      originalDocuments: true,
      loanAmountInr: 75_00_001,
      occupation: 'salaried',
      incomeMode: 'bank',
      marketValueInr: 2_00_00_000,
      tenureYears: 10,
    })

    expect(result.status).toBe('not_eligible')
    expect(result.failedStep).toBe('loan_amount')
    expect(result.failedReason).toContain('exceeds our maximum preliminary program limit of ₹75 lakhs')
  })

  it('fails immediately on agricultural land', () => {
    const result = evaluateEligibility({
      propertyType: 'agricultural',
      ownership: 'sole',
      originalDocuments: true,
      loanAmountInr: 30_00_000,
      occupation: 'self_employed',
      incomeMode: 'bank',
      marketValueInr: 80_00_000,
      tenureYears: 5,
    })

    expect(result.status).toBe('not_eligible')
    expect(result.failedStep).toBe('property_type')
    expect(result.failedReason).toContain('Agricultural land is not accepted')
  })

  it('fails when original title documents are missing', () => {
    const result = evaluateEligibility({
      propertyType: 'residential',
      ownership: 'sole',
      originalDocuments: false,
      loanAmountInr: 40_00_000,
      occupation: 'salaried',
      incomeMode: 'bank',
      marketValueInr: 90_00_000,
      tenureYears: 7,
    })

    expect(result.status).toBe('not_eligible')
    expect(result.failedStep).toBe('original_documents')
  })

  it('fails when income is received in cash', () => {
    const result = evaluateEligibility({
      propertyType: 'commercial',
      ownership: 'joint',
      originalDocuments: true,
      loanAmountInr: 25_00_000,
      occupation: 'self_employed',
      incomeMode: 'cash',
      marketValueInr: 60_00_000,
      tenureYears: 5,
    })

    expect(result.status).toBe('not_eligible')
    expect(result.failedStep).toBe('income_mode')
  })

  it('returns in_progress with missing fields when call is ongoing', () => {
    const result = evaluateEligibility({
      propertyType: 'residential',
      ownership: 'sole',
      originalDocuments: true,
      // loanAmountInr, occupation, etc. are missing
    })

    expect(result.status).toBe('in_progress')
    expect(result.missingFields).toContain('loan_amount')
    expect(result.missingFields).toContain('occupation')
    expect(result.missingFields).toContain('income_mode')
    expect(result.missingFields).toContain('market_value')
    expect(result.missingFields).toContain('tenure')
  })
})
