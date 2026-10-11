//#region node_modules/.nitro/vite/services/ssr/assets/call-actions-OH0ftX5b.js
async function startCallApi(data) {
	const res = await fetch("/api/calls/start", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	});
	if (!res.ok) {
		const errorJson = await res.json().catch(() => ({}));
		throw new Error(errorJson.error || `Failed to start call (Status: ${res.status})`);
	}
	return await res.json();
}
async function getCallApi(callId) {
	const res = await fetch(`/api/calls/${callId}`);
	if (!res.ok) {
		if (res.status === 404) return null;
		throw new Error(`Failed to retrieve call ${callId} (Status: ${res.status})`);
	}
	return await res.json();
}
async function listCallsApi() {
	const res = await fetch("/api/calls");
	if (!res.ok) throw new Error(`Failed to list calls (Status: ${res.status})`);
	return await res.json();
}
async function endCallApi(callId, extra) {
	const res = await fetch("/api/calls/end", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			callId,
			...extra
		})
	});
	if (!res.ok) {
		const errorJson = await res.json().catch(() => ({}));
		throw new Error(errorJson.error || `Failed to end call ${callId} (Status: ${res.status})`);
	}
	return await res.json();
}
async function deleteCallApi(callId) {
	const res = await fetch(`/api/calls/${callId}`, { method: "DELETE" });
	if (!res.ok) {
		const errorJson = await res.json().catch(() => ({}));
		throw new Error(errorJson.error || `Failed to delete call ${callId} (Status: ${res.status})`);
	}
	return true;
}
async function clearAllCallsApi() {
	const res = await fetch("/api/calls", { method: "DELETE" });
	if (!res.ok) {
		const errorJson = await res.json().catch(() => ({}));
		throw new Error(errorJson.error || `Failed to clear calls (Status: ${res.status})`);
	}
	return true;
}
var startCallServerFn = async ({ data }) => startCallApi(data);
var listCallsServerFn = async () => listCallsApi();
//#endregion
export { clearAllCallsApi, deleteCallApi, endCallApi, getCallApi, listCallsServerFn, startCallServerFn };
