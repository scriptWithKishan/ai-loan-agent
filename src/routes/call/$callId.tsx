import React, { useEffect, useState, useRef, useCallback } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { RetellWebClient } from 'retell-client-js-sdk'
import { AudioWaveform } from '../../components/AudioWaveform'
import { LiveTranscript, TranscriptMessage } from '../../components/LiveTranscript'
import { getCallApi, endCallApi } from '../../services/call-actions'
import {
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  Volume2,
  Mic,
  MicOff,
  PhoneOff,
  Headset,
  Radio,
  Clock,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react'

export const Route = createFileRoute('/call/$callId')({
  component: LiveCallPage,
})

function isGoodbyeUtterance(text: string): boolean {
  if (!text) return false
  const lower = text.toLowerCase()
  return (
    lower.includes('goodbye') ||
    lower.includes('bye for now') ||
    lower.includes('have a wonderful') ||
    lower.includes('have a great day') ||
    lower.includes('have a pleasant') ||
    lower.includes('pleasure speaking with you') ||
    lower.includes('take care')
  )
}

function LiveCallPage() {
  const { callId } = Route.useParams()
  const navigate = useNavigate()

  const [isCalling, setIsCalling] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false)
  const [messages, setMessages] = useState<TranscriptMessage[]>([])
  const [interimUserSpeech, setInterimUserSpeech] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'connected' | 'error' | 'ended'
  >('connecting')
  const [needAudioUnlock, setNeedAudioUnlock] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [isDisconnecting, setIsDisconnecting] = useState(false)

  const messagesRef = useRef<TranscriptMessage[]>([])
  const retellClientRef = useRef<RetellWebClient | null>(null)
  const recognitionRef = useRef<any>(null)
  const disconnectTimerRef = useRef<any>(null)
  const hasEndedRef = useRef(false)

  // Keep ref synchronized with state
  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  // Call duration counter
  useEffect(() => {
    let timer: any = null
    if (isCalling && !isDisconnecting) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isCalling, isDisconnecting])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Graceful call termination that persists data and redirects to /history
  const handleEndCall = useCallback(async () => {
    if (hasEndedRef.current) return
    hasEndedRef.current = true

    if (disconnectTimerRef.current) {
      clearTimeout(disconnectTimerRef.current)
      disconnectTimerRef.current = null
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (e) {}
      recognitionRef.current = null
    }

    if (retellClientRef.current) {
      try {
        retellClientRef.current.stopCall()
      } catch (e) {
        console.warn('Retell stopCall error:', e)
      }
      retellClientRef.current = null
    }

    setIsCalling(false)
    setIsAgentSpeaking(false)
    setConnectionStatus('ended')
    setIsDisconnecting(true)
    setInterimUserSpeech('')

    try {
      await endCallApi(callId, {
        transcript: messagesRef.current,
        durationSeconds: callDuration,
      })
    } catch (e) {
      console.warn('Server endCallApi error:', e)
    }

    try {
      sessionStorage.removeItem(`retell_config_${callId}`)
    } catch (e) {}

    // Short transition before navigating to history so user sees completion
    setTimeout(() => {
      navigate({ to: '/history' })
    }, 1200)
  }, [callId, callDuration, navigate])

  // Initialize browser speech recognition for real-time user speech feedback
  const startSpeechRecognition = useCallback(() => {
    if (typeof window === 'undefined') return
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {}
      }

      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-IN'

      recognition.onresult = (event: any) => {
        let interim = ''
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i]
          if (item.isFinal) {
            const finalTranscript = item[0].transcript.trim()
            if (finalTranscript) {
              setMessages(prev => {
                const last = prev[prev.length - 1]
                if (
                  last &&
                  last.role === 'user' &&
                  last.content.toLowerCase().trim() === finalTranscript.toLowerCase().trim()
                ) {
                  return prev
                }
                const updated: TranscriptMessage[] = [...prev, { role: 'user', content: finalTranscript }]
                messagesRef.current = updated
                return updated
              })
              setInterimUserSpeech('')
            }
          } else {
            interim += item[0].transcript
          }
        }
        if (interim) {
          setInterimUserSpeech(interim)
        }
      }

      recognition.onerror = () => {
        // Soft error, silent fallback
      }

      recognition.onend = () => {
        // Restart if still calling and not muted
        if (retellClientRef.current && !hasEndedRef.current) {
          try {
            recognition.start()
          } catch (e) {}
        }
      }

      recognition.start()
      recognitionRef.current = recognition
    } catch (e) {
      console.warn('SpeechRecognition initialization error:', e)
    }
  }, [])

  const startLiveCall = async () => {
    setErrorMessage(null)
    setConnectionStatus('connecting')
    hasEndedRef.current = false

    try {
      // 1. Get credentials from sessionStorage or server fallback
      let config: {
        retellCallId?: string
        callId?: string
        accessToken: string
        transport?: 'gateway' | 'livekit'
        iceServers?: any[]
      } | null = null

      const storedConfigStr = sessionStorage.getItem(`retell_config_${callId}`)
      if (storedConfigStr) {
        try {
          config = JSON.parse(storedConfigStr)
        } catch (e) {
          console.warn('Failed to parse retell_config from sessionStorage:', e)
        }
      }

      // If missing in sessionStorage, fetch from server API
      if (!config || !config.accessToken || !config.retellCallId) {
        console.log('Retrieving call session credentials from /api/calls/' + callId)
        const serverSession = await getCallApi(callId)
        if (serverSession && serverSession.accessToken) {
          config = {
            callId: serverSession.id,
            retellCallId: serverSession.retellCallId,
            accessToken: serverSession.accessToken,
            transport: serverSession.transport || 'gateway',
            iceServers: serverSession.iceServers || [],
          }
        }
      }

      if (!config || !config.accessToken || config.accessToken === 'mock_token') {
        throw new Error('Valid access token not found for this call session.')
      }

      const gatewayCallId = config.retellCallId || config.callId || callId

      // 2. Cleanup existing client if any
      if (retellClientRef.current) {
        try {
          retellClientRef.current.stopCall()
        } catch (e) {}
      }

      // 3. Create fresh RetellWebClient
      console.log('Initializing Web Client for Call ID:', gatewayCallId)
      const client = new RetellWebClient({
        defaultTransport: (config.transport as any) || 'gateway',
      })
      retellClientRef.current = client

      // 4. Attach event listeners
      client.on('call_started', () => {
        console.log('✓ Call Connected successfully!')
        setIsCalling(true)
        setConnectionStatus('connected')
        setErrorMessage(null)

        startSpeechRecognition()

        try {
          client.startAudioPlayback().catch(() => {
            setNeedAudioUnlock(true)
          })
        } catch (e) {
          setNeedAudioUnlock(true)
        }
      })

      client.on('call_ready', () => {
        console.log('✓ Audio Pipeline Ready')
        setIsCalling(true)
        setConnectionStatus('connected')
      })

      client.on('agent_start_talking', () => {
        setIsAgentSpeaking(true)
      })

      client.on('agent_stop_talking', () => {
        setIsAgentSpeaking(false)
        // Immediate fetch of latest transcript from server when agent finishes speaking
        getCallApi(callId).then(session => {
          if (session?.transcript && Array.isArray(session.transcript) && session.transcript.length > 0) {
            const validUtterances: TranscriptMessage[] = session.transcript
              .filter((item: any) => item && (item.role === 'agent' || item.role === 'user') && item.content)
              .map((item: any) => ({
                role: item.role === 'agent' ? 'agent' : 'user',
                content: item.content,
              }))
            if (validUtterances.length > 0) {
              setMessages(validUtterances)
            }
          }
        }).catch(() => {})
      })

      client.on('update', (update: any) => {
        if (update?.transcript && Array.isArray(update.transcript)) {
          const validUtterances: TranscriptMessage[] = update.transcript
            .filter((item: any) => item && (item.role === 'agent' || item.role === 'user') && item.content)
            .map((item: any) => ({
              role: item.role === 'agent' ? 'agent' : 'user',
              content: item.content,
            }))

          if (validUtterances.length > 0) {
            setMessages(validUtterances)
          }
        }
      })

      client.on('call_ended', () => {
        console.log('Call ended via server/agent hangup')
        setIsCalling(false)
        setIsAgentSpeaking(false)
        setConnectionStatus('ended')
        setIsDisconnecting(true)

        if (!hasEndedRef.current) {
          handleEndCall()
        }
      })

      client.on('error', (err: any) => {
        console.error('WebRTC connection error:', err)
        const msg = typeof err === 'string' ? err : err?.message || 'Connection to voice server failed.'
        setErrorMessage(msg)
        setConnectionStatus('error')
        setIsCalling(false)
      })

      // 5. Connect WebRTC stream
      await client.startCall({
        callId: gatewayCallId,
        accessToken: config.accessToken,
        transport: (config.transport as any) || 'gateway',
        iceServers: config.iceServers,
      })
    } catch (err: any) {
      console.error('Fatal error starting call:', err)
      setErrorMessage(
        err?.message ||
          'Unable to connect to voice platform. Please check microphone permissions and network.'
      )
      setConnectionStatus('error')
      setIsCalling(false)
    }
  }

  // Active call watcher: polls server for live Retell transcripts & monitors for goodbye
  useEffect(() => {
    startLiveCall()

    const interval = setInterval(async () => {
      if (hasEndedRef.current) return
      try {
        const session = await getCallApi(callId)
        if (session) {
          if (Array.isArray(session.transcript) && session.transcript.length > 0) {
            const validUtterances: TranscriptMessage[] = session.transcript
              .filter((item: any) => item && (item.role === 'agent' || item.role === 'user') && item.content)
              .map((item: any) => ({
                role: item.role === 'agent' ? 'agent' : 'user',
                content: item.content,
              }))

            if (validUtterances.length >= messagesRef.current.length) {
              setMessages(validUtterances)
            }
          }

          // If Retell flagged call ended on server, disconnect and navigate to history
          if (session.callStatus === 'ended' && !hasEndedRef.current) {
            handleEndCall()
          }
        }
      } catch (e) {
        // silent
      }
    }, 1200)

    return () => {
      clearInterval(interval)
      if (disconnectTimerRef.current) {
        clearTimeout(disconnectTimerRef.current)
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {}
      }
      if (retellClientRef.current) {
        try {
          retellClientRef.current.stopCall()
        } catch (e) {}
      }
    }
  }, [callId, handleEndCall])

  // Intelligent goodbye detection: auto-disconnect 3 seconds after advisor says goodbye
  useEffect(() => {
    if (messages.length === 0 || hasEndedRef.current || isDisconnecting) return

    const lastMessage = messages[messages.length - 1]
    if (lastMessage && lastMessage.role === 'agent') {
      if (isGoodbyeUtterance(lastMessage.content)) {
        console.log('Advisor concluded consultation with goodbye. Scheduling auto-disconnect...')
        setIsDisconnecting(true)
        if (!disconnectTimerRef.current) {
          disconnectTimerRef.current = setTimeout(() => {
            console.log('Auto-disconnecting call after advisor goodbye...')
            handleEndCall()
          }, 3200)
        }
      }
    }
  }, [messages, handleEndCall, isDisconnecting])

  const handleToggleMute = () => {
    if (!retellClientRef.current) return

    if (isMuted) {
      retellClientRef.current.unmute()
      setIsMuted(false)
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start()
        } catch (e) {}
      }
    } else {
      retellClientRef.current.mute()
      setIsMuted(true)
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {}
      }
    }
  }

  const handleUnlockAudio = () => {
    if (retellClientRef.current) {
      retellClientRef.current
        .startAudioPlayback()
        .then(() => {
          setNeedAudioUnlock(false)
        })
        .catch(console.error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 flex flex-col justify-center items-center w-full">
      {/* Top Bar with back link and breadcrumbs */}
      <div className="w-full flex items-center justify-between pb-6">
        <button
          onClick={handleEndCall}
          className="neu-button flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-600 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Consultation</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full neu-inset text-xs font-semibold text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Encrypted Voice Line</span>
        </div>
      </div>

      {/* Browser Autoplay Audio Unlock Notice */}
      {needAudioUnlock && (
        <div className="w-full mb-6 p-4 neu-raised border border-amber-300 rounded-2xl flex items-center justify-between gap-3 text-amber-900 text-xs font-medium">
          <div className="flex items-center gap-2.5">
            <Volume2 className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Click to enable speaker audio playback in your browser:</span>
          </div>
          <button
            onClick={handleUnlockAudio}
            className="neu-button px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl text-xs cursor-pointer"
          >
            Enable Speaker
          </button>
        </div>
      )}

      {/* Auto Disconnect / Wrap-up Status Banner */}
      {isDisconnecting && (
        <div className="w-full mb-6 p-4 neu-raised border border-emerald-300 rounded-2xl flex items-center justify-center gap-3 text-emerald-900 text-xs font-bold animate-pulse">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Consultation Concluded • Updating consultation record and opening History...</span>
        </div>
      )}

      {/* Connection Error Banner */}
      {errorMessage && (
        <div className="w-full mb-6 p-5 neu-raised border border-rose-300 rounded-2xl flex items-center justify-between gap-4 text-rose-800 text-xs">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <div className="font-bold text-rose-900">Audio Connection Issue</div>
              <div className="text-slate-600 mt-0.5">{errorMessage}</div>
            </div>
          </div>
          <button
            onClick={startLiveCall}
            className="neu-button-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reconnect</span>
          </button>
        </div>
      )}

      {/* Centralized Neumorphic Call Hub */}
      <div className="w-full neu-floating rounded-3xl p-6 sm:p-10 border border-white/90 flex flex-col items-center justify-center space-y-7 shadow-2xl">
        {/* Status & Duration Badge */}
        <div className="flex items-center justify-between w-full pb-4 border-b border-slate-200/80">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-3 h-3 rounded-full ${
                isCalling ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span className="text-xs font-bold tracking-wide text-slate-700">
              {isDisconnecting
                ? 'CONSULTATION CONCLUDED'
                : isCalling
                ? 'CONSULTATION IN PROGRESS'
                : 'CONNECTING AUDIO...'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1 rounded-full neu-inset text-slate-700">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{formatDuration(callDuration)}</span>
          </div>
        </div>

        {/* Central Avatar & Advisor Identity with Concentric Neumorphic Rings */}
        <div className="flex flex-col items-center text-center">
          <div className="relative flex items-center justify-center mb-4">
            {/* Outer pulsating ring */}
            <div
              className={`w-32 h-32 rounded-full neu-flat flex items-center justify-center p-3 border border-white/90 transition-all duration-300 ${
                isAgentSpeaking
                  ? 'scale-105 shadow-[0_0_25px_rgba(37,99,235,0.25)]'
                  : ''
              }`}
            >
              {/* Inner deep inset ring */}
              <div className="w-24 h-24 rounded-full neu-inset flex items-center justify-center text-blue-600">
                <Headset className="w-10 h-10" />
              </div>
            </div>

            {/* Speaking Status Beacon */}
            <div
              className={`absolute bottom-1 right-2 w-5 h-5 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${
                isAgentSpeaking ? 'bg-blue-600' : isCalling ? 'bg-emerald-500' : 'bg-amber-400'
              }`}
            >
              <Radio className="w-2.5 h-2.5 text-white" />
            </div>
          </div>

          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Vikram</h2>
          <p className="text-xs font-semibold text-blue-700 mt-0.5">
            Senior Loan Advisor • Sunrise Capital
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Loan Against Property (LAP) Specialist • Instant Eligibility Verification
          </p>
        </div>

        {/* Interactive Audio Waveform: Spikes when user or advisor talks */}
        <div className="w-full max-w-2xl">
          <AudioWaveform
            isCalling={isCalling}
            isMuted={isMuted}
            isAgentSpeaking={isAgentSpeaking}
          />
        </div>

        {/* Neumorphic Call Action Controls */}
        <div className="flex items-center justify-center gap-4 pt-2">
          {/* Mute Microphone Button */}
          <button
            onClick={handleToggleMute}
            title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
            className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-xs sm:text-sm cursor-pointer transition-all ${
              isMuted
                ? 'neu-inset text-rose-600 border border-rose-300'
                : 'neu-button text-slate-700 hover:text-blue-600'
            }`}
          >
            {isMuted ? (
              <>
                <MicOff className="w-4 h-4 text-rose-600" />
                <span>Microphone Muted</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-blue-600" />
                <span>Mute Mic</span>
              </>
            )}
          </button>

          {/* End Call Button */}
          <button
            onClick={handleEndCall}
            disabled={isDisconnecting}
            className="neu-button-danger flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-xs sm:text-sm cursor-pointer shadow-lg disabled:opacity-50"
          >
            <PhoneOff className="w-4 h-4" />
            <span>{isDisconnecting ? 'Saving Record...' : 'End Call'}</span>
          </button>
        </div>

        {/* Live Spoken Conversation Transcript in Centralized Container */}
        <div className="w-full max-w-2xl pt-2">
          <LiveTranscript
            messages={messages}
            interimUserSpeech={interimUserSpeech}
            isAgentSpeaking={isAgentSpeaking}
          />
        </div>
      </div>
    </div>
  )
}
