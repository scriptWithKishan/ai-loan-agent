import React, { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { CallForm, CallFormData } from '../components/CallForm'
import { startCallServerFn } from '../services/call-actions'
import { ShieldAlert, CheckCircle2, Award, Building, Sparkles } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: IndexPage,
})

function IndexPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleStartCall = async (formData: CallFormData) => {
    setLoading(true)
    setError(null)

    // Request microphone access during user click gesture
    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        // Stop stream right after test permission so Retell client can claim it
        stream.getTracks().forEach(t => t.stop())
      }
    } catch (micErr) {
      setError('Microphone access is required to talk with the loan advisor. Please allow microphone permissions in your browser.')
      setLoading(false)
      return
    }

    try {
      const response = await startCallServerFn({
        data: {
          customerName: formData.customerName,
          agentName: 'Vikram',
          agentGender: 'male',
          language: 'English',
        },
      })

      // Store full WebRTC config in sessionStorage for the Live Call client
      if (response.accessToken) {
        sessionStorage.setItem(
          `retell_config_${response.callId}`,
          JSON.stringify({
            retellCallId: response.retellCallId,
            accessToken: response.accessToken,
            transport: response.transport || undefined,
            iceServers: response.iceServers || [],
          })
        )
      }

      navigate({
        to: '/call/$callId',
        params: { callId: response.callId },
      })
    } catch (err: any) {
      console.error('Failed to start call:', err)
      setError(err?.message || 'Failed to start call. Please check your network and credentials.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex-1 flex flex-col justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Column: Product Information & Value Props */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full neu-inset text-blue-700 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Instant Loan Assessment &amp; Advisory
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-800 tracking-tight leading-[1.15]">
            Loan Against Property <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800">
              Voice Advisory Consultation
            </span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
            Discuss your property financing needs with <strong>Vikram</strong>, our AI loan advisor.
            Receive instant, deterministic preliminary qualification for amounts up to <strong>₹75 Lakhs</strong> with transparent terms and document verification.
          </p>

          {/* Feature Highlights with Neumorphic Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3">
            <div className="neu-flat rounded-2xl p-5 border border-white/70 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl neu-inset flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Instant Verification</h4>
                <p className="text-xs text-slate-500 mt-1 leading-normal">
                  Strict credit guidelines deterministically evaluated for residential, commercial &amp; industrial properties.
                </p>
              </div>
            </div>

            <div className="neu-flat rounded-2xl p-5 border border-white/70 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl neu-inset flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Competitive Terms</h4>
                <p className="text-xs text-slate-500 mt-1 leading-normal">
                  Attractive interest rates starting from 9.25% p.a. with flexible repayment tenures up to 15 years.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Start Call Form */}
        <div className="lg:col-span-5">
          {error && (
            <div className="mb-5 p-4 neu-raised border border-rose-200/80 rounded-2xl flex items-center gap-3 text-rose-800 text-xs font-semibold">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <CallForm onSubmit={handleStartCall} loading={loading} />
        </div>
      </div>
    </div>
  )
}
