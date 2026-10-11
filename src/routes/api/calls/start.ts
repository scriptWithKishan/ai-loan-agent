import { createFileRoute } from '@tanstack/react-router'
import { db } from '../../../db'
import { calls } from '../../../db/schema'
import { createRetellWebCall, WebCallDetails } from '../../../lib/retell'

// Shared in-memory session cache for local development and fast fallbacks
export const inMemoryCalls = new Map<string, any>()

export const Route = createFileRoute('/api/calls/start')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => ({}))
          const data = body || {}

          const callId = `call_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
          const customerName = data.customerName || 'Valued Customer'
          const agentName = data.agentName || 'Vikram'
          const agentGender = data.agentGender || 'male'
          const language = data.language || 'English'

          let retellResult: WebCallDetails = {
            callId: `mock_retell_${Date.now()}`,
            accessToken: 'mock_token',
            transport: undefined,
            iceServers: [],
          }

          if (process.env.RETELL_API_KEY && !process.env.RETELL_API_KEY.startsWith('key_xxx')) {
            try {
              retellResult = await createRetellWebCall({
                dynamicVariables: {
                  customer_name: customerName,
                  agent_name: agentName,
                  agent_gender: agentGender,
                  language,
                },
                metadata: {
                  app_call_id: callId,
                },
              })
            } catch (err: any) {
              console.error('Failed to create Retell web call:', err)
              return new Response(
                JSON.stringify({
                  error: `Retell initialization failed: ${err.message || 'Check Retell API key and agent configuration'}`,
                }),
                {
                  status: 500,
                  headers: { 'Content-Type': 'application/json' },
                }
              )
            }
          } else {
            return new Response(
              JSON.stringify({
                error: 'RETELL_API_KEY is not configured in .env',
              }),
              {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          const newCallData = {
            id: callId,
            retellCallId: retellResult.callId,
            customerName,
            phoneNumber: data.phoneNumber || null,
            agentName,
            agentGender,
            language,
            callStatus: 'ongoing',
            eligibilityStatus: 'in_progress',
            transcript: [],
            accessToken: retellResult.accessToken,
            transport: retellResult.transport,
            iceServers: retellResult.iceServers,
            createdAt: new Date(),
            updatedAt: new Date(),
          }

          inMemoryCalls.set(callId, newCallData)
          inMemoryCalls.set(retellResult.callId, newCallData)

          if (process.env.DATABASE_URL) {
            try {
              await db.insert(calls).values({
                id: callId,
                retellCallId: retellResult.callId,
                customerName,
                phoneNumber: data.phoneNumber || null,
                agentName,
                agentGender,
                language,
                callStatus: 'ongoing',
                eligibilityStatus: 'in_progress',
                transcript: [],
                createdAt: new Date(),
                updatedAt: new Date(),
              })
            } catch (dbErr) {
              console.warn('Failed to insert call into database, preserved in memory:', dbErr)
            }
          }

          return new Response(
            JSON.stringify({
              callId,
              retellCallId: retellResult.callId,
              accessToken: retellResult.accessToken,
              transport: retellResult.transport,
              iceServers: retellResult.iceServers,
              session: newCallData,
            }),
            {
              headers: { 'Content-Type': 'application/json' },
            }
          )
        } catch (err: any) {
          console.error('Unhandled error starting call session:', err)
          return new Response(
            JSON.stringify({ error: err.message || 'Internal server error' }),
            {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        }
      },
    },
  },
})
