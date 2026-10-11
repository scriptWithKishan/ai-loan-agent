import Retell from 'retell-sdk'
import * as dotenv from 'dotenv'

dotenv.config()

let retellInstance: Retell | null = null

export function getRetellClient(): Retell {
  if (!retellInstance) {
    const apiKey = process.env.RETELL_API_KEY
    if (!apiKey) {
      throw new Error('RETELL_API_KEY is missing in environment variables.')
    }
    retellInstance = new Retell({ apiKey })
  }
  return retellInstance
}

export interface CreateWebCallParams {
  agentId?: string
  dynamicVariables?: Record<string, any>
  metadata?: Record<string, any>
}

export interface WebCallDetails {
  callId: string
  accessToken: string
  transport: 'gateway' | 'livekit'
  iceServers?: any[]
  expiresAt?: number
}

export async function createRetellWebCall(params: CreateWebCallParams): Promise<WebCallDetails> {
  const client = getRetellClient()
  const agentId = params.agentId || process.env.RETELL_AGENT_ID

  if (!agentId) {
    throw new Error('RETELL_AGENT_ID is missing. Please set it in .env or run pnpm run retell:sync.')
  }

  const response = await client.call.createWebCall({
    agent_id: agentId,
    retell_llm_dynamic_variables: params.dynamicVariables,
    metadata: params.metadata,
  })

  return {
    callId: response.call_id,
    accessToken: response.access_token,
    transport: (response as any).transport || 'gateway',
    iceServers: (response as any).ice_servers,
    expiresAt: (response as any).expires_at,
  }
}

export async function stopRetellCall(retellCallId: string): Promise<void> {
  const apiKey = process.env.RETELL_API_KEY
  if (!apiKey || apiKey.startsWith('key_xxx') || !retellCallId || retellCallId.startsWith('mock_')) {
    return
  }
  try {
    const client = getRetellClient()
    await client.call.stop(retellCallId)
  } catch (err: any) {
    console.warn(`[Retell] Could not stop call ${retellCallId}:`, err?.message || err)
  }
}

export async function getRetellCall(retellCallId: string): Promise<any | null> {
  const apiKey = process.env.RETELL_API_KEY
  if (!apiKey || apiKey.startsWith('key_xxx') || !retellCallId || retellCallId.startsWith('mock_')) {
    return null
  }
  try {
    const client = getRetellClient()
    return await client.call.retrieve(retellCallId)
  } catch (err: any) {
    console.warn(`[Retell] Could not retrieve call ${retellCallId}:`, err?.message || err)
    return null
  }
}

