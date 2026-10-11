import { createFileRoute } from '@tanstack/react-router'
import { db } from '../../../db'
import { calls } from '../../../db/schema'
import { eq, or } from 'drizzle-orm'
import { stopRetellCall } from '../../../lib/retell'
import { inMemoryCalls } from './start'

export const Route = createFileRoute('/api/calls/end')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => ({}))
          const callId = body?.callId || body?.id
          const incomingTranscript = Array.isArray(body?.transcript) ? body.transcript : null

          if (!callId) {
            return new Response(JSON.stringify({ error: 'callId is required' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          // 1. Resolve Retell call ID and fetch latest transcript from Retell if needed
          let retellCallId: string | null = null
          let createdAt: Date = new Date()

          const cached = inMemoryCalls?.get(callId)
          if (cached) {
            retellCallId = cached.retellCallId || null
            if (cached.createdAt) createdAt = new Date(cached.createdAt)
          }

          if (!retellCallId && process.env.DATABASE_URL) {
            try {
              const rows = await db
                .select({ retellCallId: calls.retellCallId, createdAt: calls.createdAt })
                .from(calls)
                .where(or(eq(calls.id, callId), eq(calls.retellCallId, callId)))
                .limit(1)
              if (rows.length > 0) {
                retellCallId = rows[0].retellCallId || null
                if (rows[0].createdAt) createdAt = new Date(rows[0].createdAt)
              }
            } catch (e) {}
          }

          let effectiveTranscript = incomingTranscript
          const targetRetellId = retellCallId || (callId.startsWith('call_') ? callId : null)

          if ((!effectiveTranscript || effectiveTranscript.length === 0) && targetRetellId && !targetRetellId.startsWith('mock_')) {
            try {
              const { getRetellCall } = await import('../../../lib/retell')
              const retellCall = await getRetellCall(targetRetellId)
              if (retellCall?.transcript_object && Array.isArray(retellCall.transcript_object)) {
                effectiveTranscript = retellCall.transcript_object
                  .filter((item: any) => item && (item.role === 'agent' || item.role === 'user') && item.content)
                  .map((item: any) => ({
                    role: item.role === 'agent' ? 'agent' : 'user',
                    content: item.content,
                  }))
              }
            } catch (e) {
              console.warn('Could not fetch Retell transcript in /api/calls/end:', e)
            }
          }

          // 2. Extract structured LAP qualification and collected criteria from conversation transcript
          const { extractCallDetailsFromTranscript } = await import('../../../services/transcript-extractor')
          const extracted = await extractCallDetailsFromTranscript(effectiveTranscript)

          const calculatedDuration = Math.max(
            1,
            Math.round((Date.now() - createdAt.getTime()) / 1000)
          )
          const duration = body?.durationSeconds ?? calculatedDuration

          // 3. Update in-memory cache
          if (cached) {
            cached.callStatus = 'ended'
            cached.eligibilityStatus = extracted.eligibilityStatus
            cached.disqualificationReason = extracted.disqualificationReason
            cached.propertyType = extracted.propertyType
            cached.ownership = extracted.ownership
            cached.originalDocuments = extracted.originalDocuments
            cached.loanAmountInr = extracted.loanAmountInr
            cached.occupation = extracted.occupation
            cached.incomeMode = extracted.incomeMode
            cached.marketValueInr = extracted.marketValueInr
            cached.tenureYears = extracted.tenureYears
            cached.durationSeconds = duration
            if (effectiveTranscript && effectiveTranscript.length > 0) {
              cached.transcript = effectiveTranscript
            }
          }

          // 4. Update PostgreSQL record with full details
          if (process.env.DATABASE_URL) {
            try {
              await db
                .update(calls)
                .set({
                  callStatus: 'ended',
                  eligibilityStatus: extracted.eligibilityStatus,
                  disqualificationReason: extracted.disqualificationReason,
                  propertyType: extracted.propertyType || undefined,
                  ownership: extracted.ownership || undefined,
                  originalDocuments: extracted.originalDocuments !== null ? extracted.originalDocuments : undefined,
                  loanAmountInr: extracted.loanAmountInr ?? undefined,
                  occupation: extracted.occupation || undefined,
                  incomeMode: extracted.incomeMode || undefined,
                  marketValueInr: extracted.marketValueInr ?? undefined,
                  tenureYears: extracted.tenureYears ?? undefined,
                  durationSeconds: duration,
                  transcript: effectiveTranscript && effectiveTranscript.length > 0
                    ? effectiveTranscript
                    : undefined,
                  updatedAt: new Date(),
                })
                .where(or(eq(calls.id, callId), eq(calls.retellCallId, callId)))
            } catch (dbErr) {
              console.warn('DB update failed in /api/calls/end:', dbErr)
            }
          }

          // 3. Terminate Retell WebRTC session on the Retell server
          if (retellCallId) {
            await stopRetellCall(retellCallId).catch(() => {})
          }

          return new Response(
            JSON.stringify({
              success: true,
              callStatus: 'ended',
              eligibilityStatus: extracted.eligibilityStatus,
            }),
            {
              headers: { 'Content-Type': 'application/json' },
            }
          )
        } catch (err: any) {
          console.error('Error ending call session:', err)
          return new Response(JSON.stringify({ error: err.message || 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      },
    },
  },
})
