import React, { useEffect, useRef } from 'react'
import { UserCheck, User, MessageSquare } from 'lucide-react'

export interface TranscriptMessage {
  role: 'agent' | 'user'
  content: string
}

interface LiveTranscriptProps {
  messages: TranscriptMessage[]
  interimUserSpeech?: string
  isAgentSpeaking?: boolean
}

export const LiveTranscript: React.FC<LiveTranscriptProps> = ({
  messages,
  interimUserSpeech,
  isAgentSpeaking,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, interimUserSpeech, isAgentSpeaking])

  const hasAnyContent = messages.length > 0 || !!interimUserSpeech

  return (
    <div className="neu-flat rounded-3xl p-5 sm:p-6 border border-white/80 flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/70 text-slate-800 font-bold text-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg neu-inset flex items-center justify-center text-blue-600">
            <MessageSquare className="w-4 h-4" />
          </div>
          <span>Live Conversation Transcript</span>
        </div>
        {isAgentSpeaking && (
          <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>Vikram is speaking...</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3.5 py-4 pr-1 min-h-[160px] max-h-[300px]">
        {!hasAnyContent ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs gap-2 py-6">
            <div className="w-9 h-9 rounded-full neu-inset flex items-center justify-center text-slate-400">
              <UserCheck className="w-5 h-5 animate-pulse" />
            </div>
            <p>Connecting voice channel... Speak into your microphone to begin.</p>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => {
              const isAgent = msg.role === 'agent'
              return (
                <div
                  key={index}
                  className={`flex items-start gap-2.5 ${isAgent ? 'justify-start' : 'justify-end'}`}
                >
                  {isAgent && (
                    <div className="w-7 h-7 rounded-xl neu-soft flex items-center justify-center text-blue-600 shrink-0 mt-0.5 font-bold text-[10px]">
                      <UserCheck className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                      isAgent
                        ? 'neu-soft text-slate-800 border border-white/80 rounded-tl-sm'
                        : 'bg-blue-600 text-white rounded-tr-sm shadow-md'
                    }`}
                  >
                    <div
                      className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${
                        isAgent ? 'text-blue-700' : 'text-blue-100'
                      }`}
                    >
                      {isAgent ? 'Vikram (Advisor)' : 'You'}
                    </div>
                    <p className="font-normal">{msg.content}</p>
                  </div>

                  {!isAgent && (
                    <div className="w-7 h-7 rounded-xl neu-inset flex items-center justify-center text-slate-600 shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              )
            })}

            {/* Real-time interim user speech preview */}
            {interimUserSpeech && (
              <div className="flex items-start gap-2.5 justify-end">
                <div className="max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed bg-blue-500/80 text-white rounded-tr-sm shadow-sm border border-blue-400 border-dashed animate-pulse">
                  <div className="text-[10px] font-bold uppercase tracking-wider mb-0.5 text-blue-100">
                    You (Speaking...)
                  </div>
                  <p className="font-normal italic">{interimUserSpeech}</p>
                </div>
                <div className="w-7 h-7 rounded-xl neu-inset flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 animate-pulse" />
                </div>
              </div>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
