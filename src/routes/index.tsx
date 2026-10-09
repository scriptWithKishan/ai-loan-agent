import React, { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { CallForm, CallFormData } from '../components/CallForm'
import { startCallServerFn } from '../services/call-actions'
import { ShieldAlert, Zap, Award, CheckCircle } from 'lucide-react'

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
    try {
      const response = await startCallServerFn({
        data: {
          customerName: formData.customerName,
          phoneNumber: formData.phoneNumber,
          agentName: formData.agentName,
          agentGender: formData.agentGender,
          language: formData.language,
        },
      })

      // Store accessToken in sessionStorage for the Live Call WebRTC client
      if (response.accessToken) {
        sessionStorage.setItem(`retell_token_${response.callId}`, response.accessToken)
      }

      navigate({
        to: '/call/$callId',
        params: { callId: response.callId },
      })
    } catch (err: any) {
      console.error('Failed to start call:', err)
      setError(err?.message || 'Failed to start call. Please check your credentials.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 flex flex-col justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Product Information & Value Props */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            Preliminary Qualification Voice Agent
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Loan Against Property <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-sky-300 to-violet-400">
              Conversational Voice Advisor
            </span>
          </h1>

          <p className="text-slate-300 text-base leading-relaxed max-w-2xl">
            Conducts an intelligent, human-like voice conversation to verify applicant eligibility
            up to <strong>₹75 Lakhs</strong>. Deterministically checks property type, original documents,
            income banking mode, and requested parameters before specialist follow-up.
          </p>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-slate-100">Deterministic Engine</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Business criteria strictly enforced by TypeScript code, not hallucinated by the LLM.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
              <Award className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-slate-100">Bilingual Support</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Speaks natural English or Hindi with strict gendered grammatical adherence.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Start Call Form */}
        <div className="lg:col-span-5">
          {error && (
            <div className="mb-4 p-3 bg-rose-950/50 border border-rose-800/80 rounded-xl flex items-center gap-2 text-rose-200 text-xs">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <CallForm onSubmit={handleStartCall} loading={loading} />
        </div>
      </div>
    </div>
  )
}
