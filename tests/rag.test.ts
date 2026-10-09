import { describe, it, expect } from 'vitest'
import { cosineSimilarity, queryRag } from '../src/services/rag'

describe('RAG Service', () => {
  it('calculates cosine similarity correctly for identical vectors', () => {
    const v1 = [1, 2, 3]
    const v2 = [1, 2, 3]
    expect(cosineSimilarity(v1, v2)).toBeCloseTo(1.0, 5)
  })

  it('calculates cosine similarity for orthogonal vectors', () => {
    const v1 = [1, 0, 0]
    const v2 = [0, 1, 0]
    expect(cosineSimilarity(v1, v2)).toBe(0)
  })

  it('retrieves relevant knowledge about agricultural property fallback', async () => {
    const result = await queryRag('Can I apply for agricultural land or farm?')
    expect(result).toContain('Agricultural')
    expect(result).toContain('Eligible Property Types')
  })

  it('retrieves relevant knowledge about interest rates', async () => {
    const result = await queryRag('What is the interest rate for this loan?')
    expect(result).toContain('Interest Rates')
  })

  it('returns empty string for empty query', async () => {
    const result = await queryRag('')
    expect(result).toBe('')
  })
})
