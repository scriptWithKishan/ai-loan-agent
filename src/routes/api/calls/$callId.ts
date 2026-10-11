import { createFileRoute } from '@tanstack/react-router'
import { db } from '../../../db'
import { calls } from '../../../db/schema'
import { eq, or } from 'drizzle-orm'
import { inMemoryCalls } from './start'

export const Route = createFileRoute('/api/calls/$callId')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const { callId } = params

          // 1. Check in-memory cache first for fast polling
          let callData = inMemoryCalls?.get(callId)

          // 2. Query Neon PostgreSQL database
          if (process.env.DATABASE_URL) {
            try {
              const rows = await db
                .select()
                .from(calls)
                .where(or(eq(calls.id, callId), eq(calls.retellCallId, callId)))
                .limit(1)

              if (rows.length > 0) {
                // Merge in-memory credentials if DB row lacks access token
                callData = {
                  ...rows[0],
                  ...(callData?.accessToken ? { accessToken: callData.accessToken } : {}),
                  ...(callData?.transport ? { transport: callData.transport } : {}),
                  ...(callData?.iceServers ? { iceServers: callData.iceServers } : {}),
                }
              }
            } catch (dbErr) {
              console.warn('DB lookup failed in /api/calls/$callId, using cache fallback:', dbErr)
            }
          }

          if (!callData) {
            return new Response(JSON.stringify({ error: 'Call not found' }), {
              status: 404,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          // 3. If Retell call ID exists, sync live transcript and status directly from Retell
          const targetRetellCallId = callData.retellCallId || (callId.startsWith('call_') ? callId : null)
          if (targetRetellCallId && !targetRetellCallId.startsWith('mock_')) {
            try {
              const { getRetellCall } = await import('../../../lib/retell')
              const retellCall = await getRetellCall(targetRetellCallId)
              if (retellCall) {
                if (Array.isArray(retellCall.transcript_object) && retellCall.transcript_object.length > 0) {
                  const liveTranscript = retellCall.transcript_object
                    .filter((item: any) => item && (item.role === 'agent' || item.role === 'user') && item.content)
                    .map((item: any) => ({
                      role: item.role === 'agent' ? 'agent' : 'user',
                      content: item.content,
                    }))
                  callData.transcript = liveTranscript
                  if (inMemoryCalls.has(callId)) {
                    inMemoryCalls.get(callId).transcript = liveTranscript
                  }
                }

                if (retellCall.call_status === 'ended') {
                  callData.callStatus = 'ended'
                  if (inMemoryCalls.has(callId)) {
                    inMemoryCalls.get(callId).callStatus = 'ended'
                  }
                }
              }
            } catch (syncErr) {
              // Non-blocking sync error
            }
          }

          return new Response(JSON.stringify(callData), {
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (err: any) {
          console.error('Error fetching call:', err)
          return new Response(JSON.stringify({ error: err.message || 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      },
      DELETE: async ({ params }) => {
        try {
          const { callId } = params

          // 1. Remove from in-memory cache
          if (inMemoryCalls?.has(callId)) {
            const cached = inMemoryCalls.get(callId)
            inMemoryCalls.delete(callId)
            if (cached?.retellCallId) {
              inMemoryCalls.delete(cached.retellCallId)
            }
          }

          // 2. Remove from database
          if (process.env.DATABASE_URL) {
            try {
              await db
                .delete(calls)
                .where(or(eq(calls.id, callId), eq(calls.retellCallId, callId)))
            } catch (dbErr) {
              console.warn('DB delete error:', dbErr)
            }
          }

          return new Response(JSON.stringify({ success: true, deletedId: callId }), {
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (err: any) {
          console.error('Error deleting call:', err)
          return new Response(JSON.stringify({ error: err.message || 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      },
    },
  },
})
