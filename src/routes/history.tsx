import React, { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { listCallsServerFn } from '../services/call-actions'
import { History, CheckCircle, XCircle, Clock, ChevronRight, FileText } from 'lucide-react'

export const Route = createFileRoute('/history')({
  component: HistoryPage,
})

function HistoryPage() {
  const [calls, setCalls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCall, setSelectedCall] = useState<any | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const list = await listCallsServerFn()
        setCalls(list || [])
      } catch (e) {
        console.error('Failed to load call history:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <History className="w-6 h-6 text-indigo-400" />
            Call History & Lead Records
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Persisted call sessions, outcomes, and preliminary qualification results
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-500 text-sm">
          <span className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mr-3" />
          Loading call history...
        </div>
      ) : calls.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/40 rounded-2xl border border-slate-800">
          <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-200">No calls recorded yet</h3>
          <p className="text-xs text-slate-400 mt-1">
            Initiate a call from the Start Call dashboard to see recorded sessions here.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Customer</th>
                  <th className="py-3.5 px-4 font-semibold">Advisor & Language</th>
                  <th className="py-3.5 px-4 font-semibold">Eligibility Status</th>
                  <th className="py-3.5 px-4 font-semibold">Loan / Property</th>
                  <th className="py-3.5 px-4 font-semibold">Date & Duration</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {calls.map(c => {
                  const status = c.eligibilityStatus || 'in_progress'
                  const isEligible = status === 'eligible'
                  const isFailed = status === 'not_eligible'

                  return (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedCall(c)}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-4 font-medium text-slate-100">
                        {c.customerName}
                        {c.phoneNumber && (
                          <span className="block text-[11px] text-slate-400 mt-0.5">{c.phoneNumber}</span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <span className="text-slate-200 font-medium">{c.agentName}</span>
                        <span className="text-slate-400 block text-[11px]">{c.language}</span>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            isEligible
                              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                              : isFailed
                              ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {isEligible ? (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          ) : isFailed ? (
                            <XCircle className="w-3.5 h-3.5 text-rose-400" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                          )}
                          <span className="capitalize">{status.replace('_', ' ')}</span>
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="text-slate-200">
                          {c.loanAmountInr ? `₹${Number(c.loanAmountInr).toLocaleString('en-IN')}` : '—'}
                        </div>
                        <div className="text-[11px] text-slate-400 capitalize">
                          {c.propertyType || 'Type Pending'}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-slate-400">
                        <div>{new Date(c.createdAt).toLocaleDateString('en-IN')}</div>
                        <div className="text-[11px]">
                          {c.durationSeconds ? `${c.durationSeconds}s` : 'In Progress'}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <span className="text-indigo-400 inline-flex items-center gap-1 font-medium hover:underline">
                          Inspect <ChevronRight className="w-3.5 h-3.5" />
                        </span>
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">Call Details — {selectedCall.customerName}</h3>
                <p className="text-xs text-slate-400">Session ID: {selectedCall.id}</p>
              </div>
              <button
                onClick={() => setSelectedCall(null)}
                className="text-slate-400 hover:text-white text-sm px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto text-xs text-slate-300">
              {selectedCall.disqualificationReason && (
                <div className="p-3 bg-rose-950/40 border border-rose-800 rounded-xl text-rose-200">
                  <span className="font-semibold block mb-0.5">Disqualification Reason:</span>
                  {selectedCall.disqualificationReason}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-950 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block">Property Type:</span>
                  <span className="font-semibold capitalize text-slate-200">{selectedCall.propertyType || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Original Documents:</span>
                  <span className="font-semibold text-slate-200">
                    {selectedCall.originalDocuments === true
                      ? 'Available (Yes)'
                      : selectedCall.originalDocuments === false
                      ? 'No'
                      : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Requested Amount:</span>
                  <span className="font-semibold text-slate-200">
                    {selectedCall.loanAmountInr
                      ? `₹${Number(selectedCall.loanAmountInr).toLocaleString('en-IN')}`
                      : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Income Mode:</span>
                  <span className="font-semibold capitalize text-slate-200">{selectedCall.incomeMode || '—'}</span>
                </div>
              </div>

              {selectedCall.transcript && selectedCall.transcript.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-slate-200 mb-2">Transcript Summary:</h4>
                  <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800 max-h-60 overflow-y-auto">
                    {selectedCall.transcript.map((t: any, i: number) => (
                      <div key={i} className="text-xs">
                        <span className="font-semibold text-indigo-400 capitalize">{t.role}: </span>
                        <span className="text-slate-300">{t.content}</span>
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
