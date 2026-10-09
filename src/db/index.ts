import { neon, Pool } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'
import * as dotenv from 'dotenv'

dotenv.config()

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.warn('⚠️ Warning: DATABASE_URL is not set. Database operations will fail until configured in .env.')
}

// HTTP client is optimal for serverless environments (e.g., Vercel)
const sql = neon(connectionString || 'postgresql://mock:mock@localhost:5432/mock')
export const db = drizzle(sql, { schema })
