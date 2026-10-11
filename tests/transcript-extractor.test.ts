import { describe, it, expect } from 'vitest'
import * as dotenv from 'dotenv'
import { extractCallDetailsFromTranscript } from '../src/services/transcript-extractor'

dotenv.config()

describe('Transcript Extractor Service', () => {
  it('extracts complete LAP details from real consultation transcript', async () => {
    const transcript = [
      { role: 'agent', content: 'Hi Kishan, do you have 2 minutes for a LAP check?' },
      { role: 'user', content: 'Yes.' },
      { role: 'agent', content: 'What type of property do you own, and ownership?' },
      { role: 'user', content: 'I have my own personal property with residential house. I own it solely myself.' },
      { role: 'agent', content: 'Do you have original property title deeds available?' },
      { role: 'user', content: 'Yes, I have it.' },
      { role: 'agent', content: 'How much are you looking to borrow?' },
      { role: 'user', content: 'Around sixty-five lakhs.' },
      { role: 'agent', content: 'What is your occupation and income mode?' },
      { role: 'user', content: 'I am a self employed businessman and I receive my income through bank.' },
      { role: 'agent', content: 'What is market value and desired tenure?' },
      { role: 'user', content: 'Market value is 1.5 crore, and tenure is 5 years.' },
      { role: 'agent', content: 'Congratulations! You qualify for the loan. Goodbye!' },
    ]

    const result = await extractCallDetailsFromTranscript(transcript)

    expect(result.propertyType).toBe('residential')
    expect(result.ownership).toBe('sole')
    expect(result.originalDocuments).toBe(true)
    expect(result.loanAmountInr).toBe(65_00_000)
    expect(result.occupation).toBe('self_employed')
    expect(result.incomeMode).toBe('bank')
    expect(result.marketValueInr).toBe(1_50_00_000)
    expect(result.tenureYears).toBe(5)
    expect(result.eligibilityStatus).toBe('eligible')
    expect(result.disqualificationReason).toBeNull()
  })

  it('correctly flags agricultural property as not eligible', async () => {
    const transcript = [
      { role: 'agent', content: 'What type of property do you own?' },
      { role: 'user', content: 'I have agricultural farm land in Punjab.' },
      { role: 'agent', content: 'Unfortunately we cannot accept agricultural land. Goodbye.' },
    ]

    const result = await extractCallDetailsFromTranscript(transcript)

    expect(result.propertyType).toBe('agricultural')
    expect(result.eligibilityStatus).toBe('not_eligible')
    expect(result.disqualificationReason).toMatch(/agricultural/i)
  })

  it('correctly flags cash income as not eligible', async () => {
    const transcript = [
      { role: 'agent', content: 'Is income received via bank or cash?' },
      { role: 'user', content: 'I get all my income in cash.' },
      { role: 'agent', content: 'We require bank-credited income. Goodbye.' },
    ]

    const result = await extractCallDetailsFromTranscript(transcript)

    expect(result.incomeMode).toBe('cash')
    expect(result.eligibilityStatus).toBe('not_eligible')
    expect(result.disqualificationReason).toMatch(/bank|cash/i)
  })
})
