import { createFileRoute } from '@tanstack/react-router'
import { db } from '../../../db'
import { calls } from '../../../db/schema'
import { desc } from 'drizzle-orm'
import { inMemoryCalls } from './start'

export const Route = createFileRoute('/api/calls/')({
  server: {
    handlers: {
      GET: async () => {
        try {
          if (process.env.DATABASE_URL) {
            try {
              const records = await db.select().from(calls).orderBy(desc(calls.createdAt)).limit(50)
              return new Response(JSON.stringify(records), {
                headers: { 'Content-Type': 'application/json' },
              })
            } catch (dbErr) {
              console.warn('DB list calls failed, using memory fallback:', dbErr)
            }
          }

          const cachedList = Array.from(inMemoryCalls.values()).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )

          return new Response(JSON.stringify(cachedList), {
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (err: any) {
          console.error('Error listing calls:', err)
          return new Response(JSON.stringify({ error: err.message || 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      },
      DELETE: async () => {
        try {
          inMemoryCalls.clear()

          if (process.env.DATABASE_URL) {
            try {
              await db.delete(calls)
            } catch (dbErr) {
              console.warn('DB clear error:', dbErr)
            }
          }

          return new Response(JSON.stringify({ success: true, cleared: true }), {
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (err: any) {
          console.error('Error clearing calls:', err)
          return new Response(JSON.stringify({ error: err.message || 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      },
    },
  },
})
