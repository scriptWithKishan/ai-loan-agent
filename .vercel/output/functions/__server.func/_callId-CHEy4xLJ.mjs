import { __toESM } from "./_runtime.mjs";
import { require_jsx_runtime, require_react, useNavigate } from "./_libs/@tanstack/react-router+[...].mjs";
import { ArrowLeft, CircleAlert, CircleCheckBig, Clock, Headset, MessageSquare, Mic, MicOff, PhoneOff, Radio, RefreshCw, ShieldCheck, User, UserCheck, Volume2 } from "./_libs/lucide-react.mjs";
import { Route$7 } from "./_ssr/router-3gdiWDev.mjs";
import { endCallApi, getCallApi } from "./_ssr/call-actions-OH0ftX5b.mjs";
import { B } from "./_libs/retell-client-js-sdk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_callId-CHEy4xLJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AudioWaveform = ({ isCalling, isMuted, isAgentSpeaking }) => {
	const [audioLevel, setAudioLevel] = (0, import_react.useState)(0);
	const [barHeights, setBarHeights] = (0, import_react.useState)(() => Array(32).fill(6));
	const [isUserTalking, setIsUserTalking] = (0, import_react.useState)(false);
	const audioContextRef = (0, import_react.useRef)(null);
	const analyserRef = (0, import_react.useRef)(null);
	const sourceRef = (0, import_react.useRef)(null);
	const streamRef = (0, import_react.useRef)(null);
	const animFrameRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!isCalling) {
			setBarHeights(Array(32).fill(6));
			setAudioLevel(0);
			setIsUserTalking(false);
			return;
		}
		let isMounted = true;
		const setupAudioAnalyser = async () => {
			try {
				if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) return;
				const stream = await navigator.mediaDevices.getUserMedia({ audio: {
					echoCancellation: true,
					noiseSuppression: true,
					autoGainControl: true
				} });
				if (!isMounted) {
					stream.getTracks().forEach((t) => t.stop());
					return;
				}
				streamRef.current = stream;
				const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
				audioContextRef.current = audioCtx;
				const analyser = audioCtx.createAnalyser();
				analyser.fftSize = 64;
				analyser.smoothingTimeConstant = .75;
				analyserRef.current = analyser;
				const source = audioCtx.createMediaStreamSource(stream);
				source.connect(analyser);
				sourceRef.current = source;
				const bufferLength = analyser.frequencyBinCount;
				const dataArray = new Uint8Array(bufferLength);
				performance.now();
				const updateLoop = (now) => {
					if (!isMounted) return;
					if (analyserRef.current && !isMuted) {
						analyserRef.current.getByteFrequencyData(dataArray);
						let sum = 0;
						for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
						const avg = sum / bufferLength;
						const normalizedLevel = Math.min(1, avg / 120);
						const userTalkingNow = normalizedLevel > .08;
						setIsUserTalking(userTalkingNow);
						setAudioLevel(normalizedLevel);
						const newHeights = [];
						const barCount = 32;
						const half = barCount / 2;
						for (let i = 0; i < barCount; i++) {
							const distFromCenter = 1 - Math.abs(i - half + .5) / half;
							const freqIdx = Math.floor(Math.abs(i - half + .5) / half * (bufferLength - 1));
							const freqVal = (dataArray[freqIdx] || 0) / 255;
							let height = 6;
							if (userTalkingNow) {
								const spike = Math.pow(normalizedLevel, .7) * 72 * distFromCenter * (.6 + freqVal * .8);
								height = Math.max(8, Math.min(84, spike + Math.sin(now * .02 + i) * 6));
							} else if (isAgentSpeaking) {
								const wave = Math.sin(now * .008 + i * .35) * 22 + Math.cos(now * .015 + i * .2) * 14;
								height = Math.max(8, Math.min(68, 24 + wave * distFromCenter));
							} else {
								const gentle = Math.sin(now * .003 + i * .25) * 3;
								height = Math.max(5, 7 + gentle);
							}
							newHeights.push(Math.round(height));
						}
						setBarHeights(newHeights);
					} else {
						const resting = Array(32).fill(0).map((_, i) => {
							if (isAgentSpeaking) {
								const wave = Math.sin(now * .008 + i * .35) * 20;
								return Math.max(8, Math.min(64, 22 + wave));
							}
							return 6;
						});
						setBarHeights(resting);
						setIsUserTalking(false);
						setAudioLevel(0);
					}
					animFrameRef.current = requestAnimationFrame(updateLoop);
				};
				animFrameRef.current = requestAnimationFrame(updateLoop);
			} catch (err) {
				console.warn("Microphone audio analyser fallback active:", err);
				let t = 0;
				const fallbackLoop = () => {
					if (!isMounted) return;
					t += .05;
					const simulatedHeights = Array(32).fill(0).map((_, i) => {
						if (isAgentSpeaking) return Math.max(8, Math.round(28 + Math.sin(t * 3 + i * .3) * 22));
						return Math.max(5, Math.round(7 + Math.sin(t + i * .2) * 2.5));
					});
					setBarHeights(simulatedHeights);
					animFrameRef.current = requestAnimationFrame(fallbackLoop);
				};
				animFrameRef.current = requestAnimationFrame(fallbackLoop);
			}
		};
		setupAudioAnalyser();
		return () => {
			isMounted = false;
			if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
			if (sourceRef.current) try {
				sourceRef.current.disconnect();
			} catch (e) {}
			if (audioContextRef.current && audioContextRef.current.state !== "closed") try {
				audioContextRef.current.close();
			} catch (e) {}
			if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
		};
	}, [
		isCalling,
		isMuted,
		isAgentSpeaking
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "w-full",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "neu-inset-deep rounded-2xl p-4 sm:p-6 border border-white/40 relative overflow-hidden flex flex-col items-center justify-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between w-full mb-4 px-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `w-2.5 h-2.5 rounded-full transition-all duration-300 ${isUserTalking ? "bg-emerald-500 scale-125 shadow-[0_0_10px_rgba(16,185,129,0.7)]" : isAgentSpeaking ? "bg-blue-600 scale-110 shadow-[0_0_10px_rgba(37,99,235,0.6)]" : "bg-slate-400"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold tracking-wide text-slate-700",
							children: isUserTalking ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-emerald-700 font-bold",
								children: "You are speaking..."
							}) : isAgentSpeaking ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-blue-700 font-bold",
								children: "Vikram (Advisor) speaking..."
							}) : isMuted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-rose-600 font-medium",
								children: "Microphone muted"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-500 font-medium",
								children: "Listening to your voice..."
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-200/80 text-slate-600 shadow-inner",
						children: isUserTalking ? "Mic Active (Spiking)" : isAgentSpeaking ? "Audio Stream" : "Live Channel"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full h-24 sm:h-28 flex items-center justify-center gap-1 sm:gap-1.5 px-2",
					children: barHeights.map((height, i) => {
						const isCenterBar = Math.abs(i - 16) < 8;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-1.5 sm:w-2 rounded-full transition-[height] duration-75 ease-out",
							style: {
								height: `${height}px`,
								background: isUserTalking ? isCenterBar ? "linear-gradient(180deg, #10b981 0%, #059669 100%)" : "linear-gradient(180deg, #34d399 0%, #10b981 100%)" : isAgentSpeaking ? isCenterBar ? "linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)" : "linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)" : "#94a3b8",
								boxShadow: isUserTalking && height > 24 ? "0 0 10px rgba(16, 185, 129, 0.45)" : isAgentSpeaking && height > 24 ? "0 0 10px rgba(37, 99, 235, 0.45)" : "none"
							}
						}, i);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 text-[11px] text-slate-400 font-medium text-center",
					children: isUserTalking ? "Voice input detected in real-time" : isAgentSpeaking ? "Advisor is explaining property loan terms" : "Speak naturally to answer questions about your property"
				})
			]
		})
	});
};
var LiveTranscript = ({ messages, interimUserSpeech, isAgentSpeaking }) => {
	const bottomRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [
		messages,
		interimUserSpeech,
		isAgentSpeaking
	]);
	const hasAnyContent = messages.length > 0 || !!interimUserSpeech;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "neu-flat rounded-3xl p-5 sm:p-6 border border-white/80 flex flex-col h-full",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between pb-3 border-b border-slate-200/70 text-slate-800 font-bold text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-7 h-7 rounded-lg neu-inset flex items-center justify-center text-blue-600",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-4 h-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Live Conversation Transcript" })]
			}), isAgentSpeaking && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 text-xs text-blue-600 font-semibold animate-pulse",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-blue-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Vikram is speaking..." })]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 overflow-y-auto space-y-3.5 py-4 pr-1 min-h-[160px] max-h-[300px]",
			children: [!hasAnyContent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "h-full flex flex-col items-center justify-center text-slate-400 text-xs gap-2 py-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-9 h-9 rounded-full neu-inset flex items-center justify-center text-slate-400",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "w-5 h-5 animate-pulse" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Connecting voice channel... Speak into your microphone to begin." })]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [messages.map((msg, index) => {
				const isAgent = msg.role === "agent";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `flex items-start gap-2.5 ${isAgent ? "justify-start" : "justify-end"}`,
					children: [
						isAgent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-7 h-7 rounded-xl neu-soft flex items-center justify-center text-blue-600 shrink-0 mt-0.5 font-bold text-[10px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "w-3.5 h-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${isAgent ? "neu-soft text-slate-800 border border-white/80 rounded-tl-sm" : "bg-blue-600 text-white rounded-tr-sm shadow-md"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isAgent ? "text-blue-700" : "text-blue-100"}`,
								children: isAgent ? "Vikram (Advisor)" : "You"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-normal",
								children: msg.content
							})]
						}),
						!isAgent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-7 h-7 rounded-xl neu-inset flex items-center justify-center text-slate-600 shrink-0 mt-0.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-3.5 h-3.5" })
						})
					]
				}, index);
			}), interimUserSpeech && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-2.5 justify-end",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed bg-blue-500/80 text-white rounded-tr-sm shadow-sm border border-blue-400 border-dashed animate-pulse",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] font-bold uppercase tracking-wider mb-0.5 text-blue-100",
						children: "You (Speaking...)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-normal italic",
						children: interimUserSpeech
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-7 h-7 rounded-xl neu-inset flex items-center justify-center text-blue-600 shrink-0 mt-0.5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-3.5 h-3.5 animate-pulse" })
				})]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: bottomRef })]
		})]
	});
};
function isGoodbyeUtterance(text) {
	if (!text) return false;
	const lower = text.toLowerCase();
	return lower.includes("goodbye") || lower.includes("bye for now") || lower.includes("have a wonderful") || lower.includes("have a great day") || lower.includes("have a pleasant") || lower.includes("pleasure speaking with you") || lower.includes("take care");
}
function LiveCallPage() {
	const { callId } = Route$7.useParams();
	const navigate = useNavigate();
	const [isCalling, setIsCalling] = (0, import_react.useState)(false);
	const [isMuted, setIsMuted] = (0, import_react.useState)(false);
	const [isAgentSpeaking, setIsAgentSpeaking] = (0, import_react.useState)(false);
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [interimUserSpeech, setInterimUserSpeech] = (0, import_react.useState)("");
	const [errorMessage, setErrorMessage] = (0, import_react.useState)(null);
	const [connectionStatus, setConnectionStatus] = (0, import_react.useState)("connecting");
	const [needAudioUnlock, setNeedAudioUnlock] = (0, import_react.useState)(false);
	const [callDuration, setCallDuration] = (0, import_react.useState)(0);
	const [isDisconnecting, setIsDisconnecting] = (0, import_react.useState)(false);
	const messagesRef = (0, import_react.useRef)([]);
	const retellClientRef = (0, import_react.useRef)(null);
	const recognitionRef = (0, import_react.useRef)(null);
	const disconnectTimerRef = (0, import_react.useRef)(null);
	const hasEndedRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		messagesRef.current = messages;
	}, [messages]);
	(0, import_react.useEffect)(() => {
		let timer = null;
		if (isCalling && !isDisconnecting) timer = setInterval(() => {
			setCallDuration((prev) => prev + 1);
		}, 1e3);
		return () => {
			if (timer) clearInterval(timer);
		};
	}, [isCalling, isDisconnecting]);
	const formatDuration = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};
	const handleEndCall = (0, import_react.useCallback)(async () => {
		if (hasEndedRef.current) return;
		hasEndedRef.current = true;
		if (disconnectTimerRef.current) {
			clearTimeout(disconnectTimerRef.current);
			disconnectTimerRef.current = null;
		}
		if (recognitionRef.current) {
			try {
				recognitionRef.current.stop();
			} catch (e) {}
			recognitionRef.current = null;
		}
		if (retellClientRef.current) {
			try {
				retellClientRef.current.stopCall();
			} catch (e) {
				console.warn("Retell stopCall error:", e);
			}
			retellClientRef.current = null;
		}
		setIsCalling(false);
		setIsAgentSpeaking(false);
		setConnectionStatus("ended");
		setIsDisconnecting(true);
		setInterimUserSpeech("");
		try {
			await endCallApi(callId, {
				transcript: messagesRef.current,
				durationSeconds: callDuration
			});
		} catch (e) {
			console.warn("Server endCallApi error:", e);
		}
		try {
			sessionStorage.removeItem(`retell_config_${callId}`);
		} catch (e) {}
		setTimeout(() => {
			navigate({ to: "/history" });
		}, 1200);
	}, [
		callId,
		callDuration,
		navigate
	]);
	const startSpeechRecognition = (0, import_react.useCallback)(() => {
		if (typeof window === "undefined") return;
		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		if (!SpeechRecognition) return;
		try {
			if (recognitionRef.current) try {
				recognitionRef.current.stop();
			} catch (e) {}
			const recognition = new SpeechRecognition();
			recognition.continuous = true;
			recognition.interimResults = true;
			recognition.lang = "en-IN";
			recognition.onresult = (event) => {
				let interim = "";
				for (let i = event.resultIndex; i < event.results.length; ++i) {
					const item = event.results[i];
					if (item.isFinal) {
						const finalTranscript = item[0].transcript.trim();
						if (finalTranscript) {
							setMessages((prev) => {
								const last = prev[prev.length - 1];
								if (last && last.role === "user" && last.content.toLowerCase().trim() === finalTranscript.toLowerCase().trim()) return prev;
								const updated = [...prev, {
									role: "user",
									content: finalTranscript
								}];
								messagesRef.current = updated;
								return updated;
							});
							setInterimUserSpeech("");
						}
					} else interim += item[0].transcript;
				}
				if (interim) setInterimUserSpeech(interim);
			};
			recognition.onerror = () => {};
			recognition.onend = () => {
				if (retellClientRef.current && !hasEndedRef.current) try {
					recognition.start();
				} catch (e) {}
			};
			recognition.start();
			recognitionRef.current = recognition;
		} catch (e) {
			console.warn("SpeechRecognition initialization error:", e);
		}
	}, []);
	const startLiveCall = async () => {
		setErrorMessage(null);
		setConnectionStatus("connecting");
		hasEndedRef.current = false;
		try {
			let config = null;
			const storedConfigStr = sessionStorage.getItem(`retell_config_${callId}`);
			if (storedConfigStr) try {
				config = JSON.parse(storedConfigStr);
			} catch (e) {
				console.warn("Failed to parse retell_config from sessionStorage:", e);
			}
			if (!config || !config.accessToken || !config.retellCallId) {
				console.log("Retrieving call session credentials from /api/calls/" + callId);
				const serverSession = await getCallApi(callId);
				if (serverSession && serverSession.accessToken) config = {
					callId: serverSession.id,
					retellCallId: serverSession.retellCallId,
					accessToken: serverSession.accessToken,
					transport: serverSession.transport || "gateway",
					iceServers: serverSession.iceServers || []
				};
			}
			if (!config || !config.accessToken || config.accessToken === "mock_token") throw new Error("Valid access token not found for this call session.");
			const gatewayCallId = config.retellCallId || config.callId || callId;
			if (retellClientRef.current) try {
				retellClientRef.current.stopCall();
			} catch (e) {}
			console.log("Initializing Web Client for Call ID:", gatewayCallId);
			const client = new B({ defaultTransport: config.transport || "gateway" });
			retellClientRef.current = client;
			client.on("call_started", () => {
				console.log("✓ Call Connected successfully!");
				setIsCalling(true);
				setConnectionStatus("connected");
				setErrorMessage(null);
				startSpeechRecognition();
				try {
					client.startAudioPlayback().catch(() => {
						setNeedAudioUnlock(true);
					});
				} catch (e) {
					setNeedAudioUnlock(true);
				}
			});
			client.on("call_ready", () => {
				console.log("✓ Audio Pipeline Ready");
				setIsCalling(true);
				setConnectionStatus("connected");
			});
			client.on("agent_start_talking", () => {
				setIsAgentSpeaking(true);
			});
			client.on("agent_stop_talking", () => {
				setIsAgentSpeaking(false);
				getCallApi(callId).then((session) => {
					if (session?.transcript && Array.isArray(session.transcript) && session.transcript.length > 0) {
						const validUtterances = session.transcript.filter((item) => item && (item.role === "agent" || item.role === "user") && item.content).map((item) => ({
							role: item.role === "agent" ? "agent" : "user",
							content: item.content
						}));
						if (validUtterances.length > 0) setMessages(validUtterances);
					}
				}).catch(() => {});
			});
			client.on("update", (update) => {
				if (update?.transcript && Array.isArray(update.transcript)) {
					const validUtterances = update.transcript.filter((item) => item && (item.role === "agent" || item.role === "user") && item.content).map((item) => ({
						role: item.role === "agent" ? "agent" : "user",
						content: item.content
					}));
					if (validUtterances.length > 0) setMessages(validUtterances);
				}
			});
			client.on("call_ended", () => {
				console.log("Call ended via server/agent hangup");
				setIsCalling(false);
				setIsAgentSpeaking(false);
				setConnectionStatus("ended");
				setIsDisconnecting(true);
				if (!hasEndedRef.current) handleEndCall();
			});
			client.on("error", (err) => {
				console.error("WebRTC connection error:", err);
				const msg = typeof err === "string" ? err : err?.message || "Connection to voice server failed.";
				setErrorMessage(msg);
				setConnectionStatus("error");
				setIsCalling(false);
			});
			await client.startCall({
				callId: gatewayCallId,
				accessToken: config.accessToken,
				transport: config.transport || "gateway",
				iceServers: config.iceServers
			});
		} catch (err) {
			console.error("Fatal error starting call:", err);
			setErrorMessage(err?.message || "Unable to connect to voice platform. Please check microphone permissions and network.");
			setConnectionStatus("error");
			setIsCalling(false);
		}
	};
	(0, import_react.useEffect)(() => {
		startLiveCall();
		const interval = setInterval(async () => {
			if (hasEndedRef.current) return;
			try {
				const session = await getCallApi(callId);
				if (session) {
					if (Array.isArray(session.transcript) && session.transcript.length > 0) {
						const validUtterances = session.transcript.filter((item) => item && (item.role === "agent" || item.role === "user") && item.content).map((item) => ({
							role: item.role === "agent" ? "agent" : "user",
							content: item.content
						}));
						if (validUtterances.length >= messagesRef.current.length) setMessages(validUtterances);
					}
					if (session.callStatus === "ended" && !hasEndedRef.current) handleEndCall();
				}
			} catch (e) {}
		}, 1200);
		return () => {
			clearInterval(interval);
			if (disconnectTimerRef.current) clearTimeout(disconnectTimerRef.current);
			if (recognitionRef.current) try {
				recognitionRef.current.stop();
			} catch (e) {}
			if (retellClientRef.current) try {
				retellClientRef.current.stopCall();
			} catch (e) {}
		};
	}, [callId, handleEndCall]);
	(0, import_react.useEffect)(() => {
		if (messages.length === 0 || hasEndedRef.current || isDisconnecting) return;
		const lastMessage = messages[messages.length - 1];
		if (lastMessage && lastMessage.role === "agent") {
			if (isGoodbyeUtterance(lastMessage.content)) {
				console.log("Advisor concluded consultation with goodbye. Scheduling auto-disconnect...");
				setIsDisconnecting(true);
				if (!disconnectTimerRef.current) disconnectTimerRef.current = setTimeout(() => {
					console.log("Auto-disconnecting call after advisor goodbye...");
					handleEndCall();
				}, 3200);
			}
		}
	}, [
		messages,
		handleEndCall,
		isDisconnecting
	]);
	const handleToggleMute = () => {
		if (!retellClientRef.current) return;
		if (isMuted) {
			retellClientRef.current.unmute();
			setIsMuted(false);
			if (recognitionRef.current) try {
				recognitionRef.current.start();
			} catch (e) {}
		} else {
			retellClientRef.current.mute();
			setIsMuted(true);
			if (recognitionRef.current) try {
				recognitionRef.current.stop();
			} catch (e) {}
		}
	};
	const handleUnlockAudio = () => {
		if (retellClientRef.current) retellClientRef.current.startAudioPlayback().then(() => {
			setNeedAudioUnlock(false);
		}).catch(console.error);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 flex flex-col justify-center items-center w-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full flex items-center justify-between pb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: handleEndCall,
					className: "neu-button flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-600 transition-all cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Exit Consultation" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 px-3 py-1.5 rounded-full neu-inset text-xs font-semibold text-slate-600",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Encrypted Voice Line" })]
				})]
			}),
			needAudioUnlock && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full mb-6 p-4 neu-raised border border-amber-300 rounded-2xl flex items-center justify-between gap-3 text-amber-900 text-xs font-medium",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "w-4 h-4 text-amber-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Click to enable speaker audio playback in your browser:" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: handleUnlockAudio,
					className: "neu-button px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl text-xs cursor-pointer",
					children: "Enable Speaker"
				})]
			}),
			isDisconnecting && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full mb-6 p-4 neu-raised border border-emerald-300 rounded-2xl flex items-center justify-center gap-3 text-emerald-900 text-xs font-bold animate-pulse",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "w-4 h-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Consultation Concluded • Updating consultation record and opening History..." })]
			}),
			errorMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full mb-6 p-5 neu-raised border border-rose-300 rounded-2xl flex items-center justify-between gap-4 text-rose-800 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-5 h-5 text-rose-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-bold text-rose-900",
						children: "Audio Connection Issue"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-slate-600 mt-0.5",
						children: errorMessage
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: startLiveCall,
					className: "neu-button-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Reconnect" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full neu-floating rounded-3xl p-6 sm:p-10 border border-white/90 flex flex-col items-center justify-center space-y-7 shadow-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between w-full pb-4 border-b border-slate-200/80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `w-3 h-3 rounded-full ${isCalling ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold tracking-wide text-slate-700",
								children: isDisconnecting ? "CONSULTATION CONCLUDED" : isCalling ? "CONSULTATION IN PROGRESS" : "CONNECTING AUDIO..."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1 rounded-full neu-inset text-slate-700",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3.5 h-3.5 text-slate-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDuration(callDuration) })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex items-center justify-center mb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `w-32 h-32 rounded-full neu-flat flex items-center justify-center p-3 border border-white/90 transition-all duration-300 ${isAgentSpeaking ? "scale-105 shadow-[0_0_25px_rgba(37,99,235,0.25)]" : ""}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-24 h-24 rounded-full neu-inset flex items-center justify-center text-blue-600",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headset, { className: "w-10 h-10" })
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `absolute bottom-1 right-2 w-5 h-5 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${isAgentSpeaking ? "bg-blue-600" : isCalling ? "bg-emerald-500" : "bg-amber-400"}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "w-2.5 h-2.5 text-white" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-black text-slate-800 tracking-tight",
								children: "Vikram"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold text-blue-700 mt-0.5",
								children: "Senior Loan Advisor • Sunrise Capital"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-500 mt-1 max-w-sm",
								children: "Loan Against Property (LAP) Specialist • Instant Eligibility Verification"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-full max-w-2xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AudioWaveform, {
							isCalling,
							isMuted,
							isAgentSpeaking
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-center gap-4 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleToggleMute,
							title: isMuted ? "Unmute Microphone" : "Mute Microphone",
							className: `flex items-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-xs sm:text-sm cursor-pointer transition-all ${isMuted ? "neu-inset text-rose-600 border border-rose-300" : "neu-button text-slate-700 hover:text-blue-600"}`,
							children: isMuted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, { className: "w-4 h-4 text-rose-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Microphone Muted" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "w-4 h-4 text-blue-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mute Mic" })] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleEndCall,
							disabled: isDisconnecting,
							className: "neu-button-danger flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-xs sm:text-sm cursor-pointer shadow-lg disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneOff, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isDisconnecting ? "Saving Record..." : "End Call" })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-full max-w-2xl pt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveTranscript, {
							messages,
							interimUserSpeech,
							isAgentSpeaking
						})
					})
				]
			})
		]
	});
}
//#endregion
export { LiveCallPage as component };
