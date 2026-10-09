import { LAP_KNOWLEDGE_BASE } from '../src/data/lap_knowledge'
import { embedText } from '../src/services/rag'
import { db } from '../src/db'
import { knowledgeChunks } from '../src/db/schema'
import * as dotenv from 'dotenv'

dotenv.config()

async function main() {
  console.log('🌱 Starting RAG Knowledge Base Seeding...')

  if (!process.env.DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL is required in .env to seed knowledge base.')
    process.exit(1)
  }

  for (const doc of LAP_KNOWLEDGE_BASE) {
    console.log(`Processing: [${doc.topic}]...`)
    let embedding: number[] | null = null

    if (process.env.GEMINI_API_KEY) {
      embedding = await embedText(`${doc.topic}\n${doc.content}`)
    } else {
      console.warn('⚠️ GEMINI_API_KEY not found; inserting without vector embeddings.')
    }

    try {
      await db
        .insert(knowledgeChunks)
        .values({
          id: doc.id,
          topic: doc.topic,
          content: doc.content,
          embedding: embedding || undefined,
          category: doc.category,
        })
        .onConflictDoUpdate({
          target: knowledgeChunks.id,
          set: {
            topic: doc.topic,
            content: doc.content,
            embedding: embedding || undefined,
            category: doc.category,
          },
        })

      console.log(`✓ Inserted/Updated: ${doc.topic}`)
    } catch (err) {
      console.error(`Failed to insert ${doc.id}:`, err)
    }
  }

  console.log('✅ RAG Seeding Completed successfully!')
  process.exit(0)
}

main().catch(err => {
  console.error('Fatal error during seeding:', err)
  process.exit(1)
})
