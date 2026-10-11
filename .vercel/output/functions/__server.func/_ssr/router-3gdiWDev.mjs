import { __toESM } from "../_runtime.mjs";
import { HeadContent, Link, Outlet, Scripts, createFileRoute, createRootRoute, createRouter as createRouter$1, lazyRouteComponent, require_jsx_runtime, require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { Retell } from "../_libs/retell-sdk.mjs";
import { require_dist } from "../_libs/dotenv.mjs";
import { Landmark, PhoneCall, RotateCcwClock, Shield } from "../_libs/lucide-react.mjs";
import { ys } from "../_libs/neondatabase__serverless.mjs";
import { bigint, boolean, desc, drizzle, eq, integer, jsonb, or, pgTable, text, timestamp, vector } from "../_libs/drizzle-orm.mjs";
import { GoogleGenAI } from "../_libs/@google/genai.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
var import_dist = /* @__PURE__ */ __toESM(require_dist());
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
import_dist.config();
var retellInstance = null;
function getRetellClient() {
	if (!retellInstance) {
		const apiKey = process.env.RETELL_API_KEY;
		if (!apiKey) throw new Error("RETELL_API_KEY is missing in environment variables.");
		retellInstance = new Retell({ apiKey });
	}
	return retellInstance;
}
async function createRetellWebCall(params) {
	const client = getRetellClient();
	const agentId = params.agentId || process.env.RETELL_AGENT_ID;
	if (!agentId) throw new Error("RETELL_AGENT_ID is missing. Please set it in .env or run pnpm run retell:sync.");
	const response = await client.call.createWebCall({
		agent_id: agentId,
		retell_llm_dynamic_variables: params.dynamicVariables,
		metadata: params.metadata
	});
	return {
		callId: response.call_id,
		accessToken: response.access_token,
		transport: response.transport || "gateway",
		iceServers: response.ice_servers,
		expiresAt: response.expires_at
	};
}
async function stopRetellCall(retellCallId) {
	const apiKey = process.env.RETELL_API_KEY;
	if (!apiKey || apiKey.startsWith("key_xxx") || !retellCallId || retellCallId.startsWith("mock_")) return;
	try {
		await getRetellClient().call.stop(retellCallId);
	} catch (err) {
		console.warn(`[Retell] Could not stop call ${retellCallId}:`, err?.message || err);
	}
}
async function getRetellCall(retellCallId) {
	const apiKey = process.env.RETELL_API_KEY;
	if (!apiKey || apiKey.startsWith("key_xxx") || !retellCallId || retellCallId.startsWith("mock_")) return null;
	try {
		return await getRetellClient().call.retrieve(retellCallId);
	} catch (err) {
		console.warn(`[Retell] Could not retrieve call ${retellCallId}:`, err?.message || err);
		return null;
	}
}
var app_default = "/assets/app-wOjtsY6c.css";
var Route$10 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Sunrise Capital — Loan Against Property Advisor" }
		],
		links: [{
			rel: "stylesheet",
			href: app_default
		}]
	}),
	component: RootComponent
});
function RootComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-[#edf2f7] text-slate-800 min-h-screen",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-screen flex flex-col font-sans selection:bg-blue-500/20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
						className: "neu-flat sticky top-0 z-50 border-b border-white/60",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/",
								className: "flex items-center gap-3.5 group",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-11 h-11 rounded-2xl neu-raised flex items-center justify-center text-blue-600 border border-white/80 group-hover:scale-105 transition-transform duration-200",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { className: "w-5 h-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-bold text-base tracking-tight text-slate-800 flex items-center gap-2",
									children: ["Sunrise Capital", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 shadow-sm",
										children: "Property Loans"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-slate-500 font-medium",
									children: "Loan Against Property Advisory"
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
								className: "flex items-center gap-3 sm:gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/",
										className: "neu-button flex items-center gap-2 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl text-slate-700 hover:text-blue-600 transition-all [&.active]:neu-inset [&.active]:text-blue-600 [&.active]:border-blue-300",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneCall, { className: "w-4 h-4 text-blue-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Start Call" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/history",
										className: "neu-button flex items-center gap-2 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl text-slate-700 hover:text-blue-600 transition-all [&.active]:neu-inset [&.active]:text-blue-600 [&.active]:border-blue-300",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcwClock, { className: "w-4 h-4 text-blue-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Call History" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "hidden md:flex items-center gap-2 pl-4 border-l border-slate-300/80 text-xs font-semibold text-slate-600",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "w-4 h-4 text-emerald-600" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Verified Banking Portal" })
										]
									})
								]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "flex-1 flex flex-col",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
						className: "neu-flat border-t border-white/60 py-5 text-center text-xs text-slate-500 font-medium",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Sunrise Capital Financial Services • Loan Against Property (LAP) Advisory" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-slate-400 text-[11px]",
								children: "Authorized Property Valuation & Qualification System • All Rights Reserved"
							})]
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})]
		})]
	});
}
var $$splitComponentImporter$2 = () => import("./routes-DcY6bL2S.mjs");
var Route$9 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./history-mgIEzACs.mjs");
var Route$8 = createFileRoute("/history")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("../_callId-CHEy4xLJ.mjs");
var Route$7 = createFileRoute("/call/$callId")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var schema_exports = /* @__PURE__ */ __exportAll({
	calls: () => calls,
	knowledgeChunks: () => knowledgeChunks
});
var calls = pgTable("calls", {
	id: text("id").primaryKey(),
	retellCallId: text("retell_call_id").unique(),
	customerName: text("customer_name").notNull(),
	phoneNumber: text("phone_number"),
	agentName: text("agent_name").notNull(),
	agentGender: text("agent_gender").notNull(),
	language: text("language").notNull().default("English"),
	callStatus: text("call_status").notNull().default("registered"),
	eligibilityStatus: text("eligibility_status").notNull().default("in_progress"),
	disqualificationReason: text("disqualification_reason"),
	disqualificationStep: text("disqualification_step"),
	propertyType: text("property_type"),
	ownership: text("ownership"),
	originalDocuments: boolean("original_documents"),
	loanAmountInr: bigint("loan_amount_inr", { mode: "number" }),
	occupation: text("occupation"),
	incomeMode: text("income_mode"),
	marketValueInr: bigint("market_value_inr", { mode: "number" }),
	tenureYears: integer("tenure_years"),
	callbackTime: text("callback_time"),
	transcript: jsonb("transcript").$type().default([]),
	recordingUrl: text("recording_url"),
	durationSeconds: integer("duration_seconds"),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});
var knowledgeChunks = pgTable("knowledge_chunks", {
	id: text("id").primaryKey(),
	topic: text("topic").notNull(),
	content: text("content").notNull(),
	embedding: vector("embedding", { dimensions: 768 }),
	category: text("category").notNull().default("faq"),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});
import_dist.config();
var connectionString = process.env.DATABASE_URL;
if (!connectionString) console.warn("⚠️ Warning: DATABASE_URL is not set. Database operations will fail until configured in .env.");
var sql = ys(connectionString || "postgresql://mock:mock@localhost:5432/mock");
var db = drizzle(sql, { schema: schema_exports });
var inMemoryCalls = /* @__PURE__ */ new Map();
var Route$6 = createFileRoute("/api/calls/start")({ server: { handlers: { POST: async ({ request }) => {
	try {
		const data = await request.json().catch(() => ({})) || {};
		const callId = `call_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
		const customerName = data.customerName || "Valued Customer";
		const agentName = data.agentName || "Vikram";
		const agentGender = data.agentGender || "male";
		const language = data.language || "English";
		let retellResult = {
			callId: `mock_retell_${Date.now()}`,
			accessToken: "mock_token",
			transport: "gateway",
			iceServers: []
		};
		if (process.env.RETELL_API_KEY && !process.env.RETELL_API_KEY.startsWith("key_xxx")) try {
			retellResult = await createRetellWebCall({
				dynamicVariables: {
					customer_name: customerName,
					agent_name: agentName,
					agent_gender: agentGender,
					language
				},
				metadata: { app_call_id: callId }
			});
		} catch (err) {
			console.error("Failed to create Retell web call:", err);
			return new Response(JSON.stringify({ error: `Retell initialization failed: ${err.message || "Check Retell API key and agent configuration"}` }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
		else return new Response(JSON.stringify({ error: "RETELL_API_KEY is not configured in .env" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
		const newCallData = {
			id: callId,
			retellCallId: retellResult.callId,
			customerName,
			phoneNumber: data.phoneNumber || null,
			agentName,
			agentGender,
			language,
			callStatus: "ongoing",
			eligibilityStatus: "in_progress",
			transcript: [],
			accessToken: retellResult.accessToken,
			transport: retellResult.transport,
			iceServers: retellResult.iceServers,
			createdAt: /* @__PURE__ */ new Date(),
			updatedAt: /* @__PURE__ */ new Date()
		};
		inMemoryCalls.set(callId, newCallData);
		inMemoryCalls.set(retellResult.callId, newCallData);
		if (process.env.DATABASE_URL) try {
			await db.insert(calls).values({
				id: callId,
				retellCallId: retellResult.callId,
				customerName,
				phoneNumber: data.phoneNumber || null,
				agentName,
				agentGender,
				language,
				callStatus: "ongoing",
				eligibilityStatus: "in_progress",
				transcript: [],
				createdAt: /* @__PURE__ */ new Date(),
				updatedAt: /* @__PURE__ */ new Date()
			});
		} catch (dbErr) {
			console.warn("Failed to insert call into database, preserved in memory:", dbErr);
		}
		return new Response(JSON.stringify({
			callId,
			retellCallId: retellResult.callId,
			accessToken: retellResult.accessToken,
			transport: retellResult.transport,
			iceServers: retellResult.iceServers,
			session: newCallData
		}), { headers: { "Content-Type": "application/json" } });
	} catch (err) {
		console.error("Unhandled error starting call session:", err);
		return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
} } } });
var Route$5 = createFileRoute("/api/calls/")({ server: { handlers: {
	GET: async () => {
		try {
			if (process.env.DATABASE_URL) try {
				const records = await db.select().from(calls).orderBy(desc(calls.createdAt)).limit(50);
				return new Response(JSON.stringify(records), { headers: { "Content-Type": "application/json" } });
			} catch (dbErr) {
				console.warn("DB list calls failed, using memory fallback:", dbErr);
			}
			const cachedList = Array.from(inMemoryCalls.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
			return new Response(JSON.stringify(cachedList), { headers: { "Content-Type": "application/json" } });
		} catch (err) {
			console.error("Error listing calls:", err);
			return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
	},
	DELETE: async () => {
		try {
			inMemoryCalls.clear();
			if (process.env.DATABASE_URL) try {
				await db.delete(calls);
			} catch (dbErr) {
				console.warn("DB clear error:", dbErr);
			}
			return new Response(JSON.stringify({
				success: true,
				cleared: true
			}), { headers: { "Content-Type": "application/json" } });
		} catch (err) {
			console.error("Error clearing calls:", err);
			return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
	}
} } });
var Route$4 = createFileRoute("/api/calls/$callId")({ server: { handlers: {
	GET: async ({ params }) => {
		try {
			const { callId } = params;
			let callData = inMemoryCalls?.get(callId);
			if (process.env.DATABASE_URL) try {
				const rows = await db.select().from(calls).where(or(eq(calls.id, callId), eq(calls.retellCallId, callId))).limit(1);
				if (rows.length > 0) callData = {
					...rows[0],
					...callData?.accessToken ? { accessToken: callData.accessToken } : {},
					...callData?.transport ? { transport: callData.transport } : {},
					...callData?.iceServers ? { iceServers: callData.iceServers } : {}
				};
			} catch (dbErr) {
				console.warn("DB lookup failed in /api/calls/$callId, using cache fallback:", dbErr);
			}
			if (!callData) return new Response(JSON.stringify({ error: "Call not found" }), {
				status: 404,
				headers: { "Content-Type": "application/json" }
			});
			const targetRetellCallId = callData.retellCallId || (callId.startsWith("call_") ? callId : null);
			if (targetRetellCallId && !targetRetellCallId.startsWith("mock_")) try {
				const { getRetellCall } = await import("./retell-BbifiL0d.mjs");
				const retellCall = await getRetellCall(targetRetellCallId);
				if (retellCall) {
					if (Array.isArray(retellCall.transcript_object) && retellCall.transcript_object.length > 0) {
						const liveTranscript = retellCall.transcript_object.filter((item) => item && (item.role === "agent" || item.role === "user") && item.content).map((item) => ({
							role: item.role === "agent" ? "agent" : "user",
							content: item.content
						}));
						callData.transcript = liveTranscript;
						if (inMemoryCalls.has(callId)) inMemoryCalls.get(callId).transcript = liveTranscript;
					}
					if (retellCall.call_status === "ended") {
						callData.callStatus = "ended";
						if (inMemoryCalls.has(callId)) inMemoryCalls.get(callId).callStatus = "ended";
					}
				}
			} catch (syncErr) {}
			return new Response(JSON.stringify(callData), { headers: { "Content-Type": "application/json" } });
		} catch (err) {
			console.error("Error fetching call:", err);
			return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
	},
	DELETE: async ({ params }) => {
		try {
			const { callId } = params;
			if (inMemoryCalls?.has(callId)) {
				const cached = inMemoryCalls.get(callId);
				inMemoryCalls.delete(callId);
				if (cached?.retellCallId) inMemoryCalls.delete(cached.retellCallId);
			}
			if (process.env.DATABASE_URL) try {
				await db.delete(calls).where(or(eq(calls.id, callId), eq(calls.retellCallId, callId)));
			} catch (dbErr) {
				console.warn("DB delete error:", dbErr);
			}
			return new Response(JSON.stringify({
				success: true,
				deletedId: callId
			}), { headers: { "Content-Type": "application/json" } });
		} catch (err) {
			console.error("Error deleting call:", err);
			return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
	}
} } });
var Route$3 = createFileRoute("/api/calls/end")({ server: { handlers: { POST: async ({ request }) => {
	try {
		const body = await request.json().catch(() => ({}));
		const callId = body?.callId || body?.id;
		const incomingTranscript = Array.isArray(body?.transcript) ? body.transcript : null;
		if (!callId) return new Response(JSON.stringify({ error: "callId is required" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		let retellCallId = null;
		let createdAt = /* @__PURE__ */ new Date();
		const cached = inMemoryCalls?.get(callId);
		if (cached) {
			retellCallId = cached.retellCallId || null;
			if (cached.createdAt) createdAt = new Date(cached.createdAt);
		}
		if (!retellCallId && process.env.DATABASE_URL) try {
			const rows = await db.select({
				retellCallId: calls.retellCallId,
				createdAt: calls.createdAt
			}).from(calls).where(or(eq(calls.id, callId), eq(calls.retellCallId, callId))).limit(1);
			if (rows.length > 0) {
				retellCallId = rows[0].retellCallId || null;
				if (rows[0].createdAt) createdAt = new Date(rows[0].createdAt);
			}
		} catch (e) {}
		let effectiveTranscript = incomingTranscript;
		const targetRetellId = retellCallId || (callId.startsWith("call_") ? callId : null);
		if ((!effectiveTranscript || effectiveTranscript.length === 0) && targetRetellId && !targetRetellId.startsWith("mock_")) try {
			const { getRetellCall } = await import("./retell-BbifiL0d.mjs");
			const retellCall = await getRetellCall(targetRetellId);
			if (retellCall?.transcript_object && Array.isArray(retellCall.transcript_object)) effectiveTranscript = retellCall.transcript_object.filter((item) => item && (item.role === "agent" || item.role === "user") && item.content).map((item) => ({
				role: item.role === "agent" ? "agent" : "user",
				content: item.content
			}));
		} catch (e) {
			console.warn("Could not fetch Retell transcript in /api/calls/end:", e);
		}
		const { extractCallDetailsFromTranscript } = await import("./transcript-extractor-BkMupKqp.mjs");
		const extracted = await extractCallDetailsFromTranscript(effectiveTranscript);
		const calculatedDuration = Math.max(1, Math.round((Date.now() - createdAt.getTime()) / 1e3));
		const duration = body?.durationSeconds ?? calculatedDuration;
		if (cached) {
			cached.callStatus = "ended";
			cached.eligibilityStatus = extracted.eligibilityStatus;
			cached.disqualificationReason = extracted.disqualificationReason;
			cached.propertyType = extracted.propertyType;
			cached.ownership = extracted.ownership;
			cached.originalDocuments = extracted.originalDocuments;
			cached.loanAmountInr = extracted.loanAmountInr;
			cached.occupation = extracted.occupation;
			cached.incomeMode = extracted.incomeMode;
			cached.marketValueInr = extracted.marketValueInr;
			cached.tenureYears = extracted.tenureYears;
			cached.durationSeconds = duration;
			if (effectiveTranscript && effectiveTranscript.length > 0) cached.transcript = effectiveTranscript;
		}
		if (process.env.DATABASE_URL) try {
			await db.update(calls).set({
				callStatus: "ended",
				eligibilityStatus: extracted.eligibilityStatus,
				disqualificationReason: extracted.disqualificationReason,
				propertyType: extracted.propertyType || void 0,
				ownership: extracted.ownership || void 0,
				originalDocuments: extracted.originalDocuments !== null ? extracted.originalDocuments : void 0,
				loanAmountInr: extracted.loanAmountInr ?? void 0,
				occupation: extracted.occupation || void 0,
				incomeMode: extracted.incomeMode || void 0,
				marketValueInr: extracted.marketValueInr ?? void 0,
				tenureYears: extracted.tenureYears ?? void 0,
				durationSeconds: duration,
				transcript: effectiveTranscript && effectiveTranscript.length > 0 ? effectiveTranscript : void 0,
				updatedAt: /* @__PURE__ */ new Date()
			}).where(or(eq(calls.id, callId), eq(calls.retellCallId, callId)));
		} catch (dbErr) {
			console.warn("DB update failed in /api/calls/end:", dbErr);
		}
		if (retellCallId) await stopRetellCall(retellCallId).catch(() => {});
		return new Response(JSON.stringify({
			success: true,
			callStatus: "ended",
			eligibilityStatus: currentEligibility
		}), { headers: { "Content-Type": "application/json" } });
	} catch (err) {
		console.error("Error ending call session:", err);
		return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
} } } });
var ELIGIBLE_PROPERTY_TYPES = /* @__PURE__ */ new Set([
	"residential",
	"commercial",
	"industrial"
]);
/**
* Deterministic rules evaluation for Loan Against Property (LAP).
* Evaluates immediate failure if any hard rule is violated,
* returns in_progress if still collecting, and eligible when all 7 criteria pass.
*/
function evaluateEligibility(data) {
	if (data.propertyType) {
		const normalizedType = String(data.propertyType).toLowerCase().trim();
		if (!ELIGIBLE_PROPERTY_TYPES.has(normalizedType)) return {
			status: "not_eligible",
			failedReason: `Property type (${data.propertyType}) is not eligible for this loan scheme. We only accept residential, commercial, or industrial properties. Agricultural land is not accepted.`,
			failedStep: "property_type",
			missingFields: []
		};
	}
	if (data.originalDocuments === false) return {
		status: "not_eligible",
		failedReason: "Original title deed documents are strictly required for physical verification. Photocopies or missing original papers cannot be accepted.",
		failedStep: "original_documents",
		missingFields: []
	};
	if (typeof data.loanAmountInr === "number" && !isNaN(data.loanAmountInr)) {
		if (data.loanAmountInr > 75e5) return {
			status: "not_eligible",
			failedReason: `Requested loan amount (₹${data.loanAmountInr.toLocaleString("en-IN")}) exceeds our maximum preliminary program limit of ₹75 lakhs.`,
			failedStep: "loan_amount",
			missingFields: []
		};
	}
	if (data.incomeMode) {
		if (String(data.incomeMode).toLowerCase().trim() === "cash") return {
			status: "not_eligible",
			failedReason: "Income must be credited to a recognized bank account. Cash-based salary or cash business income does not meet loan eligibility criteria.",
			failedStep: "income_mode",
			missingFields: []
		};
	}
	const missing = [];
	if (!data.propertyType) missing.push("property_type");
	if (!data.ownership) missing.push("ownership");
	if (data.originalDocuments === null || data.originalDocuments === void 0) missing.push("original_documents");
	if (data.loanAmountInr === null || data.loanAmountInr === void 0) missing.push("loan_amount");
	if (!data.occupation) missing.push("occupation");
	if (!data.incomeMode) missing.push("income_mode");
	if (data.marketValueInr === null || data.marketValueInr === void 0) missing.push("market_value");
	if (data.tenureYears === null || data.tenureYears === void 0) missing.push("tenure");
	if (missing.length > 0) return {
		status: "in_progress",
		failedReason: null,
		failedStep: null,
		missingFields: missing
	};
	return {
		status: "eligible",
		failedReason: null,
		failedStep: null,
		missingFields: []
	};
}
/**
* Maps Hindi and Indian English word numbers to numerical values
*/
var HINDI_NUMBER_WORDS = {
	ek: 1,
	do: 2,
	teen: 3,
	char: 4,
	paanch: 5,
	panch: 5,
	chhe: 6,
	che: 6,
	saat: 7,
	aath: 8,
	nau: 9,
	das: 10,
	gyarah: 11,
	barah: 12,
	pandrah: 15,
	bees: 20,
	pachees: 25,
	tees: 30,
	pentees: 35,
	chalis: 40,
	pachaas: 50,
	pachas: 50,
	saath: 60,
	sattar: 70,
	pachattar: 75,
	pachhattar: 75,
	assi: 80,
	nabbe: 90,
	sau: 100
};
var ENGLISH_NUMBER_WORDS = {
	one: 1,
	two: 2,
	three: 3,
	four: 4,
	five: 5,
	six: 6,
	seven: 7,
	eight: 8,
	nine: 9,
	ten: 10,
	fifteen: 15,
	twenty: 20,
	twentyfive: 25,
	thirty: 30,
	forty: 40,
	fifty: 50,
	sixty: 60,
	seventy: 70,
	seventyfive: 75,
	eighty: 80,
	ninety: 90
};
/**
* Normalizes currency and amount inputs into integer INR.
* Handles "75 lakhs", "75L", "1.5 crore", "pachattar lakh", "7500000", etc.
*/
function normalizeAmountInr(raw) {
	if (raw === null || raw === void 0) return null;
	if (typeof raw === "number") return isNaN(raw) || raw < 0 ? null : Math.round(raw);
	const str = String(raw).toLowerCase().replace(/,/g, "").trim();
	if (!str) return null;
	const pureNumMatch = str.match(/^[₹rs.\s]*(\d+(\.\d+)?)[₹rs.\s]*$/);
	if (pureNumMatch) {
		const val = parseFloat(pureNumMatch[1]);
		return isNaN(val) ? null : Math.round(val);
	}
	const croreMatch = str.match(/([a-z0-9.]+)\s*(?:cr|crore|crores)/);
	if (croreMatch) {
		const numPart = resolveNumberWords(croreMatch[1]);
		if (numPart !== null) return Math.round(numPart * 1e7);
	}
	const lakhMatch = str.match(/([a-z0-9.]+)\s*(?:lakh|lakhs|lac|lacs|\bl\b|l$)/);
	if (lakhMatch) {
		const numPart = resolveNumberWords(lakhMatch[1]);
		if (numPart !== null) return Math.round(numPart * 1e5);
	}
	const thousandMatch = str.match(/([a-z0-9.]+)\s*(?:thousand|thousands|hazaar|hazar|\bk\b|k$)/);
	if (thousandMatch) {
		const numPart = resolveNumberWords(thousandMatch[1]);
		if (numPart !== null) return Math.round(numPart * 1e3);
	}
	const words = str.split(/\s+/);
	if (words.includes("lakh") || words.includes("lakhs") || words.includes("lac")) {
		const prefixWord = words[0];
		const resolved = resolveNumberWords(prefixWord);
		if (resolved !== null) return Math.round(resolved * 1e5);
	}
	return null;
}
function resolveNumberWords(token) {
	const clean = token.toLowerCase().trim().replace(/-/g, " ").replace(/[^a-z0-9.\s]/g, "");
	const parsed = parseFloat(clean);
	if (!isNaN(parsed)) return parsed;
	const parts = clean.split(/\s+/).filter(Boolean);
	if (parts.length === 1) {
		const single = parts[0];
		if (HINDI_NUMBER_WORDS[single] !== void 0) return HINDI_NUMBER_WORDS[single];
		if (ENGLISH_NUMBER_WORDS[single] !== void 0) return ENGLISH_NUMBER_WORDS[single];
	} else if (parts.length === 2) {
		const tens = ENGLISH_NUMBER_WORDS[parts[0]] ?? HINDI_NUMBER_WORDS[parts[0]];
		const ones = ENGLISH_NUMBER_WORDS[parts[1]] ?? HINDI_NUMBER_WORDS[parts[1]];
		if (tens !== void 0 && ones !== void 0) return tens + ones;
	}
	return null;
}
/**
* Normalizes tenure in years.
* e.g., "5 years", "10 saal", "15 yrs", "7" -> 5, 10, 15, 7
*/
function normalizeTenureYears(raw) {
	if (raw === null || raw === void 0) return null;
	if (typeof raw === "number") return isNaN(raw) || raw <= 0 ? null : Math.round(raw);
	const str = String(raw).toLowerCase().trim();
	const numMatch = str.match(/(\d+(\.\d+)?)/);
	if (numMatch) {
		const years = parseFloat(numMatch[1]);
		if (str.includes("month") || str.includes("mahine")) return Math.max(1, Math.round(years / 12));
		return Math.round(years);
	}
	for (const [word, val] of Object.entries({
		...ENGLISH_NUMBER_WORDS,
		...HINDI_NUMBER_WORDS
	})) if (str.includes(word)) return val;
	return null;
}
/**
* Normalizes property types from spoken responses
*/
function normalizePropertyType(raw) {
	if (!raw) return null;
	const s = raw.toLowerCase().trim();
	if (s.includes("agri") || s.includes("farm") || s.includes("kheti") || s.includes("khet")) return "agricultural";
	if (s.includes("indus") || s.includes("factor") || s.includes("godown") || s.includes("warehouse") || s.includes("karkhana")) return "industrial";
	if (s.includes("comm") || s.includes("shop") || s.includes("office") || s.includes("dukaan") || s.includes("dukan") || s.includes("complex")) return "commercial";
	if (s.includes("residen") || s.includes("flat") || /\bhouse\b/.test(s) || s.includes("apartment") || s.includes("villa") || s.includes("ghar") || s.includes("makaan")) return "residential";
	return s;
}
/**
* Normalizes ownership status
*/
function normalizeOwnership(raw) {
	if (!raw) return null;
	const s = raw.toLowerCase().trim();
	if (s.includes("joint") || s.includes("shared") || s.includes("wife") || s.includes("husband") || s.includes("family") || s.includes("partner") || s.includes("dono")) return "joint";
	if (s.includes("sole") || s.includes("single") || s.includes("own") || s.includes("alone") || s.includes("individual") || s.includes("akela") || s.includes("mera hi")) return "sole";
	return s;
}
/**
* Normalizes income mode
*/
function normalizeIncomeMode(raw) {
	if (!raw) return null;
	const s = raw.toLowerCase().trim();
	if (s.includes("cash") || s.includes("rokad") || s.includes("nakad") || s.includes("hand")) return "cash";
	if (s.includes("bank") || s.includes("account") || s.includes("online") || s.includes("neft") || s.includes("rtgs") || s.includes("transfer") || s.includes("cheque") || s.includes("salary ac")) return "bank";
	return s;
}
var Route$2 = createFileRoute("/api/tools/check-eligibility")({ server: { handlers: { POST: async ({ request }) => {
	try {
		const body = await request.json().catch(() => ({}));
		const args = body?.args || body || {};
		const callId = args.call_id || args.callId;
		const propertyType = normalizePropertyType(args.property_type);
		const ownership = normalizeOwnership(args.ownership);
		const originalDocuments = typeof args.original_documents === "boolean" ? args.original_documents : null;
		const loanAmountInr = normalizeAmountInr(args.loan_amount_inr);
		const occupation = args.occupation ? String(args.occupation).toLowerCase().trim() : null;
		const incomeMode = normalizeIncomeMode(args.income_mode);
		const marketValueInr = normalizeAmountInr(args.market_value_inr);
		const tenureYears = normalizeTenureYears(args.tenure_years);
		const evaluation = evaluateEligibility({
			propertyType,
			ownership,
			originalDocuments,
			loanAmountInr,
			occupation,
			incomeMode,
			marketValueInr,
			tenureYears
		});
		let nextInstruction = "";
		if (evaluation.status === "not_eligible") nextInstruction = `DISQUALIFIED: Inform customer warmly and respectfully that they do not meet preliminary eligibility due to: "${evaluation.failedReason}". Thank them for their time and end the call.`;
		else if (evaluation.status === "eligible") nextInstruction = "ALL 7 CRITERIA PASSED: Congratulate the customer warmly, summarize the details noted, state that a loan specialist will follow up shortly to verify documents and provide exact rate quotes, ask if they have questions, and conclude warmly.";
		else nextInstruction = `IN PROGRESS: Criteria verified so far are valid. Please proceed to ask the next missing checklist items: ${evaluation.missingFields.join(", ")}.`;
		if (callId) {
			const { inMemoryCalls } = await import("./start-Dal7aQ1p.mjs");
			const cached = inMemoryCalls?.get(callId);
			if (cached) {
				cached.eligibilityStatus = evaluation.status;
				cached.disqualificationReason = evaluation.failedReason;
				cached.disqualificationStep = evaluation.failedStep;
				if (propertyType) cached.propertyType = propertyType;
				if (ownership) cached.ownership = ownership;
				if (originalDocuments !== null) cached.originalDocuments = originalDocuments;
				if (loanAmountInr !== null) cached.loanAmountInr = loanAmountInr;
				if (occupation) cached.occupation = occupation;
				if (incomeMode) cached.incomeMode = incomeMode;
				if (marketValueInr !== null) cached.marketValueInr = marketValueInr;
				if (tenureYears !== null) cached.tenureYears = tenureYears;
			}
			if (process.env.DATABASE_URL) try {
				const { or } = await import("../_libs/drizzle-orm.mjs").then((n) => n.drizzle_orm_exports);
				await db.update(calls).set({
					eligibilityStatus: evaluation.status,
					disqualificationReason: evaluation.failedReason,
					disqualificationStep: evaluation.failedStep,
					propertyType: propertyType || void 0,
					ownership: ownership || void 0,
					originalDocuments: originalDocuments ?? void 0,
					loanAmountInr: loanAmountInr ?? void 0,
					occupation: occupation || void 0,
					incomeMode: incomeMode || void 0,
					marketValueInr: marketValueInr ?? void 0,
					tenureYears: tenureYears ?? void 0,
					updatedAt: /* @__PURE__ */ new Date()
				}).where(or(eq(calls.id, callId), eq(calls.retellCallId, callId)));
			} catch (dbErr) {
				console.warn("DB update during eligibility check error:", dbErr);
			}
		}
		return new Response(JSON.stringify({ result: {
			status: evaluation.status,
			failed_reason: evaluation.failedReason,
			failed_step: evaluation.failedStep,
			missing_fields: evaluation.missingFields,
			next_instruction: nextInstruction
		} }), { headers: { "Content-Type": "application/json" } });
	} catch (err) {
		return new Response(JSON.stringify({ result: {
			status: "in_progress",
			error: err.message,
			next_instruction: "Please clarify the last answer with the customer."
		} }), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	}
} } } });
var LAP_KNOWLEDGE_BASE = [
	{
		id: "lap-overview",
		topic: "Loan Against Property (LAP) Product Overview",
		category: "product_overview",
		content: "Our Loan Against Property program offers secured financing of up to ₹75,00,000 (seventy-five lakh rupees) against self-owned residential, commercial, or industrial properties. This call is a preliminary qualification check to assess basic criteria before a physical valuation and formal application."
	},
	{
		id: "lap-eligible-properties",
		topic: "Eligible Property Types",
		category: "eligibility",
		content: "Eligible properties include residential properties (apartments, flats, independent houses, villas), commercial properties (retail shops, commercial office spaces), and industrial units (factories, godowns, warehouses with approved plans). Agricultural land, open farmland, gram panchayat unapproved plots, and properties under litigation are strictly NOT eligible."
	},
	{
		id: "lap-original-documents",
		topic: "Original Title Documents Requirement",
		category: "documents",
		content: "Borrowers must possess original registered title deeds (Registered Sale Deed, Gift Deed, Conveyance Deed, or Mother Deed) free of encumbrances. Photocopies or certified copies without clear possession of the original papers are not acceptable because the lender requires physical custody of original deeds upon sanction."
	},
	{
		id: "lap-income-criteria",
		topic: "Income Mode & Banking Requirements",
		category: "eligibility",
		content: "Both salaried professionals and self-employed individuals are welcome. However, income must strictly reflect in a recognized bank account (via bank salary transfers, NEFT, RTGS, or verifiable business account turnovers). Cash-in-hand salary or unbanked cash receipts cannot be considered for loan approval."
	},
	{
		id: "lap-interest-rates",
		topic: "Interest Rates and Loan Charges",
		category: "repayment",
		content: "Indicative interest rates for Loan Against Property generally start from 9.25% to 11.5% per annum, depending on the property valuation, borrower credit profile, and tenure. The AI agent must never quote fixed interest rates or loan sanction guarantees; state that a dedicated loan specialist will provide the exact customized rate quote upon document verification."
	},
	{
		id: "lap-tenure-repayment",
		topic: "Repayment Tenure & Loan-to-Value (LTV)",
		category: "repayment",
		content: "Repayment tenure can extend up to 15 years (180 months), with flexibility based on property age and retirement age. Loan-to-value (LTV) can be up to 60-70% of the independent market valuation of the property. Preliminary eligibility collects the requested tenure and valuation without hard limits."
	},
	{
		id: "lap-joint-ownership",
		topic: "Joint Property Ownership Guidelines",
		category: "eligibility",
		content: "Properties owned jointly by family members (spouse, parents, siblings) are fully eligible. All co-owners on the title deed must join the loan as co-applicants. Sole ownership is equally eligible."
	},
	{
		id: "lap-disbursement-timeline",
		topic: "Processing Timeline and Steps",
		category: "product_overview",
		content: "After preliminary phone qualification, the loan process typically takes 5 to 7 working days, which includes document collection, legal title search, physical property valuation by an empanelled valuer, and final sanction."
	}
];
import_dist.config();
var genAiInstance = null;
function getGenAI() {
	if (!process.env.GEMINI_API_KEY) return null;
	if (!genAiInstance) genAiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
	return genAiInstance;
}
/**
* Computes cosine similarity between two numeric vectors
*/
function cosineSimilarity(vecA, vecB) {
	if (vecA.length !== vecB.length || vecA.length === 0) return 0;
	let dotProduct = 0;
	let normA = 0;
	let normB = 0;
	for (let i = 0; i < vecA.length; i++) {
		dotProduct += vecA[i] * vecB[i];
		normA += vecA[i] * vecA[i];
		normB += vecB[i] * vecB[i];
	}
	if (normA === 0 || normB === 0) return 0;
	return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
/**
* Generates vector embedding using Google Gemini text-embedding-004
*/
async function embedText(text) {
	const ai = getGenAI();
	if (!ai) return null;
	try {
		const response = await ai.models.embedContent({
			model: "gemini-embedding-001",
			contents: text,
			config: { outputDimensionality: 768 }
		});
		return response.embeddings?.[0]?.values || response.embedding?.values || null;
	} catch (err) {
		console.warn("Embedding generation warning:", err instanceof Error ? err.message : err);
		return null;
	}
}
/**
* Keyword match fallback when embeddings are unavailable
*/
function keywordRelevance(query, doc) {
	const qTerms = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
	if (qTerms.length === 0) return 0;
	const contentLower = (doc.topic + " " + doc.content).toLowerCase();
	let matches = 0;
	for (const term of qTerms) if (contentLower.includes(term)) matches++;
	return matches / qTerms.length;
}
/**
* Retrieves top relevant knowledge snippets for customer query or objection
*/
async function queryRag(query, limit = 2) {
	if (!query || query.trim().length === 0) return "";
	try {
		const queryVector = await embedText(query);
		if (queryVector && process.env.DATABASE_URL) try {
			const rows = await db.select().from(knowledgeChunks).limit(20);
			if (rows.length > 0 && rows[0].embedding) {
				const scored = rows.map((row) => ({
					topic: row.topic,
					content: row.content,
					score: row.embedding ? cosineSimilarity(queryVector, row.embedding) : 0
				})).sort((a, b) => b.score - a.score).slice(0, limit).filter((item) => item.score > .45);
				if (scored.length > 0) return scored.map((s) => `[${s.topic}]\n${s.content}`).join("\n\n");
			}
		} catch (dbErr) {}
		const scoredDocs = LAP_KNOWLEDGE_BASE.map((doc) => ({
			doc,
			score: keywordRelevance(query, doc)
		})).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, limit);
		if (scoredDocs.length > 0) return scoredDocs.map((s) => `[${s.doc.topic}]\n${s.doc.content}`).join("\n\n");
		return "";
	} catch (error) {
		console.warn("RAG Query warning:", error);
		return "";
	}
}
var Route$1 = createFileRoute("/api/tools/query-rag")({ server: { handlers: { POST: async ({ request }) => {
	try {
		const body = await request.json().catch(() => ({}));
		const query = (body?.args || body || {}).query || "";
		if (!query) return new Response(JSON.stringify({ result: { knowledge_context: "No specific topic queried." } }), { headers: { "Content-Type": "application/json" } });
		const context = await queryRag(query);
		return new Response(JSON.stringify({ result: { knowledge_context: context || "No specific document found; inform customer that a dedicated loan specialist will confirm the details." } }), { headers: { "Content-Type": "application/json" } });
	} catch (err) {
		return new Response(JSON.stringify({ result: { knowledge_context: "A loan specialist will confirm these details during the follow-up call." } }), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	}
} } } });
var Route = createFileRoute("/api/webhooks/retell")({ server: { handlers: { POST: async ({ request }) => {
	try {
		const body = await request.json().catch(() => ({}));
		const eventType = body?.event;
		const callData = body?.data || body?.call || {};
		const retellCallId = callData?.call_id;
		console.log(`[Retell Webhook] Received event: ${eventType} for call: ${retellCallId}`);
		if (!retellCallId || !process.env.DATABASE_URL) return new Response(JSON.stringify({ status: "ok" }), { headers: { "Content-Type": "application/json" } });
		if (eventType === "call_started") await db.update(calls).set({
			callStatus: "ongoing",
			updatedAt: /* @__PURE__ */ new Date()
		}).where(eq(calls.retellCallId, retellCallId));
		else if (eventType === "call_ended" || eventType === "call_analyzed") {
			const rawTranscript = callData?.transcript_object || [];
			const durationSeconds = callData?.duration_ms ? Math.round(callData.duration_ms / 1e3) : null;
			const recordingUrl = callData?.recording_url;
			const transcriptUtterances = Array.isArray(rawTranscript) ? rawTranscript.filter((item) => item && (item.role === "agent" || item.role === "user") && item.content).map((item) => ({
				role: item.role === "agent" ? "agent" : "user",
				content: item.content
			})) : [];
			const { extractCallDetailsFromTranscript } = await import("./transcript-extractor-BkMupKqp.mjs");
			const extracted = await extractCallDetailsFromTranscript(transcriptUtterances);
			await db.update(calls).set({
				callStatus: "ended",
				eligibilityStatus: extracted.eligibilityStatus,
				disqualificationReason: extracted.disqualificationReason,
				propertyType: extracted.propertyType || void 0,
				ownership: extracted.ownership || void 0,
				originalDocuments: extracted.originalDocuments !== null ? extracted.originalDocuments : void 0,
				loanAmountInr: extracted.loanAmountInr ?? void 0,
				occupation: extracted.occupation || void 0,
				incomeMode: extracted.incomeMode || void 0,
				marketValueInr: extracted.marketValueInr ?? void 0,
				tenureYears: extracted.tenureYears ?? void 0,
				durationSeconds: durationSeconds ?? void 0,
				recordingUrl: recordingUrl ?? void 0,
				transcript: transcriptUtterances.length > 0 ? transcriptUtterances : void 0,
				updatedAt: /* @__PURE__ */ new Date()
			}).where(eq(calls.retellCallId, retellCallId));
		}
		return new Response(JSON.stringify({ status: "ok" }), { headers: { "Content-Type": "application/json" } });
	} catch (err) {
		console.error("Error handling Retell webhook:", err);
		return new Response(JSON.stringify({
			status: "error",
			message: err.message
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
} } } });
var IndexRoute = Route$9.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$10
});
var HistoryRoute = Route$8.update({
	id: "/history",
	path: "/history",
	getParentRoute: () => Route$10
});
var CallCallIdRoute = Route$7.update({
	id: "/call/$callId",
	path: "/call/$callId",
	getParentRoute: () => Route$10
});
var ApiCallsIndexRoute = Route$5.update({
	id: "/api/calls/",
	path: "/api/calls/",
	getParentRoute: () => Route$10
});
var rootRouteChildren = {
	IndexRoute,
	HistoryRoute,
	CallCallIdRoute,
	ApiCallsCallIdRoute: Route$4.update({
		id: "/api/calls/$callId",
		path: "/api/calls/$callId",
		getParentRoute: () => Route$10
	}),
	ApiCallsEndRoute: Route$3.update({
		id: "/api/calls/end",
		path: "/api/calls/end",
		getParentRoute: () => Route$10
	}),
	ApiCallsStartRoute: Route$6.update({
		id: "/api/calls/start",
		path: "/api/calls/start",
		getParentRoute: () => Route$10
	}),
	ApiToolsCheckEligibilityRoute: Route$2.update({
		id: "/api/tools/check-eligibility",
		path: "/api/tools/check-eligibility",
		getParentRoute: () => Route$10
	}),
	ApiToolsQueryRagRoute: Route$1.update({
		id: "/api/tools/query-rag",
		path: "/api/tools/query-rag",
		getParentRoute: () => Route$10
	}),
	ApiWebhooksRetellRoute: Route.update({
		id: "/api/webhooks/retell",
		path: "/api/webhooks/retell",
		getParentRoute: () => Route$10
	}),
	ApiCallsIndexRoute
};
var routeTree = Route$10._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({
	createRouter: () => createRouter,
	getRouter: () => getRouter
});
function createRouter() {
	return createRouter$1({
		routeTree,
		scrollRestoration: true
	});
}
var getRouter = createRouter;
//#endregion
export { Route$7, evaluateEligibility, getRetellCall, inMemoryCalls, normalizeAmountInr, normalizeIncomeMode, normalizeOwnership, normalizePropertyType, normalizeTenureYears, router_exports };
