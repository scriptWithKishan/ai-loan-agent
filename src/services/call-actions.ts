export interface StartCallPayload {
  customerName: string
  phoneNumber?: string
  agentName?: string
  agentGender?: 'male' | 'female'
  language?: 'English' | 'Hindi'
}

export interface StartCallResult {
  callId: string
  retellCallId: string
  accessToken: string
  transport: 'gateway' | 'livekit'
  iceServers?: any[]
  session: any
}

// Client API helpers that use direct REST HTTP calls to prevent TanStack Start serverFn split bugs
export async function startCallApi(data: StartCallPayload): Promise<StartCallResult> {
  const res = await fetch('/api/calls/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}))
    throw new Error(errorJson.error || `Failed to start call (Status: ${res.status})`)
  }

  return await res.json()
}

export async function getCallApi(callId: string): Promise<any | null> {
  const res = await fetch(`/api/calls/${callId}`)
  if (!res.ok) {
    if (res.status === 404) return null
    throw new Error(`Failed to retrieve call ${callId} (Status: ${res.status})`)
  }
  return await res.json()
}

export async function listCallsApi(): Promise<any[]> {
  const res = await fetch('/api/calls')
  if (!res.ok) {
    throw new Error(`Failed to list calls (Status: ${res.status})`)
  }
  return await res.json()
}

export async function endCallApi(
  callId: string,
  extra?: { transcript?: any[]; durationSeconds?: number }
): Promise<any> {
  const res = await fetch('/api/calls/end', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ callId, ...extra }),
  })

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}))
    throw new Error(errorJson.error || `Failed to end call ${callId} (Status: ${res.status})`)
  }
  return await res.json()
}

export async function deleteCallApi(callId: string): Promise<boolean> {
  const res = await fetch(`/api/calls/${callId}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}))
    throw new Error(errorJson.error || `Failed to delete call ${callId} (Status: ${res.status})`)
  }
  return true
}

export async function clearAllCallsApi(): Promise<boolean> {
  const res = await fetch('/api/calls', {
    method: 'DELETE',
  })

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}))
    throw new Error(errorJson.error || `Failed to clear calls (Status: ${res.status})`)
  }
  return true
}

// Aliases for compatibility
export const startCallServerFn = async ({ data }: { data: StartCallPayload }) => startCallApi(data)
export const getCallServerFn = async ({ data }: { data: string }) => getCallApi(data)
export const listCallsServerFn = async () => listCallsApi()

