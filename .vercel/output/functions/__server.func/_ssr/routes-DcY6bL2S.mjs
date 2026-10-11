import { __toESM } from "../_runtime.mjs";
import { require_jsx_runtime, require_react, useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { Building, CircleCheck, Headset, PhoneCall, ShieldAlert, ShieldCheck, Sparkles, User, UserCheck } from "../_libs/lucide-react.mjs";
import { startCallServerFn } from "./call-actions-OH0ftX5b.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DcY6bL2S.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CallForm = ({ onSubmit, loading }) => {
	const [formData, setFormData] = (0, import_react.useState)({ customerName: "Rahul Sharma" });
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.customerName.trim()) return;
		await onSubmit(formData);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSubmit,
		className: "neu-raised rounded-3xl p-6 sm:p-8 border border-white/80 space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between pb-4 border-b border-slate-200/70",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-xl font-bold text-slate-800 flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-8 h-8 rounded-xl neu-soft flex items-center justify-center text-blue-600",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headset, { className: "w-4 h-4" })
					}), "Speak with Loan Advisor"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-slate-500 mt-1",
					children: "Connects an instant, live voice consultation directly in your browser"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-semibold px-3 py-1 rounded-full neu-inset text-emerald-700",
					children: "Audio Active"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2",
					children: "Applicant Full Name"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute left-3.5 top-3.5 text-slate-400",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-4 h-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						required: true,
						value: formData.customerName,
						onChange: (e) => setFormData({
							...formData,
							customerName: e.target.value
						}),
						placeholder: "e.g. Rahul Sharma",
						className: "w-full neu-inset rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 border-none transition-all"
					})]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "neu-soft rounded-2xl p-4 border border-white/60 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-11 h-11 rounded-2xl neu-inset flex items-center justify-center text-blue-600 font-bold text-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "w-5 h-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-bold text-sm text-slate-800",
							children: "Vikram"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-slate-500",
							children: "Senior LAP Advisor • Sunrise Capital"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-right",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline-block px-3 py-1 rounded-full neu-inset text-blue-700 font-semibold text-xs",
							children: "English Consultation"
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pt-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					disabled: loading,
					className: "w-full py-4 px-6 rounded-2xl neu-button-primary disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2.5 cursor-pointer transition-all",
					children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }), "Connecting Audio Line..."]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneCall, { className: "w-4 h-4" }), "Start Voice Consultation"] })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-xs text-slate-500 flex items-center justify-center gap-2 text-center pt-1 font-medium",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4 text-emerald-600 shrink-0" }), "No paperwork required for initial qualification • Instant eligibility review up to ₹75 Lakhs"]
			})
		]
	});
};
function IndexPage() {
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const navigate = useNavigate();
	const handleStartCall = async (formData) => {
		setLoading(true);
		setError(null);
		try {
			if (typeof navigator !== "undefined" && navigator.mediaDevices) (await navigator.mediaDevices.getUserMedia({ audio: true })).getTracks().forEach((t) => t.stop());
		} catch (micErr) {
			setError("Microphone access is required to talk with the loan advisor. Please allow microphone permissions in your browser.");
			setLoading(false);
			return;
		}
		try {
			const response = await startCallServerFn({ data: {
				customerName: formData.customerName,
				agentName: "Vikram",
				agentGender: "male",
				language: "English"
			} });
			if (response.accessToken) sessionStorage.setItem(`retell_config_${response.callId}`, JSON.stringify({
				retellCallId: response.retellCallId,
				accessToken: response.accessToken,
				transport: response.transport || "gateway",
				iceServers: response.iceServers || []
			}));
			navigate({
				to: "/call/$callId",
				params: { callId: response.callId }
			});
		} catch (err) {
			console.error("Failed to start call:", err);
			setError(err?.message || "Failed to start call. Please check your network and credentials.");
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex-1 flex flex-col justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-7 space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full neu-inset text-blue-700 text-xs font-bold tracking-wide",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5 text-blue-600" }), "Instant Loan Assessment & Advisory"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "text-3xl sm:text-5xl font-extrabold text-slate-800 tracking-tight leading-[1.15]",
						children: [
							"Loan Against Property ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800",
								children: "Voice Advisory Consultation"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl font-normal",
						children: [
							"Discuss your property financing needs with ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Vikram" }),
							", our AI loan advisor. Receive instant, deterministic preliminary qualification for amounts up to ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "₹75 Lakhs" }),
							" with transparent terms and document verification."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "neu-flat rounded-2xl p-5 border border-white/70 flex items-start gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-10 h-10 rounded-xl neu-inset flex items-center justify-center text-emerald-600 shrink-0 mt-0.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-5 h-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-sm font-bold text-slate-800",
								children: "Instant Verification"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-500 mt-1 leading-normal",
								children: "Strict credit guidelines deterministically evaluated for residential, commercial & industrial properties."
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "neu-flat rounded-2xl p-5 border border-white/70 flex items-start gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-10 h-10 rounded-xl neu-inset flex items-center justify-center text-blue-600 shrink-0 mt-0.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, { className: "w-5 h-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-sm font-bold text-slate-800",
								children: "Competitive Terms"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-500 mt-1 leading-normal",
								children: "Attractive interest rates starting from 9.25% p.a. with flexible repayment tenures up to 15 years."
							})] })]
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-5",
				children: [error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 p-4 neu-raised border border-rose-200/80 rounded-2xl flex items-center gap-3 text-rose-800 text-xs font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-5 h-5 text-rose-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CallForm, {
					onSubmit: handleStartCall,
					loading
				})]
			})]
		})
	});
}
//#endregion
export { IndexPage as component };
