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

export async function createRetellWebCall(params: CreateWebCallParams) {
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
  }
}
