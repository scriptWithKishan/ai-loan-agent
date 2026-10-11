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
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 neu-raised rounded-2xl border border-white/80 w-full">
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
          <div className="text-sm font-bold text-slate-800">
            {isCalling ? 'Live Audio Connected' : 'Connecting Audio Line...'}
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
            {isAgentSpeaking ? (
              <span className="text-blue-700 font-semibold flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 animate-pulse text-blue-600" /> Advisor Vikram is speaking
              </span>
            ) : (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 text-emerald-600" /> Listening to your microphone
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 ml-auto">
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
          className={`p-3.5 rounded-2xl transition-all duration-200 cursor-pointer ${
            isMuted
              ? 'neu-inset text-rose-600 border border-rose-300'
              : 'neu-button text-slate-700 hover:text-blue-600'
          }`}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <button
          onClick={onEndCall}
          className="neu-button-danger flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm cursor-pointer shadow-md"
        >
          <PhoneOff className="w-4 h-4" />
          <span>End Consultation</span>
        </button>
      </div>
    </div>
  )
}
