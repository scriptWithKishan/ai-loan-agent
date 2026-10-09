import React, { useState } from 'react'
import { PhoneCall, Sparkles, User, Globe, Shield } from 'lucide-react'

export interface CallFormData {
  customerName: string
  phoneNumber?: string
  agentName: string
  agentGender: 'female' | 'male'
  language: 'English' | 'Hindi'
}

interface CallFormProps {
  onSubmit: (data: CallFormData) => Promise<void>
  loading: boolean
}

export const CallForm: React.FC<CallFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState<CallFormData>({
    customerName: 'Rahul Sharma',
    phoneNumber: '+91 98765 43210',
    agentName: 'Ananya',
    agentGender: 'female',
    language: 'English',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.customerName.trim()) return
    await onSubmit(formData)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            Initiate AI Voice Call
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Starts a live two-way WebRTC audio session in your browser
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Browser Audio Ready
        </span>
      </div>

      <div className="space-y-4">
        {/* Customer Name */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Customer Name
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              required
              value={formData.customerName}
              onChange={e => setFormData({ ...formData, customerName: e.target.value })}
              placeholder="e.g. Rahul Sharma"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Customer Phone Number <span className="text-slate-500 font-normal">(Optional for web call)</span>
          </label>
          <input
            type="tel"
            value={formData.phoneNumber || ''}
            onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
            placeholder="+91 98765 43210"
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Persona Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Agent Gender */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Advisor Persona & Voice
            </label>
            <select
              value={formData.agentGender}
              onChange={e => {
                const gender = e.target.value as 'female' | 'male'
                setFormData({
                  ...formData,
                  agentGender: gender,
                  agentName: gender === 'female' ? 'Ananya' : 'Aarav',
                })
              }}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="female">Ananya (Female Voice)</option>
              <option value="male">Aarav (Male Voice)</option>
            </select>
          </div>

          {/* Spoken Language */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-400" /> Language
            </label>
            <select
              value={formData.language}
              onChange={e => setFormData({ ...formData, language: e.target.value as 'English' | 'Hindi' })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="English">English (Indian Accent)</option>
              <option value="Hindi">Hindi (हिन्दी / Conversational)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.99] disabled:opacity-50 text-white font-semibold text-sm shadow-xl shadow-indigo-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Connecting Voice Engine...
            </span>
          ) : (
            <>
              <PhoneCall className="w-4 h-4" />
              Start Web Voice Call
            </>
          )}
        </button>
      </div>

      <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5 text-center pt-1">
        <Shield className="w-3.5 h-3.5 text-indigo-400" />
        Pre-approved eligibility check up to ₹75 Lakhs • Low-latency WebRTC
      </div>
    </form>
  )
}
