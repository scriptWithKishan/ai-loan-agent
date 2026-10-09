import { createServerFn } from '@tanstack/react-start'
import { db } from '../db'
import { calls, Call } from '../db/schema'
import { createRetellWebCall } from '../lib/retell'
import { eq, desc } from 'drizzle-orm'

export interface StartCallPayload {
  customerName: string
  phoneNumber?: string
  agentName: string
  agentGender: 'male' | 'female'
  language: 'English' | 'Hindi'
}

// In-memory fallback cache for development or when DATABASE_URL is not yet connected
const inMemoryCalls = new Map<string, any>()

export const startCallServerFn = createServerFn({ method: 'POST' })
  .validator((data: StartCallPayload) => data)
  .handler(async ({ data }) => {
    const callId = `call_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`

    let retellResult = { callId: `mock_retell_${Date.now()}`, accessToken: 'mock_token' }

    if (process.env.RETELL_API_KEY && !process.env.RETELL_API_KEY.startsWith('key_xxx')) {
      try {
        retellResult = await createRetellWebCall({
          dynamicVariables: {
            customer_name: data.customerName,
            agent_name: data.agentName,
            agent_gender: data.agentGender,
            language: data.language,
          },
          metadata: {
            app_call_id: callId,
          },
        })
      } catch (err) {
        console.warn('Retell createWebCall failed, falling back to mock for testing:', err)
      }
    } else {
      console.warn('RETELL_API_KEY not set. Using test mock token.')
    }

    const newCallData = {
      id: callId,
      retellCallId: retellResult.callId,
      customerName: data.customerName,
      phoneNumber: data.phoneNumber || null,
      agentName: data.agentName,
      agentGender: data.agentGender,
      language: data.language,
      callStatus: 'ongoing',
      eligibilityStatus: 'in_progress',
      transcript: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    inMemoryCalls.set(callId, newCallData)

    if (process.env.DATABASE_URL) {
      try {
        await db.insert(calls).values(newCallData)
      } catch (dbErr) {
        console.warn('Failed to insert call to DB, saved to in-memory fallback:', dbErr)
      }
    }

    return {
      callId,
      accessToken: retellResult.accessToken,
      retellCallId: retellResult.callId,
      session: newCallData,
    }
  })

export const getCallServerFn = createServerFn({ method: 'GET' })
  .validator((callId: string) => callId)
  .handler(async ({ data: callId }) => {
    if (process.env.DATABASE_URL) {
      try {
        const rows = await db.select().from(calls).where(eq(calls.id, callId)).limit(1)
        if (rows.length > 0) return rows[0]
      } catch (err) {
        // Fall back to in-memory
      }
    }

    return inMemoryCalls.get(callId) || null
  })

export const listCallsServerFn = createServerFn({ method: 'GET' }).handler(async () => {
  if (process.env.DATABASE_URL) {
    try {
      const records = await db.select().from(calls).orderBy(desc(calls.createdAt)).limit(50)
      return records
    } catch (err) {
      // Fall back to in-memory
    }
  }

  return Array.from(inMemoryCalls.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
})

export const verifyAdminPasscodeFn = createServerFn({ method: 'POST' })
  .validator((passcode: string) => passcode)
  .handler(async ({ data: passcode }) => {
    const adminPasscode = process.env.ADMIN_PASSCODE || 'admin123456'
    return {
      valid: passcode === adminPasscode,
    }
  })
