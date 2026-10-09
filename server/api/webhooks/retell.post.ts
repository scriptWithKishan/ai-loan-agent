import { defineEventHandler, readBody } from 'nitro/h3'
import { db } from '../../../src/db'
import { calls } from '../../../src/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const eventType = body?.event
    const callData = body?.data || body?.call || {}
    const retellCallId = callData?.call_id

    console.log(`[Retell Webhook] Received event: ${eventType} for call: ${retellCallId}`)

    if (!retellCallId || !process.env.DATABASE_URL) {
      return { status: 'ok' }
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

    return { status: 'ok' }
  } catch (err) {
    console.error('Error handling Retell webhook:', err)
    return { status: 'error', message: err instanceof Error ? err.message : String(err) }
  }
})
