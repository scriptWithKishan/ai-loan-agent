import { createFileRoute } from '@tanstack/react-router'
import { db } from '../../../db'
import { calls } from '../../../db/schema'
import { eq } from 'drizzle-orm'

export const Route = createFileRoute('/api/webhooks/retell')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => ({}))
          const eventType = body?.event
          const callData = body?.data || body?.call || {}
          const retellCallId = callData?.call_id

          console.log(`[Retell Webhook] Received event: ${eventType} for call: ${retellCallId}`)

          if (!retellCallId || !process.env.DATABASE_URL) {
            return new Response(JSON.stringify({ status: 'ok' }), {
              headers: { 'Content-Type': 'application/json' },
            })
          }

          if (eventType === 'call_started') {
            await db
              .update(calls)
              .set({
                callStatus: 'ongoing',
                updatedAt: new Date(),
              })
              .where(eq(calls.retellCallId, retellCallId))
          } else if (eventType === 'call_ended' || eventType === 'call_analyzed') {
            const transcript = callData?.transcript_object || []
            const durationSeconds = callData?.duration_ms ? Math.round(callData.duration_ms / 1000) : null
            const recordingUrl = callData?.recording_url

            await db
              .update(calls)
              .set({
                callStatus: 'ended',
                durationSeconds: durationSeconds ?? undefined,
                recordingUrl: recordingUrl ?? undefined,
                transcript: Array.isArray(transcript) ? transcript : [],
                updatedAt: new Date(),
              })
              .where(eq(calls.retellCallId, retellCallId))
          }

          return new Response(JSON.stringify({ status: 'ok' }), {
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (err: any) {
          console.error('Error handling Retell webhook:', err)
          return new Response(JSON.stringify({ status: 'error', message: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      },
    },
  },
})
