import { __toESM } from "../_runtime.mjs";
import { require_jsx_runtime, require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { ChevronRight, CircleAlert, CircleCheckBig, CircleX, Clock, FileText, RefreshCw, RotateCcwClock, Trash } from "../_libs/lucide-react.mjs";
import { clearAllCallsApi, deleteCallApi, listCallsServerFn } from "./call-actions-OH0ftX5b.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/history-mgIEzACs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HistoryPage() {
	const [calls, setCalls] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [isRefreshing, setIsRefreshing] = (0, import_react.useState)(false);
	const [deletingId, setDeletingId] = (0, import_react.useState)(null);
	const [selectedCall, setSelectedCall] = (0, import_react.useState)(null);
	const loadCalls = (0, import_react.useCallback)(async (showRefreshing = false) => {
		if (showRefreshing) setIsRefreshing(true);
		try {
			const list = await listCallsServerFn();
			setCalls(list || []);
		} catch (e) {
			console.error("Failed to load call history:", e);
		} finally {
			setLoading(false);
			setIsRefreshing(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		loadCalls();
	}, [loadCalls]);
	const handleDeleteCall = async (callId, e) => {
		if (e) e.stopPropagation();
		if (!window.confirm("Are you sure you want to delete this consultation record?")) return;
		setDeletingId(callId);
		try {
			await deleteCallApi(callId);
			setCalls((prev) => prev.filter((c) => c.id !== callId));
			if (selectedCall?.id === callId) setSelectedCall(null);
		} catch (err) {
			alert(`Failed to delete record: ${err?.message || "Unknown error"}`);
		} finally {
			setDeletingId(null);
		}
	};
	const handleClearAll = async () => {
		if (!window.confirm("Are you sure you want to delete all consultation records? This cannot be undone.")) return;
		try {
			await clearAllCallsApi();
			setCalls([]);
			setSelectedCall(null);
		} catch (err) {
			alert(`Failed to clear history: ${err?.message || "Unknown error"}`);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 flex flex-col space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-2xl font-black text-slate-800 flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-9 h-9 rounded-xl neu-soft flex items-center justify-center text-blue-600",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcwClock, { className: "w-5 h-5" })
					}), "Consultation History & Records"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-slate-500 mt-1 font-medium",
					children: "Recorded loan consultations, verification outcomes, and customer qualification details"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 self-end sm:self-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => loadCalls(true),
						disabled: isRefreshing || loading,
						className: "neu-button px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-600 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50",
						title: "Refresh history list",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-blue-600" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Refresh" })]
					}), calls.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleClearAll,
						className: "neu-button-danger px-4 py-2 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-2 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Clear History" })]
					})]
				})]
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-center py-20 text-slate-500 text-sm font-semibold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3" }), "Loading consultation records..."]
			}) : calls.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center py-20 neu-inset rounded-3xl border border-white/60",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-12 h-12 text-slate-400 mx-auto mb-3" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-bold text-slate-700",
						children: "No consultation records found"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500 mt-1",
						children: "Start a voice consultation from the home dashboard to generate qualification records."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "neu-raised rounded-3xl overflow-hidden border border-white/80",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-xs text-slate-700",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "neu-flat text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200/80",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-4 px-5 font-bold",
									children: "Applicant"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-4 px-5 font-bold",
									children: "Advisor & Channel"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-4 px-5 font-bold",
									children: "Qualification Result"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-4 px-5 font-bold",
									children: "Loan / Property"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-4 px-5 font-bold",
									children: "Date & Duration"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-4 px-5 font-bold text-right",
									children: "Actions"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-slate-200/60 bg-transparent",
							children: calls.map((c) => {
								const isCallEnded = c.callStatus === "ended" || c.callStatus === "completed";
								const rawEligibility = c.eligibilityStatus || "in_progress";
								const status = isCallEnded && rawEligibility === "in_progress" ? "incomplete" : rawEligibility;
								const isEligible = status === "eligible";
								const isFailed = status === "not_eligible";
								const isIncomplete = status === "incomplete";
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									onClick: () => setSelectedCall(c),
									className: "hover:bg-blue-50/40 transition-colors cursor-pointer",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-4 px-5 font-bold text-slate-800",
											children: c.customerName
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-4 px-5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `w-2 h-2 rounded-full ${isCallEnded ? "bg-slate-400" : "bg-emerald-500 animate-pulse"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-slate-800 font-semibold",
													children: c.agentName || "Vikram"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "English Voice" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: isCallEnded ? "text-slate-500" : "text-emerald-700 font-bold",
														children: isCallEnded ? "Completed" : "Live Now"
													})
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-4 px-5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${isEligible ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : isFailed ? "bg-rose-100 text-rose-800 border border-rose-300" : isIncomplete ? "bg-amber-100 text-amber-800 border border-amber-300" : "bg-blue-100 text-blue-800 border border-blue-300"}`,
												children: [isEligible ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "w-3.5 h-3.5 text-emerald-600" }) : isFailed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "w-3.5 h-3.5 text-rose-600" }) : isIncomplete ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-3.5 h-3.5 text-amber-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3.5 h-3.5 text-blue-600 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "capitalize",
													children: status === "incomplete" ? "Incomplete" : status.replace("_", " ")
												})]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-4 px-5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-slate-800 font-bold",
												children: c.loanAmountInr ? `₹${Number(c.loanAmountInr).toLocaleString("en-IN")}` : "—"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[11px] text-slate-500 font-medium capitalize",
												children: c.propertyType || "Type Pending"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-4 px-5 text-slate-500",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-medium",
												children: new Date(c.createdAt).toLocaleDateString("en-IN")
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[11px]",
												children: c.durationSeconds ? `${c.durationSeconds}s` : isCallEnded ? "< 1 min" : "Live now"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-4 px-5 text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-end gap-2.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													onClick: (e) => {
														e.stopPropagation();
														setSelectedCall(c);
													},
													className: "neu-button px-3 py-1.5 rounded-xl text-blue-600 hover:text-blue-700 font-bold inline-flex items-center gap-1 cursor-pointer",
													title: "Inspect Details",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Inspect" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5" })]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: (e) => handleDeleteCall(c.id, e),
													disabled: deletingId === c.id,
													className: "p-2 rounded-xl neu-button text-slate-500 hover:text-rose-600 transition-colors cursor-pointer",
													title: "Delete Record",
													children: deletingId === c.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-3.5 h-3.5 border-2 border-rose-600 border-t-transparent rounded-full animate-spin inline-block" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash, { className: "w-4 h-4" })
												})]
											})
										})
									]
								}, c.id);
							})
						})]
					})
				})
			}),
			selectedCall && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "neu-floating rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 border border-white/90 max-h-[88vh] flex flex-col shadow-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pb-4 border-b border-slate-200/80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "text-lg font-bold text-slate-800",
							children: ["Consultation Record — ", selectedCall.customerName]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-slate-500 font-mono mt-0.5",
							children: ["Session ID: ", selectedCall.id]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => handleDeleteCall(selectedCall.id),
								disabled: deletingId === selectedCall.id,
								className: "neu-button-danger text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Delete" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSelectedCall(null),
								className: "neu-button text-slate-700 hover:text-slate-900 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer",
								children: "Close"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 flex-1 overflow-y-auto text-xs text-slate-700 pr-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-3 p-4 neu-inset rounded-2xl",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-500 font-medium",
											children: "Status:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-slate-800 capitalize",
											children: selectedCall.callStatus === "ended" ? "Completed" : selectedCall.callStatus || "Ongoing"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-slate-400",
										children: "•"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-500 font-medium",
											children: "Duration:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-slate-800",
											children: selectedCall.durationSeconds ? `${selectedCall.durationSeconds}s` : "< 1 min"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-slate-400",
										children: "•"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-500 font-medium",
											children: "Advisor:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-slate-800",
											children: selectedCall.agentName || "Vikram"
										})]
									})
								]
							}),
							selectedCall.disqualificationReason && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 neu-soft border border-rose-300 rounded-2xl bg-rose-50/60 text-rose-900",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold block mb-1",
									children: "Disqualification Reason:"
								}), selectedCall.disqualificationReason]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 sm:grid-cols-3 gap-3.5 p-4 neu-soft rounded-2xl border border-white/80",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-500 font-medium block",
										children: "Property Type:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold capitalize text-slate-800",
										children: selectedCall.propertyType || "—"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-500 font-medium block",
										children: "Ownership:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold capitalize text-slate-800",
										children: selectedCall.ownership ? `${selectedCall.ownership} Owner` : "—"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-500 font-medium block",
										children: "Original Documents:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-800",
										children: selectedCall.originalDocuments === true ? "Available (Yes)" : selectedCall.originalDocuments === false ? "Not Available (No)" : "—"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-500 font-medium block",
										children: "Requested Loan:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-800",
										children: selectedCall.loanAmountInr ? `₹${Number(selectedCall.loanAmountInr).toLocaleString("en-IN")}` : "—"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-500 font-medium block",
										children: "Property Valuation:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-800",
										children: selectedCall.marketValueInr ? `₹${Number(selectedCall.marketValueInr).toLocaleString("en-IN")}` : "—"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-500 font-medium block",
										children: "Repayment Tenure:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-800",
										children: selectedCall.tenureYears ? `${selectedCall.tenureYears} Years` : "—"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-500 font-medium block",
										children: "Occupation:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold capitalize text-slate-800",
										children: selectedCall.occupation ? selectedCall.occupation.replace("_", " ") : "—"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-500 font-medium block",
										children: "Income Mode:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold capitalize text-slate-800",
										children: selectedCall.incomeMode || "—"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-500 font-medium block",
										children: "Verification Result:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold capitalize text-emerald-700",
										children: selectedCall.eligibilityStatus ? selectedCall.eligibilityStatus.replace("_", " ") : "—"
									})] })
								]
							}),
							selectedCall.transcript && selectedCall.transcript.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-bold text-slate-800 mb-2",
									children: "Transcript Summary:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-2.5 neu-inset p-4 rounded-2xl max-h-64 overflow-y-auto",
									children: selectedCall.transcript.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-bold text-blue-700 capitalize",
											children: [t.role === "agent" ? "Vikram" : "Applicant", ": "]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-800",
											children: t.content
										})]
									}, i))
								})]
							})
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { HistoryPage as component };
