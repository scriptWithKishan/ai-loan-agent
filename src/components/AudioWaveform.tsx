import React, { useEffect, useRef, useState } from 'react'

interface AudioWaveformProps {
  isCalling: boolean
  isMuted: boolean
  isAgentSpeaking: boolean
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  isCalling,
  isMuted,
  isAgentSpeaking,
}) => {
  const [audioLevel, setAudioLevel] = useState<number>(0)
  const [barHeights, setBarHeights] = useState<number[]>(() => Array(32).fill(6))
  const [isUserTalking, setIsUserTalking] = useState<boolean>(false)

  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animFrameRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isCalling) {
      setBarHeights(Array(32).fill(6))
      setAudioLevel(0)
      setIsUserTalking(false)
      return
    }

    let isMounted = true

    // Initialize Web Audio API to capture user voice reactivity
    const setupAudioAnalyser = async () => {
      try {
        if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) return

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        })

        if (!isMounted) {
          stream.getTracks().forEach(t => t.stop())
          return
        }

        streamRef.current = stream

        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
        const audioCtx = new AudioCtx()
        audioContextRef.current = audioCtx

        const analyser = audioCtx.createAnalyser()
        analyser.fftSize = 64
        analyser.smoothingTimeConstant = 0.75
        analyserRef.current = analyser

        const source = audioCtx.createMediaStreamSource(stream)
        source.connect(analyser)
        sourceRef.current = source

        const bufferLength = analyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)

        let lastTime = performance.now()

        const updateLoop = (now: number) => {
          if (!isMounted) return

          if (analyserRef.current && !isMuted) {
            analyserRef.current.getByteFrequencyData(dataArray)

            // Compute volume level
            let sum = 0
            for (let i = 0; i < bufferLength; i++) {
              sum += dataArray[i]
            }
            const avg = sum / bufferLength
            const normalizedLevel = Math.min(1, avg / 120) // 0 to 1
            const userTalkingNow = normalizedLevel > 0.08

            setIsUserTalking(userTalkingNow)
            setAudioLevel(normalizedLevel)

            // Calculate 32 bar heights mirrored around the center
            const newHeights: number[] = []
            const barCount = 32
            const half = barCount / 2

            for (let i = 0; i < barCount; i++) {
              // Distance from center (0 at edges, 1 at center)
              const distFromCenter = 1 - Math.abs(i - half + 0.5) / half
              const freqIdx = Math.floor((Math.abs(i - half + 0.5) / half) * (bufferLength - 1))
              const freqVal = (dataArray[freqIdx] || 0) / 255

              let height = 6

              if (userTalkingNow) {
                // User voice is actively spiking
                const spike = Math.pow(normalizedLevel, 0.7) * 72 * distFromCenter * (0.6 + freqVal * 0.8)
                height = Math.max(8, Math.min(84, spike + Math.sin(now * 0.02 + i) * 6))
              } else if (isAgentSpeaking) {
                // AI Advisor is speaking - generate harmonious rhythmic wave
                const wave = Math.sin(now * 0.008 + i * 0.35) * 22 + Math.cos(now * 0.015 + i * 0.2) * 14
                height = Math.max(8, Math.min(68, 24 + wave * distFromCenter))
              } else {
                // Resting baseline breathing pulse
                const gentle = Math.sin(now * 0.003 + i * 0.25) * 3
                height = Math.max(5, 7 + gentle)
              }

              newHeights.push(Math.round(height))
            }

            setBarHeights(newHeights)
          } else {
            // Muted or idle
            const resting = Array(32).fill(0).map((_, i) => {
              if (isAgentSpeaking) {
                const wave = Math.sin(now * 0.008 + i * 0.35) * 20
                return Math.max(8, Math.min(64, 22 + wave))
              }
              return 6
            })
            setBarHeights(resting)
            setIsUserTalking(false)
            setAudioLevel(0)
          }

          animFrameRef.current = requestAnimationFrame(updateLoop)
        }

        animFrameRef.current = requestAnimationFrame(updateLoop)
      } catch (err) {
        console.warn('Microphone audio analyser fallback active:', err)
        // Fallback animation loop if browser restricts parallel mic streams
        let t = 0
        const fallbackLoop = () => {
          if (!isMounted) return
          t += 0.05
          const simulatedHeights = Array(32).fill(0).map((_, i) => {
            if (isAgentSpeaking) {
              return Math.max(8, Math.round(28 + Math.sin(t * 3 + i * 0.3) * 22))
            }
            return Math.max(5, Math.round(7 + Math.sin(t + i * 0.2) * 2.5))
          })
          setBarHeights(simulatedHeights)
          animFrameRef.current = requestAnimationFrame(fallbackLoop)
        }
        animFrameRef.current = requestAnimationFrame(fallbackLoop)
      }
    }

    setupAudioAnalyser()

    return () => {
      isMounted = false
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      if (sourceRef.current) {
        try { sourceRef.current.disconnect() } catch (e) {}
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try { audioContextRef.current.close() } catch (e) {}
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
      }
    }
  }, [isCalling, isMuted, isAgentSpeaking])

  return (
    <div className="w-full">
      {/* Neumorphic recessed audio visualizer track */}
      <div className="neu-inset-deep rounded-2xl p-4 sm:p-6 border border-white/40 relative overflow-hidden flex flex-col items-center justify-center">
        {/* Ambient status indicator */}
        <div className="flex items-center justify-between w-full mb-4 px-2">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                isUserTalking
                  ? 'bg-emerald-500 scale-125 shadow-[0_0_10px_rgba(16,185,129,0.7)]'
                  : isAgentSpeaking
                  ? 'bg-blue-600 scale-110 shadow-[0_0_10px_rgba(37,99,235,0.6)]'
                  : 'bg-slate-400'
              }`}
            />
            <span className="text-xs font-semibold tracking-wide text-slate-700">
              {isUserTalking ? (
                <span className="text-emerald-700 font-bold">You are speaking...</span>
              ) : isAgentSpeaking ? (
                <span className="text-blue-700 font-bold">Vikram (Advisor) speaking...</span>
              ) : isMuted ? (
                <span className="text-rose-600 font-medium">Microphone muted</span>
              ) : (
                <span className="text-slate-500 font-medium">Listening to your voice...</span>
              )}
            </span>
          </div>

          <div className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-200/80 text-slate-600 shadow-inner">
            {isUserTalking ? 'Mic Active (Spiking)' : isAgentSpeaking ? 'Audio Stream' : 'Live Channel'}
          </div>
        </div>

        {/* Dynamic Spiking Waveform Bars */}
        <div className="w-full h-24 sm:h-28 flex items-center justify-center gap-1 sm:gap-1.5 px-2">
          {barHeights.map((height, i) => {
            const isCenterBar = Math.abs(i - 16) < 8
            return (
              <div
                key={i}
                className="w-1.5 sm:w-2 rounded-full transition-[height] duration-75 ease-out"
                style={{
                  height: `${height}px`,
                  background: isUserTalking
                    ? isCenterBar
                      ? 'linear-gradient(180deg, #10b981 0%, #059669 100%)'
                      : 'linear-gradient(180deg, #34d399 0%, #10b981 100%)'
                    : isAgentSpeaking
                    ? isCenterBar
                      ? 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)'
                      : 'linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)'
                    : '#94a3b8',
                  boxShadow:
                    isUserTalking && height > 24
                      ? '0 0 10px rgba(16, 185, 129, 0.45)'
                      : isAgentSpeaking && height > 24
                      ? '0 0 10px rgba(37, 99, 235, 0.45)'
                      : 'none',
                }}
              />
            )
          })}
        </div>

        {/* Bottom subtle voice guidance */}
        <div className="mt-3 text-[11px] text-slate-400 font-medium text-center">
          {isUserTalking
            ? 'Voice input detected in real-time'
            : isAgentSpeaking
            ? 'Advisor is explaining property loan terms'
            : 'Speak naturally to answer questions about your property'}
        </div>
      </div>
    </div>
  )
}
