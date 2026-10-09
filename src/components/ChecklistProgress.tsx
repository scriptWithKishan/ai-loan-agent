import React from 'react'
import { CheckCircle2, XCircle, Clock, AlertTriangle, ShieldCheck } from 'lucide-react'

export interface ChecklistState {
  propertyType?: string | null
  ownership?: string | null
  originalDocuments?: boolean | null
  loanAmountInr?: number | null
  occupation?: string | null
  incomeMode?: string | null
  marketValueInr?: number | null
  tenureYears?: number | null
  overallStatus: 'in_progress' | 'eligible' | 'not_eligible'
  failedReason?: string | null
}

interface ChecklistProgressProps {
  checklist: ChecklistState
}

export const ChecklistProgress: React.FC<ChecklistProgressProps> = ({ checklist }) => {
  const items = [
    {
      id: 'property_type',
      title: '1. Property Type',
      subtitle: 'Residential / Commercial / Industrial',
      status: checklist.propertyType
        ? ['residential', 'commercial', 'industrial'].includes(checklist.propertyType.toLowerCase())
          ? 'passed'
          : 'failed'
        : 'pending',
      value: checklist.propertyType || null,
    },
    {
      id: 'ownership',
      title: '2. Ownership Status',
      subtitle: 'Sole or Joint ownership with family',
      status: checklist.ownership ? 'passed' : 'pending',
      value: checklist.ownership || null,
    },
    {
      id: 'original_documents',
      title: '3. Original Documents',
      subtitle: 'Original title deeds available for verification',
      status:
        checklist.originalDocuments === true
          ? 'passed'
          : checklist.originalDocuments === false
          ? 'failed'
          : 'pending',
      value:
        checklist.originalDocuments === true
          ? 'Originals Ready'
          : checklist.originalDocuments === false
          ? 'Originals Not Available'
          : null,
    },
    {
      id: 'loan_amount',
      title: '4. Loan Amount',
      subtitle: 'Maximum preliminary ceiling ₹75 Lakhs',
      status:
        checklist.loanAmountInr !== null && checklist.loanAmountInr !== undefined
          ? checklist.loanAmountInr <= 75_00_000
            ? 'passed'
            : 'failed'
          : 'pending',
      value:
        checklist.loanAmountInr !== null && checklist.loanAmountInr !== undefined
          ? `₹${checklist.loanAmountInr.toLocaleString('en-IN')}`
          : null,
    },
    {
      id: 'income_mode',
      title: '5. Income & Banking Mode',
      subtitle: 'Salary / Business credited via Bank',
      status:
        checklist.incomeMode
          ? checklist.incomeMode.toLowerCase() === 'bank'
            ? 'passed'
            : 'failed'
          : 'pending',
      value: checklist.incomeMode
        ? `${checklist.occupation || 'Income'}: ${checklist.incomeMode.toUpperCase()}`
        : null,
    },
    {
      id: 'market_value',
      title: '6. Estimated Market Value',
      subtitle: 'Customer property valuation estimate',
      status: checklist.marketValueInr ? 'passed' : 'pending',
      value: checklist.marketValueInr ? `₹${checklist.marketValueInr.toLocaleString('en-IN')}` : null,
    },
    {
      id: 'tenure',
      title: '7. Repayment Tenure',
      subtitle: 'Desired tenure in years',
      status: checklist.tenureYears ? 'passed' : 'pending',
      value: checklist.tenureYears ? `${checklist.tenureYears} Years` : null,
    },
  ]

  const passedCount = items.filter(i => i.status === 'passed').length

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            7-Point Eligibility Engine
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified deterministically by rules engine
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
            {passedCount} / 7 Verified
          </span>
        </div>
      </div>

      {/* Disqualification Banner if not eligible */}
      {checklist.overallStatus === 'not_eligible' && checklist.failedReason && (
        <div className="mt-4 p-3.5 bg-rose-950/40 border border-rose-800/60 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-200">
            <span className="font-semibold block text-rose-300 mb-0.5">Disqualification Triggered</span>
            {checklist.failedReason}
          </div>
        </div>
      )}

      {/* Checklist items list */}
      <div className="mt-4 space-y-2.5 overflow-y-auto flex-1 pr-1">
        {items.map(item => (
          <div
            key={item.id}
            className={`p-3 rounded-xl border transition-all ${
              item.status === 'passed'
                ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-100'
                : item.status === 'failed'
                ? 'bg-rose-950/25 border-rose-800/40 text-rose-100'
                : 'bg-slate-800/40 border-slate-800 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {item.status === 'passed' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : item.status === 'failed' ? (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                )}
                <div>
                  <div className="text-xs font-medium text-slate-200">{item.title}</div>
                  <div className="text-[11px] text-slate-400">{item.subtitle}</div>
                </div>
              </div>

              {item.value && (
                <div
                  className={`text-xs font-semibold px-2 py-0.5 rounded capitalize ${
                    item.status === 'passed'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : item.status === 'failed'
                      ? 'bg-rose-500/20 text-rose-300'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {item.value}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
