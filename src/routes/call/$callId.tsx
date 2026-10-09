import React, { useEffect, useState, useRef } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { RetellWebClient } from 'retell-client-js-sdk'
import { AudioControls } from '../../components/AudioControls'
import { ChecklistProgress, ChecklistState } from '../../components/ChecklistProgress'
import { LiveTranscript, TranscriptMessage } from '../../components/LiveTranscript'
import { getCallServerFn } from '../../services/call-actions'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/call/$callId')({
  component: LiveCallPage,
})

function LiveCallPage() {
  const { callId } = Route.useParams()
  const navigate = useNavigate()

  const [isCalling, setIsCalling] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false)
  const [messages, setMessages] = useState<TranscriptMessage[]>([])

  const [checklist, setChecklist] = useState<ChecklistState>({
    overallStatus: 'in_progress',
  })

  const retellClientRef = useRef<RetellWebClient | null>(null)

  useEffect(() => {
    let client: RetellWebClient | null = null

    async function initCall() {
      try {
        const storedToken = sessionStorage.getItem(`retell_token_${callId}`)
        if (!storedToken) {
          console.warn('No access token in session storage for callId:', callId)
        }

        // Instantiate Retell Web Client
        client = new RetellWebClient()
        retellClientRef.current = client

        client.on('call_started', () => {
          setIsCalling(true)
        })

        client.on('call_ended', () => {
          setIsCalling(false)
          setIsAgentSpeaking(false)
        })

        client.on('agent_start_talking', () => {
          setIsAgentSpeaking(true)
        })

        client.on('agent_stop_talking', () => {
          setIsAgentSpeaking(false)
        })

        client.on('update', (update: any) => {
          if (update?.transcript && Array.isArray(update.transcript)) {
            const formatted: TranscriptMessage[] = update.transcript.map((item: any) => ({
              role: item.role === 'agent' ? 'agent' : 'user',
              content: item.content,
            }))
            setMessages(formatted)
          }
        })

        client.on('error', (error: any) => {
          console.error('Retell WebRTC error:', error)
        })

        // If a real token is available, start the web call audio stream
        if (storedToken && storedToken !== 'mock_token') {
          await client.startCall({
            accessToken: storedToken,
          })
        } else {
          // Mock mode: provide initial welcome message for dev testing
          setIsCalling(true)
          setMessages([
            {
              role: 'agent',
              content: 'Hi, am I speaking with Rahul? This is Ananya from Sunrise Capital. Is this a good time to talk for 2-3 minutes?',
            },
          ])
        }
      } catch (err) {
        console.error('Error starting live web call:', err)
      }
    }

    initCall()

    // Polling interval to fetch deterministic eligibility status updates from the database/server
    const interval = setInterval(async () => {
      try {
        const session = await getCallServerFn({ data: callId })
        if (session) {
          setChecklist({
            propertyType: session.propertyType,
            ownership: session.ownership,
            originalDocuments: session.originalDocuments,
            loanAmountInr: session.loanAmountInr,
            occupation: session.occupation,
            incomeMode: session.incomeMode,
            marketValueInr: session.marketValueInr,
            tenureYears: session.tenureYears,
            overallStatus: session.eligibilityStatus || 'in_progress',
            failedReason: session.disqualificationReason,
          })
        }
      } catch (e) {
        // Silent poll error handling
      }
    }, 2500)

    return () => {
      clearInterval(interval)
      if (client) {
        client.stopCall()
      }
    }
  }, [callId])

  const handleToggleMute = () => {
    // Retell SDK client does not have native mute toggle; can disable mic track or state
    setIsMuted(!isMuted)
  }

  const handleEndCall = () => {
    if (retellClientRef.current) {
      retellClientRef.current.stopCall()
    }
    setIsCalling(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col space-y-5">
      {/* Top Bar with back link and controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate({ to: '/' })}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="w-full sm:w-auto">
          <AudioControls
            isCalling={isCalling}
            isMuted={isMuted}
            isAgentSpeaking={isAgentSpeaking}
            onToggleMute={handleToggleMute}
            onEndCall={handleEndCall}
          />
        </div>
      </div>

      {/* Main split grid: Checklist vs Live Transcript */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[550px]">
        {/* Left Column: 7-Point Eligibility Engine */}
        <div className="lg:col-span-5 h-[550px] lg:h-full">
          <ChecklistProgress checklist={checklist} />
        </div>

        {/* Right Column: Live Chat Transcript */}
        <div className="lg:col-span-7 h-[550px] lg:h-full">
          <LiveTranscript messages={messages} />
        </div>
      </div>
    </div>
  )
}
