import { neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'

dotenv.config()

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is missing.')
    process.exit(1)
  }

  console.log('Connecting to Neon PostgreSQL...')
  const sql = neon(process.env.DATABASE_URL)
  
  try {
    console.log('Enabling pgvector extension...')
    await sql`CREATE EXTENSION IF NOT EXISTS vector;`
    console.log('✓ pgvector extension enabled successfully!')
  } catch (err) {
    console.warn('Note on pgvector extension:', err instanceof Error ? err.message : err)
  }
}

main().catch(console.error)
