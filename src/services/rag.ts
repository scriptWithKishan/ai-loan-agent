import { GoogleGenAI } from '@google/genai'
import { LAP_KNOWLEDGE_BASE, KnowledgeDoc } from '../data/lap_knowledge'
import { db } from '../db'
import { knowledgeChunks } from '../db/schema'
import * as dotenv from 'dotenv'

dotenv.config()

let genAiInstance: GoogleGenAI | null = null

function getGenAI(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) return null
  if (!genAiInstance) {
    genAiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  }
  return genAiInstance
}

/**
 * Computes cosine similarity between two numeric vectors
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length || vecA.length === 0) return 0
  let dotProduct = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i]
    normA += vecA[i] * vecA[i]
    normB += vecB[i] * vecB[i]
  }
  if (normA === 0 || normB === 0) return 0
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

/**
 * Generates vector embedding using Google Gemini text-embedding-004
 */
export async function embedText(text: string): Promise<number[] | null> {
  const ai = getGenAI()
  if (!ai) return null

  try {
    const response = await ai.models.embedContent({
      model: 'gemini-embedding-001',
      contents: text,
      config: {
        outputDimensionality: 768,
      },
    })
    return (response as any).embeddings?.[0]?.values || (response as any).embedding?.values || null
  } catch (err) {
    console.warn('Embedding generation warning:', err instanceof Error ? err.message : err)
    return null
  }
}

/**
 * Keyword match fallback when embeddings are unavailable
 */
function keywordRelevance(query: string, doc: KnowledgeDoc): number {
  const qTerms = query.toLowerCase().split(/\s+/).filter(w => w.length > 2)
  if (qTerms.length === 0) return 0

  const contentLower = (doc.topic + ' ' + doc.content).toLowerCase()
  let matches = 0
  for (const term of qTerms) {
    if (contentLower.includes(term)) matches++
  }
  return matches / qTerms.length
}

/**
 * Retrieves top relevant knowledge snippets for customer query or objection
 */
export async function queryRag(query: string, limit = 2): Promise<string> {
  if (!query || query.trim().length === 0) return ''

  try {
    // 1. Try vector embedding if Gemini key is present
    const queryVector = await embedText(query)

    if (queryVector && process.env.DATABASE_URL) {
      try {
        // Query from Neon Postgres if table is populated
        const rows = await db.select().from(knowledgeChunks).limit(20)
        if (rows.length > 0 && rows[0].embedding) {
          const scored = rows
            .map(row => ({
              topic: row.topic,
              content: row.content,
              score: row.embedding ? cosineSimilarity(queryVector, row.embedding) : 0,
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .filter(item => item.score > 0.45)

          if (scored.length > 0) {
            return scored.map(s => `[${s.topic}]\n${s.content}`).join('\n\n')
          }
        }
      } catch (dbErr) {
        // Fall back gracefully to local LAP_KNOWLEDGE_BASE
      }
    }

    // 2. Local Fallback with LAP_KNOWLEDGE_BASE
    const scoredDocs = LAP_KNOWLEDGE_BASE.map(doc => ({
      doc,
      score: keywordRelevance(query, doc),
    }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)

    if (scoredDocs.length > 0) {
      return scoredDocs.map(s => `[${s.doc.topic}]\n${s.doc.content}`).join('\n\n')
    }

    return ''
  } catch (error) {
    console.warn('RAG Query warning:', error)
    return ''
  }
}
