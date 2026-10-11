import { import_eventemitter3 } from "./eventemitter3.mjs";
import { ParticipantEvent, RemoteAudioTrack, Room, RoomEvent, Track, createAudioAnalyser, createLocalAudioTrack } from "./livekit-client.mjs";
//#region node_modules/.pnpm/retell-client-js-sdk@3.0.2__3bcd4922ceff970d951583908d011bb0/node_modules/retell-client-js-sdk/dist/index.m.js
function h() {
	return h = Object.assign ? Object.assign.bind() : function(t) {
		for (var e = 1; e < arguments.length; e++) {
			var n = arguments[e];
			for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r]);
		}
		return t;
	}, h.apply(this, arguments);
}
function f(t, e) {
	t.prototype = Object.create(e.prototype), t.prototype.constructor = t, p(t, e);
}
function p(t, e) {
	return p = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t, e) {
		return t.__proto__ = e, t;
	}, p(t, e);
}
function g(t, e) {
	(null == e || e > t.length) && (e = t.length);
	for (var n = 0, r = new Array(e); n < e; n++) r[n] = t[n];
	return r;
}
function k(t, e) {
	var n = "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
	if (n) return (n = n.call(t)).next.bind(n);
	if (Array.isArray(t) || (n = function(t, e) {
		if (t) {
			if ("string" == typeof t) return g(t, e);
			var n = Object.prototype.toString.call(t).slice(8, -1);
			return "Object" === n && t.constructor && (n = t.constructor.name), "Map" === n || "Set" === n ? Array.from(t) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? g(t, e) : void 0;
		}
	}(t)) || e && t && "number" == typeof t.length) {
		n && (t = n);
		var r = 0;
		return function() {
			return r >= t.length ? { done: !0 } : {
				done: !1,
				value: t[r++]
			};
		};
	}
	throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
var P = "3.0.2";
function E(t, e) {
	try {
		var n = t();
	} catch (t) {
		return e(t);
	}
	return n && n.then ? n.then(void 0, e) : n;
}
var O = [{ urls: "stun:stun.l.google.com:19302" }];
var I = /*#__PURE__*/ function() {
	function t(t) {
		this.config = void 0, this.base = void 0, this.pc = void 0, this.dc = void 0, this.localStream = void 0, this.takingOver = void 0, this.audioEl = void 0, this.analyzer = void 0, this.sessionId = void 0, this.pendingCandidates = [], this.handlers = void 0, this.readyFired = !1, this.config = t;
		var e = (t.baseURL || "https://api.retellai.com").replace(/\/+$/, "");
		this.base = e + "/webrtc-proxy/" + t.callId;
	}
	var e = t.prototype;
	return e.connect = function(t) {
		try {
			var e, n = function() {
				var e = i.createDataChannel("control");
				r.dc = e, e.onmessage = function(e) {
					try {
						t.onData(JSON.parse(e.data));
					} catch (t) {}
				}, i.ontrack = function(e) {
					var n = e.streams[0] || new MediaStream([e.track]);
					r.attachRemote(n, e.track), r.readyFired || (r.readyFired = !0, t.onCallReady(r.analyzer || null));
				}, i.onicecandidate = function(t) {
					t.candidate && (r.sessionId ? r.sendCandidate(t.candidate) : r.pendingCandidates.push(t.candidate));
				};
				var n = !1;
				return i.onconnectionstatechange = function() {
					var e = i.connectionState;
					!n || "failed" !== e && "closed" !== e || t.onDisconnected();
				}, i.oniceconnectionstatechange = function() {
					var e = i.iceConnectionState;
					!n || "failed" !== e && "closed" !== e || t.onDisconnected();
				}, Promise.resolve(i.createOffer()).then(function(e) {
					return Promise.resolve(i.setLocalDescription(e)).then(function() {
						return Promise.resolve(r.createSession(i.localDescription.sdp)).then(function(e) {
							return r.sessionId = e.session_id, n = !0, t.onConnected(), Promise.resolve(i.setRemoteDescription({
								type: "answer",
								sdp: e.sdp
							})).then(function() {
								var t = r.pendingCandidates;
								r.pendingCandidates = [];
								for (var e, n = k(t); !(e = n()).done;) r.sendCandidate(e.value);
							});
						});
					});
				});
			}, r = this;
			if (r.handlers = t, !r.config.callId) throw new Error("callId is required for the gateway transport");
			var i = new RTCPeerConnection({ iceServers: null != (e = r.config.iceServers) && e.length ? r.config.iceServers : O });
			r.pc = i;
			var o = function() {
				if (!r.config.listener) return Promise.resolve(navigator.mediaDevices.getUserMedia({ audio: r.micConstraints() })).then(function(t) {
					r.localStream = t, r.localStream.getTracks().forEach(function(t) {
						return i.addTrack(t, r.localStream);
					});
				});
				i.addTransceiver("audio", { direction: "recvonly" });
			}();
			return Promise.resolve(o && o.then ? o.then(n) : n());
		} catch (t) {
			return Promise.reject(t);
		}
	}, e.createSession = function(t) {
		try {
			var e = this;
			return Promise.resolve(fetch(e.base + "/v1/webrtc/sessions", {
				method: "POST",
				headers: e.headers({ "Content-Type": "application/json" }),
				body: JSON.stringify({
					identity: e.identity(),
					sdp: t
				})
			})).then(function(t) {
				function e(e) {
					return Promise.resolve(t.json());
				}
				var n = function() {
					if (!t.ok) return Promise.resolve(t.text()).then(function(e) {
						throw new Error("gateway WHIP POST failed: " + t.status + " " + e);
					});
				}();
				return n && n.then ? n.then(e) : e();
			});
		} catch (t) {
			return Promise.reject(t);
		}
	}, e.setMicEnabled = function(t) {
		var e;
		null == (e = this.localStream) || e.getAudioTracks().forEach(function(e) {
			return e.enabled = t;
		});
	}, e.takeOver = function() {
		try {
			var t = this;
			if (!t.pc) throw new Error("gateway transport not connected");
			return t.localStream ? Promise.resolve() : (t.takingOver || (t.takingOver = t.doTakeOver(t.pc).finally(function() {
				t.takingOver = void 0;
			})), Promise.resolve(t.takingOver));
		} catch (t) {
			return Promise.reject(t);
		}
	}, e.doTakeOver = function(t, e) {
		void 0 === e && (e = !0);
		try {
			var n = this;
			return Promise.resolve(navigator.mediaDevices.getUserMedia({ audio: n.micConstraints() })).then(function(r) {
				var i;
				function o(t) {
					if (i) return t;
					n.localStream = r;
				}
				var a, s = r.getAudioTracks()[0], c = t.getTransceivers().find(function(t) {
					return "recvonly" === t.direction;
				}), u = !1, l = E(function() {
					function e() {
						return Promise.resolve(t.createOffer()).then(function(e) {
							return Promise.resolve(t.setLocalDescription(e)).then(function() {
								var e;
								function r(r) {
									return Promise.resolve(t.setRemoteDescription({
										type: "answer",
										sdp: e
									})).then(function() {
										if (n.pc !== t) throw new Error("gateway transport closed");
									});
								}
								var i = E(function() {
									return Promise.resolve(fetch(n.base + "/v1/webrtc/sessions/" + n.sessionId, {
										method: "PATCH",
										headers: n.headers({ "Content-Type": "application/sdp" }),
										body: t.localDescription.sdp
									})).then(function(t) {
										return u = t.status >= 500 && t.status < 600, Promise.resolve(t.text()).then(function(n) {
											if (e = n, !t.ok) throw new Error("gateway take-over renegotiation failed: " + t.status + " " + e);
										});
									});
								}, function(t) {
									throw u = u || t instanceof TypeError, t;
								});
								return i && i.then ? i.then(r) : r();
							});
						});
					}
					var i = function() {
						if (c) return Promise.resolve(c.sender.replaceTrack(s)).then(function() {
							c.direction = "sendrecv";
						});
						a = t.addTrack(s, r);
					}();
					return i && i.then ? i.then(e) : e();
				}, function(o) {
					return r.getTracks().forEach(function(t) {
						return t.stop();
					}), Promise.resolve(n.undoTakeOver(t, c, a)).then(function(r) {
						if (e && u && r && n.pc === t) {
							var a = n.doTakeOver(t, !1);
							return i = 1, a;
						}
						throw o;
					});
				});
				return l && l.then ? l.then(o) : o(l);
			});
		} catch (t) {
			return Promise.reject(t);
		}
	}, e.undoTakeOver = function(t, e, n) {
		try {
			return Promise.resolve("closed" !== t.signalingState && E(function() {
				function r() {
					var r = function() {
						if (e) return e.direction = "recvonly", Promise.resolve(e.sender.replaceTrack(null)).then(function() {});
						n && t.removeTrack(n);
					}();
					return !r || !r.then || r.then(function() {
						return !0;
					});
				}
				var i = function() {
					if ("have-local-offer" === t.signalingState) return Promise.resolve(t.setLocalDescription({ type: "rollback" })).then(function() {});
				}();
				return i && i.then ? i.then(r) : r();
			}, function(t) {
				return console.error("gateway take-over rollback failed", t), !1;
			}));
		} catch (t) {
			return Promise.reject(t);
		}
	}, e.micConstraints = function() {
		return {
			deviceId: this.config.captureDeviceId,
			sampleRate: this.config.sampleRate,
			channelCount: 1,
			autoGainControl: !0,
			echoCancellation: !0,
			noiseSuppression: !0
		};
	}, e.resumeAudioPlayback = function() {
		try {
			var t;
			return Promise.resolve(null == (t = this.audioEl) ? void 0 : t.play()).then(function() {});
		} catch (t) {
			return Promise.reject(t);
		}
	}, e.close = function() {
		var t, e;
		this.sessionId && fetch(this.base + "/v1/webrtc/sessions/" + this.sessionId, {
			method: "DELETE",
			headers: this.headers()
		}).catch(function() {});
		try {
			var n;
			null == (n = this.dc) || n.close();
		} catch (t) {}
		null == (t = this.localStream) || t.getTracks().forEach(function(t) {
			return t.stop();
		});
		try {
			var r;
			null == (r = this.pc) || r.close();
		} catch (t) {}
		null == (e = this.analyzer) || e.cleanup().catch(function() {}), this.pc = void 0, this.dc = void 0, this.localStream = void 0, this.audioEl = void 0, this.analyzer = void 0, this.sessionId = void 0;
	}, e.identity = function() {
		return this.config.identity || "client";
	}, e.headers = function(t) {
		var e = h({ "X-Retell-Client-JS-SDK-Version": P }, t || {});
		return this.config.accessToken && (e.Authorization = "Bearer " + this.config.accessToken), e;
	}, e.sendCandidate = function(t) {
		try {
			var e = this;
			if (!e.sessionId) return Promise.resolve();
			var n = E(function() {
				return Promise.resolve(fetch(e.base + "/v1/webrtc/sessions/" + e.sessionId, {
					method: "PATCH",
					headers: e.headers({ "Content-Type": "application/json" }),
					body: JSON.stringify({ candidate: t.toJSON() })
				})).then(function() {});
			}, function(t) {
				console.error("gateway trickle PATCH failed", t);
			});
			return Promise.resolve(n && n.then ? n.then(function() {}) : void 0);
		} catch (t) {
			return Promise.reject(t);
		}
	}, e.attachRemote = function(t, e) {
		var n = new Audio();
		n.autoplay = !0, n.srcObject = t, this.config.playbackDeviceId && n.setSinkId && n.setSinkId(this.config.playbackDeviceId).catch(function() {}), n.play().catch(function() {}), this.audioEl = n, this.config.emitRawAudioSamples && (this.analyzer = function(t) {
			var e = new (window.AudioContext || window.webkitAudioContext)();
			e.resume().catch(function() {});
			var n = e.createMediaStreamSource(new MediaStream([t])), r = e.createAnalyser();
			return n.connect(r), {
				calculateVolume: function() {
					var t = new Float32Array(r.fftSize);
					r.getFloatTimeDomainData(t);
					for (var e = 0, n = 0; n < t.length; n++) e += t[n] * t[n];
					return Math.sqrt(e / t.length);
				},
				analyser: r,
				cleanup: function() {
					try {
						try {
							n.disconnect();
						} catch (t) {}
						var t = E(function() {
							return Promise.resolve(e.close()).then(function() {});
						}, function() {});
						return Promise.resolve(t && t.then ? t.then(function() {}) : void 0);
					} catch (t) {
						return Promise.reject(t);
					}
				}
			};
		}(e));
	}, t;
}();
var j = new TextDecoder();
var D = /*#__PURE__*/ function() {
	function t(t) {
		this.room = void 0, this.config = void 0, this.micTrack = void 0, this.readyFired = !1, this.config = t;
	}
	var c = t.prototype;
	return c.connect = function(t) {
		try {
			var a = this;
			if (!a.config.accessToken) throw new Error("accessToken is required for the livekit transport");
			var s = new Room({
				audioCaptureDefaults: {
					autoGainControl: !0,
					echoCancellation: !0,
					noiseSuppression: !0,
					channelCount: 1,
					deviceId: a.config.captureDeviceId,
					sampleRate: a.config.sampleRate
				},
				audioOutput: { deviceId: a.config.playbackDeviceId }
			});
			a.room = s;
			var c = !1;
			return s.on(RoomEvent.Disconnected, function() {
				c && t.onDisconnected();
			}), a.config.listener && s.on(RoomEvent.ParticipantDisconnected, function() {
				c && 0 === s.remoteParticipants.size && t.onDisconnected();
			}), s.on(RoomEvent.TrackSubscribed, function(e, n) {
				if (e.kind === Track.Kind.Audio && e instanceof RemoteAudioTrack) {
					if (a.config.listener ? !a.readyFired : "agent_audio" === n.trackName) {
						a.readyFired = !0;
						var s = null;
						a.config.emitRawAudioSamples && (s = createAudioAnalyser(e)), t.onCallReady(s);
					}
					e.attach();
				}
			}), s.on(RoomEvent.DataReceived, function(e, n) {
				if ("server" === (null == n ? void 0 : n.identity)) try {
					t.onData(JSON.parse(j.decode(e)));
				} catch (t) {
					console.error("Error decoding data received", t);
				}
			}), Promise.resolve(s.connect(a.config.url || "wss://retell-ai-4ihahnq7.livekit.cloud", a.config.accessToken)).then(function() {
				c = !0, a.config.listener || s.localParticipant.setMicrophoneEnabled(!0), t.onConnected();
			});
		} catch (t) {
			return Promise.reject(t);
		}
	}, c.takeOver = function() {
		try {
			var t = this, e = t.room;
			if (!e) throw new Error("livekit transport not connected");
			return t.micTrack ? Promise.resolve() : Promise.resolve(createLocalAudioTrack({
				deviceId: t.config.captureDeviceId,
				sampleRate: t.config.sampleRate,
				channelCount: 1,
				autoGainControl: !0,
				echoCancellation: !0,
				noiseSuppression: !0
			})).then(function(n) {
				return function(r, i) {
					try {
						var o = Promise.resolve(t.waitForPublishGrant(e)).then(function() {
							return Promise.resolve(e.localParticipant.publishTrack(n)).then(function() {
								t.micTrack = n;
							});
						});
					} catch (t) {
						return i(t);
					}
					return o && o.then ? o.then(void 0, i) : o;
				}(0, function(t) {
					throw n.stop(), t;
				});
			});
		} catch (t) {
			return Promise.reject(t);
		}
	}, c.waitForPublishGrant = function(t) {
		return new Promise(function(e, n) {
			var r, i = function() {
				clearTimeout(o), t.localParticipant.off(ParticipantEvent.ParticipantPermissionsChanged, a);
			}, o = setTimeout(function() {
				i(), n(/* @__PURE__ */ new Error("Timed out waiting for publish permission"));
			}, 5e3), a = function() {
				var n;
				null != (n = t.localParticipant.permissions) && n.canPublish && (i(), e());
			};
			t.localParticipant.on(ParticipantEvent.ParticipantPermissionsChanged, a), null != (r = t.localParticipant.permissions) && r.canPublish && (i(), e());
		});
	}, c.setMicEnabled = function(t) {
		var e;
		this.micTrack ? t ? this.micTrack.unmute() : this.micTrack.mute() : null == (e = this.room) || e.localParticipant.setMicrophoneEnabled(t);
	}, c.resumeAudioPlayback = function() {
		try {
			var t;
			return Promise.resolve(null == (t = this.room) ? void 0 : t.startAudio()).then(function() {});
		} catch (t) {
			return Promise.reject(t);
		}
	}, c.close = function() {
		var t, e;
		null == (t = this.micTrack) || t.stop(), this.micTrack = void 0, null == (e = this.room) || e.disconnect(), this.room = void 0, this.readyFired = !1;
	}, t;
}();
function R(t, e) {
	var n;
	return null != (n = t.transport) ? n : e;
}
var B = /*#__PURE__*/ function(t) {
	function e(e) {
		var n;
		return void 0 === e && (e = {}), (n = t.call(this) || this).transport = void 0, n.connected = !1, n.defaultTransport = void 0, n.isAgentTalking = !1, n.analyzerComponent = void 0, n.captureAudioFrame = void 0, n.defaultTransport = e.defaultTransport || "livekit", n;
	}
	f(e, t);
	var n = e.prototype;
	return n.startCall = function(t) {
		try {
			var e, n = this;
			n.transport && n.stopCall();
			var r = function() {
				return n.transport === e;
			};
			return Promise.resolve(function(i, o) {
				try {
					var a = (s = R(t, n.defaultTransport), e = "gateway" === s ? new I(t) : new D(t), n.transport = e, Promise.resolve(e.connect({
						onConnected: function() {
							r() && !n.connected && (n.connected = !0, n.emit("call_started"));
						},
						onCallReady: function(t) {
							r() && (n.emit("call_ready"), t && (n.analyzerComponent = t, n.captureAudioFrame = window.requestAnimationFrame(function() {
								return n.captureAudioSamples();
							})));
						},
						onData: function(t) {
							r() && n.handleServerEvent(t);
						},
						onDisconnected: function() {
							r() && n.stopCall();
						},
						onError: function(t) {
							r() && n.emit("error", t);
						}
					})).then(function() {}));
				} catch (t) {
					return o(t);
				}
				var s;
				return a && a.then ? a.then(void 0, o) : a;
			}(0, function(t) {
				!e || r() ? (n.emit("error", "Error starting call"), console.error("Error starting call", t), n.stopCall()) : e.close();
			}));
		} catch (t) {
			return Promise.reject(t);
		}
	}, n.startAudioPlayback = function() {
		try {
			var t;
			return Promise.resolve(null == (t = this.transport) ? void 0 : t.resumeAudioPlayback()).then(function() {});
		} catch (t) {
			return Promise.reject(t);
		}
	}, n.stopCall = function() {
		var t, e = this.connected;
		this.connected = !1, e && this.emit("call_ended"), null == (t = this.transport) || t.close(), this.transport = void 0, this.isAgentTalking = !1, this.analyzerComponent && (this.analyzerComponent.cleanup(), this.analyzerComponent = void 0), this.captureAudioFrame && (window.cancelAnimationFrame(this.captureAudioFrame), this.captureAudioFrame = void 0);
	}, n.takeOver = function() {
		try {
			var t;
			return Promise.resolve(null == (t = this.transport) || null == t.takeOver ? void 0 : t.takeOver()).then(function() {});
		} catch (t) {
			return Promise.reject(t);
		}
	}, n.mute = function() {
		var t;
		this.connected && (null == (t = this.transport) || t.setMicEnabled(!1));
	}, n.unmute = function() {
		var t;
		this.connected && (null == (t = this.transport) || t.setMicEnabled(!0));
	}, n.captureAudioSamples = function() {
		var t = this;
		if (this.connected && this.analyzerComponent) {
			var e = new Float32Array(this.analyzerComponent.analyser.fftSize);
			this.analyzerComponent.analyser.getFloatTimeDomainData(e), this.emit("audio", e), this.captureAudioFrame = window.requestAnimationFrame(function() {
				return t.captureAudioSamples();
			});
		}
	}, n.handleServerEvent = function(t) {
		"status" !== (null == t ? void 0 : t.type) ? "update" === (null == t ? void 0 : t.event_type) ? this.emit("update", t) : "metadata" === (null == t ? void 0 : t.event_type) ? this.emit("metadata", t) : "agent_start_talking" === (null == t ? void 0 : t.event_type) ? (this.isAgentTalking = !0, this.emit("agent_start_talking")) : "agent_stop_talking" === (null == t ? void 0 : t.event_type) ? (this.isAgentTalking = !1, this.emit("agent_stop_talking")) : "node_transition" === (null == t ? void 0 : t.event_type) && this.emit("node_transition", t) : "ended" !== t.state && "replaced" !== t.state || this.stopCall();
	}, e;
}(import_eventemitter3.default);
//#endregion
export { B };
