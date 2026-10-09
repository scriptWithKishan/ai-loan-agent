import React from 'react'
import { Mic, MicOff, PhoneOff, Radio, Volume2 } from 'lucide-react'

interface AudioControlsProps {
  isCalling: boolean
  isMuted: boolean
  isAgentSpeaking: boolean
  onToggleMute: () => void
  onEndCall: () => void
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  isCalling,
  isMuted,
  isAgentSpeaking,
  onToggleMute,
  onEndCall,
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl backdrop-blur-md">
      {/* Status indicator */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center">
          <span
            className={`w-3.5 h-3.5 rounded-full ${
              isCalling ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
            }`}
          />
          {isCalling && (
            <span className="absolute w-6 h-6 rounded-full bg-emerald-500/30 animate-ping" />
          )}
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-200">
            {isCalling ? 'Live Web Call Connected' : 'Call Initializing...'}
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
            {isAgentSpeaking ? (
              <span className="text-sky-400 font-medium flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 animate-pulse" /> Advisor Speaking...
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1">
                <Radio className="w-3.5 h-3.5" /> Listening to you
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
          className={`p-3 rounded-full transition-all duration-200 shadow-md ${
            isMuted
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
              : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700'
          }`}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <button
          onClick={onEndCall}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-medium shadow-lg shadow-rose-900/40 transition-all duration-200 active:scale-95"
        >
          <PhoneOff className="w-4 h-4" />
          <span>End Call</span>
        </button>
      </div>
    </div>
  )
}
