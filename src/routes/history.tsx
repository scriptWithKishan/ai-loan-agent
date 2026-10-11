import React, { useEffect, useState, useCallback } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { listCallsServerFn, deleteCallApi, clearAllCallsApi } from '../services/call-actions'
import { History, CheckCircle, XCircle, Clock, AlertCircle, ChevronRight, FileText, Trash2, RefreshCw } from 'lucide-react'

export const Route = createFileRoute('/history')({
  component: HistoryPage,
})

function HistoryPage() {
  const [calls, setCalls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [selectedCall, setSelectedCall] = useState<any | null>(null)

  const loadCalls = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true)
    try {
      const list = await listCallsServerFn()
      setCalls(list || [])
    } catch (e) {
      console.error('Failed to load call history:', e)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    loadCalls()
  }, [loadCalls])

  const handleDeleteCall = async (callId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()

    if (!window.confirm('Are you sure you want to delete this consultation record?')) {
      return
    }

    setDeletingId(callId)
    try {
      await deleteCallApi(callId)
      setCalls(prev => prev.filter(c => c.id !== callId))
      if (selectedCall?.id === callId) {
        setSelectedCall(null)
      }
    } catch (err: any) {
      alert(`Failed to delete record: ${err?.message || 'Unknown error'}`)
    } finally {
      setDeletingId(null)
    }
  }

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to delete all consultation records? This cannot be undone.')) {
      return
    }

    try {
      await clearAllCallsApi()
      setCalls([])
      setSelectedCall(null)
    } catch (err: any) {
      alert(`Failed to clear history: ${err?.message || 'Unknown error'}`)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 flex flex-col space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl neu-soft flex items-center justify-center text-blue-600">
              <History className="w-5 h-5" />
            </div>
            Consultation History &amp; Records
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Recorded loan consultations, verification outcomes, and customer qualification details
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            onClick={() => loadCalls(true)}
            disabled={isRefreshing || loading}
            className="neu-button px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-600 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            title="Refresh history list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
            <span>Refresh</span>
          </button>

          {calls.length > 0 && (
            <button
              onClick={handleClearAll}
              className="neu-button-danger px-4 py-2 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-2 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-500 text-sm font-semibold">
          <span className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3" />
          Loading consultation records...
        </div>
      ) : calls.length === 0 ? (
        <div className="text-center py-20 neu-inset rounded-3xl border border-white/60">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">No consultation records found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Start a voice consultation from the home dashboard to generate qualification records.
          </p>
        </div>
      ) : (
        <div className="neu-raised rounded-3xl overflow-hidden border border-white/80">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="neu-flat text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                <tr>
                  <th className="py-4 px-5 font-bold">Applicant</th>
                  <th className="py-4 px-5 font-bold">Advisor &amp; Channel</th>
                  <th className="py-4 px-5 font-bold">Qualification Result</th>
                  <th className="py-4 px-5 font-bold">Loan / Property</th>
                  <th className="py-4 px-5 font-bold">Date &amp; Duration</th>
                  <th className="py-4 px-5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 bg-transparent">
                {calls.map(c => {
                  const isCallEnded = c.callStatus === 'ended' || c.callStatus === 'completed'
                  const rawEligibility = c.eligibilityStatus || 'in_progress'

                  const status =
                    isCallEnded && rawEligibility === 'in_progress'
                      ? 'incomplete'
                      : rawEligibility

                  const isEligible = status === 'eligible'
                  const isFailed = status === 'not_eligible'
                  const isIncomplete = status === 'incomplete'

                  return (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedCall(c)}
                      className="hover:bg-blue-50/40 transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-5 font-bold text-slate-800">
                        {c.customerName}
                      </td>

                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isCallEnded ? 'bg-slate-400' : 'bg-emerald-500 animate-pulse'
                            }`}
                          />
                          <span className="text-slate-800 font-semibold">{c.agentName || 'Vikram'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                          <span>English Voice</span>
                          <span>•</span>
                          <span
                            className={
                              isCallEnded
                                ? 'text-slate-500'
                                : 'text-emerald-700 font-bold'
                            }
                          >
                            {isCallEnded ? 'Completed' : 'Live Now'}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                            isEligible
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : isFailed
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : isIncomplete
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-blue-100 text-blue-800 border border-blue-300'
                          }`}
                        >
                          {isEligible ? (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          ) : isFailed ? (
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          ) : isIncomplete ? (
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                          )}
                          <span className="capitalize">
                            {status === 'incomplete'
                              ? 'Incomplete'
                              : status.replace('_', ' ')}
                          </span>
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        <div className="text-slate-800 font-bold">
                          {c.loanAmountInr ? `₹${Number(c.loanAmountInr).toLocaleString('en-IN')}` : '—'}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium capitalize">
                          {c.propertyType || 'Type Pending'}
                        </div>
                      </td>

                      <td className="py-4 px-5 text-slate-500">
                        <div className="font-medium">{new Date(c.createdAt).toLocaleDateString('en-IN')}</div>
                        <div className="text-[11px]">
                          {c.durationSeconds
                            ? `${c.durationSeconds}s`
                            : isCallEnded
                            ? '< 1 min'
                            : 'Live now'}
                        </div>
                      </td>

                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <button
                            onClick={e => {
                              e.stopPropagation()
                              setSelectedCall(c)
                            }}
                            className="neu-button px-3 py-1.5 rounded-xl text-blue-600 hover:text-blue-700 font-bold inline-flex items-center gap-1 cursor-pointer"
                            title="Inspect Details"
                          >
                            <span>Inspect</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={e => handleDeleteCall(c.id, e)}
                            disabled={deletingId === c.id}
                            className="p-2 rounded-xl neu-button text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete Record"
                          >
                            {deletingId === c.id ? (
                              <span className="w-3.5 h-3.5 border-2 border-rose-600 border-t-transparent rounded-full animate-spin inline-block" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedCall && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="neu-floating rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 border border-white/90 max-h-[88vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Consultation Record — {selectedCall.customerName}
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Session ID: {selectedCall.id}</p>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => handleDeleteCall(selectedCall.id)}
                  disabled={deletingId === selectedCall.id}
                  className="neu-button-danger text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
                <button
                  onClick={() => setSelectedCall(null)}
                  className="neu-button text-slate-700 hover:text-slate-900 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto text-xs text-slate-700 pr-1">
              {/* Call Overview Status Badges */}
              <div className="flex flex-wrap items-center gap-3 p-4 neu-inset rounded-2xl">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-medium">Status:</span>
                  <span className="font-bold text-slate-800 capitalize">
                    {selectedCall.callStatus === 'ended' ? 'Completed' : selectedCall.callStatus || 'Ongoing'}
                  </span>
                </div>
                <div className="text-slate-400">•</div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-medium">Duration:</span>
                  <span className="font-bold text-slate-800">
                    {selectedCall.durationSeconds ? `${selectedCall.durationSeconds}s` : '< 1 min'}
                  </span>
                </div>
                <div className="text-slate-400">•</div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-medium">Advisor:</span>
                  <span className="font-bold text-slate-800">{selectedCall.agentName || 'Vikram'}</span>
                </div>
              </div>

              {selectedCall.disqualificationReason && (
                <div className="p-4 neu-soft border border-rose-300 rounded-2xl bg-rose-50/60 text-rose-900">
                  <span className="font-bold block mb-1">Disqualification Reason:</span>
                  {selectedCall.disqualificationReason}
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 p-4 neu-soft rounded-2xl border border-white/80">
                <div>
                  <span className="text-slate-500 font-medium block">Property Type:</span>
                  <span className="font-bold capitalize text-slate-800">{selectedCall.propertyType || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Ownership:</span>
                  <span className="font-bold capitalize text-slate-800">{selectedCall.ownership ? `${selectedCall.ownership} Owner` : '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Original Documents:</span>
                  <span className="font-bold text-slate-800">
                    {selectedCall.originalDocuments === true
                      ? 'Available (Yes)'
                      : selectedCall.originalDocuments === false
                      ? 'Not Available (No)'
                      : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Requested Loan:</span>
                  <span className="font-bold text-slate-800">
                    {selectedCall.loanAmountInr
                      ? `₹${Number(selectedCall.loanAmountInr).toLocaleString('en-IN')}`
                      : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Property Valuation:</span>
                  <span className="font-bold text-slate-800">
                    {selectedCall.marketValueInr
                      ? `₹${Number(selectedCall.marketValueInr).toLocaleString('en-IN')}`
                      : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Repayment Tenure:</span>
                  <span className="font-bold text-slate-800">
                    {selectedCall.tenureYears ? `${selectedCall.tenureYears} Years` : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Occupation:</span>
                  <span className="font-bold capitalize text-slate-800">
                    {selectedCall.occupation ? selectedCall.occupation.replace('_', ' ') : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Income Mode:</span>
                  <span className="font-bold capitalize text-slate-800">{selectedCall.incomeMode || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Verification Result:</span>
                  <span className="font-bold capitalize text-emerald-700">
                    {selectedCall.eligibilityStatus ? selectedCall.eligibilityStatus.replace('_', ' ') : '—'}
                  </span>
                </div>
              </div>

              {selectedCall.transcript && selectedCall.transcript.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-bold text-slate-800 mb-2">Transcript Summary:</h4>
                  <div className="space-y-2.5 neu-inset p-4 rounded-2xl max-h-64 overflow-y-auto">
                    {selectedCall.transcript.map((t: any, i: number) => (
                      <div key={i} className="text-xs">
                        <span className="font-bold text-blue-700 capitalize">{t.role === 'agent' ? 'Vikram' : 'Applicant'}: </span>
                        <span className="text-slate-800">{t.content}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
