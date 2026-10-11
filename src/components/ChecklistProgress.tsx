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
    <div className="neu-flat rounded-3xl p-5 sm:p-6 border border-white/80 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg neu-inset flex items-center justify-center text-blue-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            7-Point Eligibility Parameters
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified deterministically by lending rules
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold px-3 py-1 rounded-full neu-inset text-blue-700">
            {passedCount} / 7 Verified
          </span>
        </div>
      </div>

      {/* Disqualification Banner if not eligible */}
      {checklist.overallStatus === 'not_eligible' && checklist.failedReason && (
        <div className="mt-4 p-3.5 neu-raised border border-rose-300 rounded-2xl flex items-start gap-3 bg-rose-50/50">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-900">
            <span className="font-bold block text-rose-800 mb-0.5">Disqualification Triggered</span>
            {checklist.failedReason}
          </div>
        </div>
      )}

      {/* Checklist items list */}
      <div className="mt-4 space-y-2.5 overflow-y-auto flex-1 pr-1">
        {items.map(item => (
          <div
            key={item.id}
            className={`p-3.5 rounded-2xl border transition-all ${
              item.status === 'passed'
                ? 'neu-soft border-emerald-300/60 bg-emerald-50/40 text-emerald-950'
                : item.status === 'failed'
                ? 'neu-soft border-rose-300/60 bg-rose-50/40 text-rose-950'
                : 'neu-inset border-transparent text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {item.status === 'passed' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : item.status === 'failed' ? (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <div>
                  <div className="text-xs font-bold text-slate-800">{item.title}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{item.subtitle}</div>
                </div>
              </div>

              {item.value && (
                <div
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize ${
                    item.status === 'passed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : item.status === 'failed'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-slate-200 text-slate-700'
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
