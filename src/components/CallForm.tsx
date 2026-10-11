import React, { useState } from 'react'
import { PhoneCall, User, ShieldCheck, UserCheck, Headset } from 'lucide-react'

export interface CallFormData {
  customerName: string
}

interface CallFormProps {
  onSubmit: (data: CallFormData) => Promise<void>
  loading: boolean
}

export const CallForm: React.FC<CallFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState<CallFormData>({
    customerName: 'Rahul Sharma',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.customerName.trim()) return
    await onSubmit(formData)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="neu-raised rounded-3xl p-6 sm:p-8 border border-white/80 space-y-6"
    >
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/70">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl neu-soft flex items-center justify-center text-blue-600">
              <Headset className="w-4 h-4" />
            </div>
            Speak with Loan Advisor
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Connects an instant, live voice consultation directly in your browser
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full neu-inset text-emerald-700">
          Audio Active
        </span>
      </div>

      <div className="space-y-4">
        {/* Customer Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
            Applicant Full Name
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-3.5 text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              value={formData.customerName}
              onChange={e => setFormData({ ...formData, customerName: e.target.value })}
              placeholder="e.g. Rahul Sharma"
              className="w-full neu-inset rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 border-none transition-all"
            />
          </div>
        </div>

        {/* Dedicated Advisor & Session Info */}
        <div className="neu-soft rounded-2xl p-4 border border-white/60 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl neu-inset flex items-center justify-center text-blue-600 font-bold text-sm">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-800">Vikram</div>
              <div className="text-xs text-slate-500">Senior LAP Advisor • Sunrise Capital</div>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block px-3 py-1 rounded-full neu-inset text-blue-700 font-semibold text-xs">
              English Consultation
            </span>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 rounded-2xl neu-button-primary disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2.5 cursor-pointer transition-all"
        >
          {loading ? (
            <span className="flex items-center gap-2.5">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Connecting Audio Line...
            </span>
          ) : (
            <>
              <PhoneCall className="w-4 h-4" />
              Start Voice Consultation
            </>
          )}
        </button>
      </div>

      <div className="text-xs text-slate-500 flex items-center justify-center gap-2 text-center pt-1 font-medium">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        No paperwork required for initial qualification • Instant eligibility review up to ₹75 Lakhs
      </div>
    </form>
  )
}
