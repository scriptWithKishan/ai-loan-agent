import React, { useEffect, useRef } from 'react'
import { Bot, User, MessageSquare } from 'lucide-react'

export interface TranscriptMessage {
  role: 'agent' | 'user'
  content: string
}

interface LiveTranscriptProps {
  messages: TranscriptMessage[]
}

export const LiveTranscript: React.FC<LiveTranscriptProps> = ({ messages }) => {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col h-full">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-slate-100 font-semibold text-base">
        <MessageSquare className="w-5 h-5 text-sky-400" />
        <span>Live Spoken Conversation</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm gap-2">
            <Bot className="w-8 h-8 text-slate-600 animate-pulse" />
            <p>Waiting for voice connection to begin conversation...</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isAgent = msg.role === 'agent'
            return (
              <div
                key={index}
                className={`flex items-start gap-3 ${isAgent ? 'justify-start' : 'justify-end'}`}
              >
                {isAgent && (
                  <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    isAgent
                      ? 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-tl-sm'
                      : 'bg-indigo-600 text-white rounded-tr-sm shadow-md'
                  }`}
                >
                  <div className="text-[10px] font-medium opacity-70 mb-1">
                    {isAgent ? 'Loan Advisor' : 'Customer'}
                  </div>
                  <p>{msg.content}</p>
                </div>

                {!isAgent && (
                  <div className="w-8 h-8 rounded-full bg-slate-700/80 border border-slate-600 flex items-center justify-center text-slate-300 shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
