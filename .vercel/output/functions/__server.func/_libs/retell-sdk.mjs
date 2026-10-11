//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/internal/tslib.mjs
function __classPrivateFieldSet(receiver, state, value, kind, f) {
	if (kind === "m") throw new TypeError("Private method is not writable");
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
	return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
function __classPrivateFieldGet(receiver, state, kind, f) {
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
	return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/internal/utils/uuid.mjs
/**
* https://stackoverflow.com/a/2117523
*/
var uuid4 = function() {
	const { crypto } = globalThis;
	if (crypto?.randomUUID) {
		uuid4 = crypto.randomUUID.bind(crypto);
		return crypto.randomUUID();
	}
	const u8 = /* @__PURE__ */ new Uint8Array(1);
	const randomByte = crypto ? () => crypto.getRandomValues(u8)[0] : () => Math.random() * 255 & 255;
	return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) => (+c ^ randomByte() & 15 >> +c / 4).toString(16));
};
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/internal/errors.mjs
function isAbortError(err) {
	return typeof err === "object" && err !== null && ("name" in err && err.name === "AbortError" || "message" in err && String(err.message).includes("FetchRequestCanceledException"));
}
var castToError = (err) => {
	if (err instanceof Error) return err;
	if (typeof err === "object" && err !== null) {
		try {
			if (Object.prototype.toString.call(err) === "[object Error]") {
				const error = new Error(err.message, err.cause ? { cause: err.cause } : {});
				if (err.stack) error.stack = err.stack;
				if (err.cause && !error.cause) error.cause = err.cause;
				if (err.name) error.name = err.name;
				return error;
			}
		} catch {}
		try {
			return new Error(JSON.stringify(err));
		} catch {}
	}
	return new Error(err);
};
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/core/error.mjs
var RetellError = class extends Error {};
var APIError = class APIError extends RetellError {
	constructor(status, error, message, headers) {
		super(`${APIError.makeMessage(status, error, message)}`);
		this.status = status;
		this.headers = headers;
		this.error = error;
	}
	static makeMessage(status, error, message) {
		const msg = error?.message ? typeof error.message === "string" ? error.message : JSON.stringify(error.message) : error ? JSON.stringify(error) : message;
		if (status && msg) return `${status} ${msg}`;
		if (status) return `${status} status code (no body)`;
		if (msg) return msg;
		return "(no status code or body)";
	}
	static generate(status, errorResponse, message, headers) {
		if (!status || !headers) return new APIConnectionError({
			message,
			cause: castToError(errorResponse)
		});
		const error = errorResponse;
		if (status === 400) return new BadRequestError(status, error, message, headers);
		if (status === 401) return new AuthenticationError(status, error, message, headers);
		if (status === 403) return new PermissionDeniedError(status, error, message, headers);
		if (status === 404) return new NotFoundError(status, error, message, headers);
		if (status === 409) return new ConflictError(status, error, message, headers);
		if (status === 422) return new UnprocessableEntityError(status, error, message, headers);
		if (status === 429) return new RateLimitError(status, error, message, headers);
		if (status >= 500) return new InternalServerError(status, error, message, headers);
		return new APIError(status, error, message, headers);
	}
};
var APIUserAbortError = class extends APIError {
	constructor({ message } = {}) {
		super(void 0, void 0, message || "Request was aborted.", void 0);
	}
};
var APIConnectionError = class extends APIError {
	constructor({ message, cause }) {
		super(void 0, void 0, message || "Connection error.", void 0);
		if (cause) this.cause = cause;
	}
};
var APIConnectionTimeoutError = class extends APIConnectionError {
	constructor({ message } = {}) {
		super({ message: message ?? "Request timed out." });
	}
};
var BadRequestError = class extends APIError {};
var AuthenticationError = class extends APIError {};
var PermissionDeniedError = class extends APIError {};
var NotFoundError = class extends APIError {};
var ConflictError = class extends APIError {};
var UnprocessableEntityError = class extends APIError {};
var RateLimitError = class extends APIError {};
var InternalServerError = class extends APIError {};
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/internal/utils/values.mjs
var startsWithSchemeRegexp = /^[a-z][a-z0-9+.-]*:/i;
var isAbsoluteURL = (url) => {
	return startsWithSchemeRegexp.test(url);
};
var isArray = (val) => (isArray = Array.isArray, isArray(val));
var isReadonlyArray = isArray;
function isEmptyObj(obj) {
	if (!obj) return true;
	for (const _k in obj) return false;
	return true;
}
function hasOwn(obj, key) {
	return Object.prototype.hasOwnProperty.call(obj, key);
}
var validatePositiveInteger = (name, n) => {
	if (typeof n !== "number" || !Number.isInteger(n)) throw new RetellError(`${name} must be an integer`);
	if (n < 0) throw new RetellError(`${name} must be a positive integer`);
	return n;
};
var safeJSON = (text) => {
	try {
		return JSON.parse(text);
	} catch (err) {
		return;
	}
};
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/internal/utils/sleep.mjs
var sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/version.mjs
var VERSION = "6.2.4";
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/internal/detect-platform.mjs
/**
* Note this does not detect 'browser'; for that, use getBrowserInfo().
*/
function getDetectedPlatform() {
	if (typeof Deno !== "undefined" && Deno.build != null) return "deno";
	if (typeof EdgeRuntime !== "undefined") return "edge";
	if (Object.prototype.toString.call(typeof globalThis.process !== "undefined" ? globalThis.process : 0) === "[object process]") return "node";
	return "unknown";
}
var getPlatformProperties = () => {
	const detectedPlatform = getDetectedPlatform();
	if (detectedPlatform === "deno") return {
		"X-Stainless-Lang": "js",
		"X-Stainless-Package-Version": VERSION,
		"X-Stainless-OS": normalizePlatform(Deno.build.os),
		"X-Stainless-Arch": normalizeArch(Deno.build.arch),
		"X-Stainless-Runtime": "deno",
		"X-Stainless-Runtime-Version": typeof Deno.version === "string" ? Deno.version : Deno.version?.deno ?? "unknown"
	};
	if (typeof EdgeRuntime !== "undefined") return {
		"X-Stainless-Lang": "js",
		"X-Stainless-Package-Version": VERSION,
		"X-Stainless-OS": "Unknown",
		"X-Stainless-Arch": `other:${EdgeRuntime}`,
		"X-Stainless-Runtime": "edge",
		"X-Stainless-Runtime-Version": globalThis.process.version
	};
	if (detectedPlatform === "node") return {
		"X-Stainless-Lang": "js",
		"X-Stainless-Package-Version": VERSION,
		"X-Stainless-OS": normalizePlatform(globalThis.process.platform ?? "unknown"),
		"X-Stainless-Arch": normalizeArch(globalThis.process.arch ?? "unknown"),
		"X-Stainless-Runtime": "node",
		"X-Stainless-Runtime-Version": globalThis.process.version ?? "unknown"
	};
	const browserInfo = getBrowserInfo();
	if (browserInfo) return {
		"X-Stainless-Lang": "js",
		"X-Stainless-Package-Version": VERSION,
		"X-Stainless-OS": "Unknown",
		"X-Stainless-Arch": "unknown",
		"X-Stainless-Runtime": `browser:${browserInfo.browser}`,
		"X-Stainless-Runtime-Version": browserInfo.version
	};
	return {
		"X-Stainless-Lang": "js",
		"X-Stainless-Package-Version": VERSION,
		"X-Stainless-OS": "Unknown",
		"X-Stainless-Arch": "unknown",
		"X-Stainless-Runtime": "unknown",
		"X-Stainless-Runtime-Version": "unknown"
	};
};
function getBrowserInfo() {
	if (typeof navigator === "undefined" || !navigator) return null;
	for (const { key, pattern } of [
		{
			key: "edge",
			pattern: /Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
		},
		{
			key: "ie",
			pattern: /MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
		},
		{
			key: "ie",
			pattern: /Trident(?:.*rv\:(\d+)\.(\d+)(?:\.(\d+))?)?/
		},
		{
			key: "chrome",
			pattern: /Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
		},
		{
			key: "firefox",
			pattern: /Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
		},
		{
			key: "safari",
			pattern: /(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/
		}
	]) {
		const match = pattern.exec(navigator.userAgent);
		if (match) return {
			browser: key,
			version: `${match[1] || 0}.${match[2] || 0}.${match[3] || 0}`
		};
	}
	return null;
}
var normalizeArch = (arch) => {
	if (arch === "x32") return "x32";
	if (arch === "x86_64" || arch === "x64") return "x64";
	if (arch === "arm") return "arm";
	if (arch === "aarch64" || arch === "arm64") return "arm64";
	if (arch) return `other:${arch}`;
	return "unknown";
};
var normalizePlatform = (platform) => {
	platform = platform.toLowerCase();
	if (platform.includes("ios")) return "iOS";
	if (platform === "android") return "Android";
	if (platform === "darwin") return "MacOS";
	if (platform === "win32") return "Windows";
	if (platform === "freebsd") return "FreeBSD";
	if (platform === "openbsd") return "OpenBSD";
	if (platform === "linux") return "Linux";
	if (platform) return `Other:${platform}`;
	return "Unknown";
};
var _platformHeaders;
var getPlatformHeaders = () => {
	return _platformHeaders ?? (_platformHeaders = getPlatformProperties());
};
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/internal/shims.mjs
function getDefaultFetch() {
	if (typeof fetch !== "undefined") return fetch;
	throw new Error("`fetch` is not defined as a global; Either pass `fetch` to the client, `new Retell({ fetch })` or polyfill the global, `globalThis.fetch = fetch`");
}
function makeReadableStream(...args) {
	const ReadableStream = globalThis.ReadableStream;
	if (typeof ReadableStream === "undefined") throw new Error("`ReadableStream` is not defined as a global; You will need to polyfill it, `globalThis.ReadableStream = ReadableStream`");
	return new ReadableStream(...args);
}
function ReadableStreamFrom(iterable) {
	let iter = Symbol.asyncIterator in iterable ? iterable[Symbol.asyncIterator]() : iterable[Symbol.iterator]();
	return makeReadableStream({
		start() {},
		async pull(controller) {
			const { done, value } = await iter.next();
			if (done) controller.close();
			else controller.enqueue(value);
		},
		async cancel() {
			await iter.return?.();
		}
	});
}
/**
* Cancels a ReadableStream we don't need to consume.
* See https://undici.nodejs.org/#/?id=garbage-collection
*/
async function CancelReadableStream(stream) {
	if (stream === null || typeof stream !== "object") return;
	if (stream[Symbol.asyncIterator]) {
		await stream[Symbol.asyncIterator]().return?.();
		return;
	}
	const reader = stream.getReader();
	const cancelPromise = reader.cancel();
	reader.releaseLock();
	await cancelPromise;
}
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/internal/request-options.mjs
var FallbackEncoder = ({ headers, body }) => {
	return {
		bodyHeaders: { "content-type": "application/json" },
		body: JSON.stringify(body)
	};
};
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/internal/utils/query.mjs
/**
* Basic re-implementation of `qs.stringify` for primitive types.
*/
function stringifyQuery(query) {
	return Object.entries(query).filter(([_, value]) => typeof value !== "undefined").map(([key, value]) => {
		if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
		if (value === null) return `${encodeURIComponent(key)}=`;
		throw new RetellError(`Cannot stringify type ${typeof value}; Expected string, number, boolean, or null. If you need to pass nested query parameters, you can manually encode them, e.g. { query: { 'foo[key1]': value1, 'foo[key2]': value2 } }, and please open a GitHub issue requesting better support for your use case.`);
	}).join("&");
}
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/internal/uploads.mjs
var checkFileSupport = () => {
	if (typeof File === "undefined") {
		const { process } = globalThis;
		const isOldNode = typeof process?.versions?.node === "string" && parseInt(process.versions.node.split(".")) < 20;
		throw new Error("`File` is not defined as a global, which is required for file uploads." + (isOldNode ? " Update to Node 20 LTS or newer, or set `globalThis.File` to `import('node:buffer').File`." : ""));
	}
};
/**
* Construct a `File` instance. This is used to ensure a helpful error is thrown
* for environments that don't define a global `File` yet.
*/
function makeFile(fileBits, fileName, options) {
	checkFileSupport();
	return new File(fileBits, fileName ?? "unknown_file", options);
}
function getName(value) {
	return (typeof value === "object" && value !== null && ("name" in value && value.name && String(value.name) || "url" in value && value.url && String(value.url) || "filename" in value && value.filename && String(value.filename) || "path" in value && value.path && String(value.path)) || "").split(/[\\/]/).pop() || void 0;
}
var isAsyncIterable = (value) => value != null && typeof value === "object" && typeof value[Symbol.asyncIterator] === "function";
var multipartFormRequestOptions = async (opts, fetch) => {
	return {
		...opts,
		body: await createForm(opts.body, fetch)
	};
};
var supportsFormDataMap = /* @__PURE__ */ new WeakMap();
/**
* node-fetch doesn't support the global FormData object in recent node versions. Instead of sending
* properly-encoded form data, it just stringifies the object, resulting in a request body of "[object FormData]".
* This function detects if the fetch function provided supports the global FormData object to avoid
* confusing error messages later on.
*/
function supportsFormData(fetchObject) {
	const fetch = typeof fetchObject === "function" ? fetchObject : fetchObject.fetch;
	const cached = supportsFormDataMap.get(fetch);
	if (cached) return cached;
	const promise = (async () => {
		try {
			const FetchResponse = "Response" in fetch ? fetch.Response : (await fetch("data:,")).constructor;
			const data = new FormData();
			if (data.toString() === await new FetchResponse(data).text()) return false;
			return true;
		} catch {
			return true;
		}
	})();
	supportsFormDataMap.set(fetch, promise);
	return promise;
}
var createForm = async (body, fetch) => {
	if (!await supportsFormData(fetch)) throw new TypeError("The provided fetch function does not support file uploads with the current global FormData class.");
	const form = new FormData();
	await Promise.all(Object.entries(body || {}).map(([key, value]) => addFormValue(form, key, value)));
	return form;
};
var isNamedBlob = (value) => value instanceof Blob && "name" in value;
var isUploadable = (value) => typeof value === "object" && value !== null && (value instanceof Response || isAsyncIterable(value) || isNamedBlob(value));
var hasUploadableValue = (value) => {
	if (isUploadable(value)) return true;
	if (Array.isArray(value)) return value.some(hasUploadableValue);
	if (value && typeof value === "object") {
		for (const k in value) if (hasUploadableValue(value[k])) return true;
	}
	return false;
};
var addFormValue = async (form, key, value) => {
	if (value === void 0) return;
	if (value == null) throw new TypeError(`Received null for "${key}"; to pass null in FormData, you must use the string 'null'`);
	if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") form.append(key, String(value));
	else if (value instanceof Response) form.append(key, makeFile([await value.blob()], getName(value)));
	else if (isAsyncIterable(value)) form.append(key, makeFile([await new Response(ReadableStreamFrom(value)).blob()], getName(value)));
	else if (isNamedBlob(value)) form.append(key, value, getName(value));
	else if (Array.isArray(value)) {
		if (hasUploadableValue(value)) await Promise.all(value.map((entry) => addFormValue(form, key, entry)));
		else form.append(key, JSON.stringify(value));
	} else if (typeof value === "object") {
		if (hasUploadableValue(value)) await Promise.all(Object.entries(value).map(([name, prop]) => addFormValue(form, `${key}[${name}]`, prop)));
		else form.append(key, JSON.stringify(value));
	} else throw new TypeError(`Invalid value given to form, expected a string, number, boolean, object, Array, File or Blob but got ${value} instead`);
};
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/internal/to-file.mjs
/**
* This check adds the arrayBuffer() method type because it is available and used at runtime
*/
var isBlobLike = (value) => value != null && typeof value === "object" && typeof value.size === "number" && typeof value.type === "string" && typeof value.text === "function" && typeof value.slice === "function" && typeof value.arrayBuffer === "function";
/**
* This check adds the arrayBuffer() method type because it is available and used at runtime
*/
var isFileLike = (value) => value != null && typeof value === "object" && typeof value.name === "string" && typeof value.lastModified === "number" && isBlobLike(value);
var isResponseLike = (value) => value != null && typeof value === "object" && typeof value.url === "string" && typeof value.blob === "function";
/**
* Helper for creating a {@link File} to pass to an SDK upload method from a variety of different data formats
* @param value the raw content of the file. Can be an {@link Uploadable}, BlobLikePart, or AsyncIterable of BlobLikeParts
* @param {string=} name the name of the file. If omitted, toFile will try to determine a file name from bits if possible
* @param {Object=} options additional properties
* @param {string=} options.type the MIME type of the content
* @param {number=} options.lastModified the last modified timestamp
* @returns a {@link File} with the given properties
*/
async function toFile(value, name, options) {
	checkFileSupport();
	value = await value;
	if (isFileLike(value)) {
		if (value instanceof File) return value;
		return makeFile([await value.arrayBuffer()], value.name);
	}
	if (isResponseLike(value)) {
		const blob = await value.blob();
		name || (name = new URL(value.url).pathname.split(/[\\/]/).pop());
		return makeFile(await getBytes(blob), name, options);
	}
	const parts = await getBytes(value);
	name || (name = getName(value));
	if (!options?.type) {
		const type = parts.find((part) => typeof part === "object" && "type" in part && part.type);
		if (typeof type === "string") options = {
			...options,
			type
		};
	}
	return makeFile(parts, name, options);
}
async function getBytes(value) {
	let parts = [];
	if (typeof value === "string" || ArrayBuffer.isView(value) || value instanceof ArrayBuffer) parts.push(value);
	else if (isBlobLike(value)) parts.push(value instanceof Blob ? value : await value.arrayBuffer());
	else if (isAsyncIterable(value)) for await (const chunk of value) parts.push(...await getBytes(chunk));
	else {
		const constructor = value?.constructor?.name;
		throw new Error(`Unexpected data type: ${typeof value}${constructor ? `; constructor: ${constructor}` : ""}${propsForError(value)}`);
	}
	return parts;
}
function propsForError(value) {
	if (typeof value !== "object" || value === null) return "";
	return `; props: [${Object.getOwnPropertyNames(value).map((p) => `"${p}"`).join(", ")}]`;
}
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/lib/webhook_auth.mjs
var FIVE_MINUTES = 3e5;
var SHA_256_HEX_LENGTH = 64;
function getSubtleCrypto() {
	const subtle = globalThis.crypto?.subtle;
	if (!subtle) throw new Error("Webhook verification requires a runtime with the Web Crypto API");
	return subtle;
}
function encode(input) {
	return new TextEncoder().encode(input);
}
async function importHmacKey(secret, usage) {
	return getSubtleCrypto().importKey("raw", encode(secret), {
		name: "HMAC",
		hash: "SHA-256"
	}, false, [usage]);
}
function bytesToHex(bytes) {
	return Array.from(new Uint8Array(bytes)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
function hexToBytes(hex) {
	if (hex.length !== SHA_256_HEX_LENGTH || !/^[0-9a-f]+$/i.test(hex)) return;
	return Uint8Array.from({ length: SHA_256_HEX_LENGTH / 2 }, (_, index) => Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16));
}
async function hmacSha256Hex(secret, input) {
	const subtle = getSubtleCrypto();
	const key = await importHmacKey(secret, "sign");
	return bytesToHex(await subtle.sign("HMAC", key, encode(input)));
}
async function hmacSha256Verify(secret, input, digest) {
	const subtle = getSubtleCrypto();
	const key = await importHmacKey(secret, "verify");
	return subtle.verify("HMAC", key, digest, encode(input));
}
var symmetric = {
	async sign(input, secret, timestamp = Date.now()) {
		return `v=${timestamp},d=${await hmacSha256Hex(secret, input + timestamp)}`;
	},
	async verify(input, secret, signature, opts = {}) {
		const match = /^v=(\d+),d=([0-9a-f]+)$/i.exec(signature);
		if (!match) return false;
		const poststamp = Number(match[1]);
		const postDigest = hexToBytes(match[2]);
		const timestamp = opts.timestamp ?? Date.now();
		const timeout = opts.timeout ?? FIVE_MINUTES;
		if (!Number.isSafeInteger(poststamp) || !Number.isFinite(timestamp) || !Number.isFinite(timeout) || timeout < 0 || !postDigest || Math.abs(timestamp - poststamp) > timeout) return false;
		return hmacSha256Verify(secret, input + poststamp, postDigest);
	}
};
/**
* Verify a Retell webhook signature against the exact raw request body.
*/
var verify = (body, apiKey, signature) => {
	return symmetric.verify(body, apiKey, signature);
};
/**
* Sign a webhook body using the Retell webhook signature format.
*/
var sign = (body, apiKey) => {
	return symmetric.sign(body, apiKey);
};
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/core/resource.mjs
var APIResource = class {
	constructor(client) {
		this._client = client;
	}
};
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/internal/headers.mjs
var brand_privateNullableHeaders = /* @__PURE__ */ Symbol("brand.privateNullableHeaders");
function* iterateHeaders(headers) {
	if (!headers) return;
	if (brand_privateNullableHeaders in headers) {
		const { values, nulls } = headers;
		yield* values.entries();
		for (const name of nulls) yield [name, null];
		return;
	}
	let shouldClear = false;
	let iter;
	if (headers instanceof Headers) iter = headers.entries();
	else if (isReadonlyArray(headers)) iter = headers;
	else {
		shouldClear = true;
		iter = Object.entries(headers ?? {});
	}
	for (let row of iter) {
		const name = row[0];
		if (typeof name !== "string") throw new TypeError("expected header name to be a string");
		const values = isReadonlyArray(row[1]) ? row[1] : [row[1]];
		let didClear = false;
		for (const value of values) {
			if (value === void 0) continue;
			if (shouldClear && !didClear) {
				didClear = true;
				yield [name, null];
			}
			yield [name, value];
		}
	}
}
var buildHeaders = (newHeaders) => {
	const targetHeaders = new Headers();
	const nullHeaders = /* @__PURE__ */ new Set();
	for (const headers of newHeaders) {
		const seenHeaders = /* @__PURE__ */ new Set();
		for (const [name, value] of iterateHeaders(headers)) {
			const lowerName = name.toLowerCase();
			if (!seenHeaders.has(lowerName)) {
				targetHeaders.delete(name);
				seenHeaders.add(lowerName);
			}
			if (value === null) {
				targetHeaders.delete(name);
				nullHeaders.add(lowerName);
			} else {
				targetHeaders.append(name, value);
				nullHeaders.delete(lowerName);
			}
		}
	}
	return {
		[brand_privateNullableHeaders]: true,
		values: targetHeaders,
		nulls: nullHeaders
	};
};
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/internal/utils/path.mjs
/**
* Percent-encode everything that isn't safe to have in a path without encoding safe chars.
*
* Taken from https://datatracker.ietf.org/doc/html/rfc3986#section-3.3:
* > unreserved  = ALPHA / DIGIT / "-" / "." / "_" / "~"
* > sub-delims  = "!" / "$" / "&" / "'" / "(" / ")" / "*" / "+" / "," / ";" / "="
* > pchar       = unreserved / pct-encoded / sub-delims / ":" / "@"
*/
function encodeURIPath(str) {
	return str.replace(/[^A-Za-z0-9\-._~!$&'()*+,;=:@]+/g, encodeURIComponent);
}
var EMPTY = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.create(null));
var createPathTagFunction = (pathEncoder = encodeURIPath) => function path(statics, ...params) {
	if (statics.length === 1) return statics[0];
	let postPath = false;
	const invalidSegments = [];
	const path = statics.reduce((previousValue, currentValue, index) => {
		if (/[?#]/.test(currentValue)) postPath = true;
		const value = params[index];
		let encoded = (postPath ? encodeURIComponent : pathEncoder)("" + value);
		if (index !== params.length && (value == null || typeof value === "object" && value.toString === Object.getPrototypeOf(Object.getPrototypeOf(value.hasOwnProperty ?? EMPTY) ?? EMPTY)?.toString)) {
			encoded = value + "";
			invalidSegments.push({
				start: previousValue.length + currentValue.length,
				length: encoded.length,
				error: `Value of type ${Object.prototype.toString.call(value).slice(8, -1)} is not a valid path parameter`
			});
		}
		return previousValue + currentValue + (index === params.length ? "" : encoded);
	}, "");
	const pathOnly = path.split(/[?#]/, 1)[0];
	const invalidSegmentPattern = /(?<=^|\/)(?:\.|%2e){1,2}(?=\/|$)/gi;
	let match;
	while ((match = invalidSegmentPattern.exec(pathOnly)) !== null) invalidSegments.push({
		start: match.index,
		length: match[0].length,
		error: `Value "${match[0]}" can\'t be safely passed as a path parameter`
	});
	invalidSegments.sort((a, b) => a.start - b.start);
	if (invalidSegments.length > 0) {
		let lastEnd = 0;
		const underline = invalidSegments.reduce((acc, segment) => {
			const spaces = " ".repeat(segment.start - lastEnd);
			const arrows = "^".repeat(segment.length);
			lastEnd = segment.start + segment.length;
			return acc + spaces + arrows;
		}, "");
		throw new RetellError(`Path parameters result in path with invalid segments:\n${invalidSegments.map((e) => e.error).join("\n")}\n${path}\n${underline}`);
	}
	return path;
};
/**
* URI-encodes path params and ensures no unsafe /./ or /../ path segments are introduced.
*/
var path = /* @__PURE__ */ createPathTagFunction(encodeURIPath);
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/resources/agent.mjs
var Agent = class extends APIResource {
	/**
	* Create a new agent
	*
	* @example
	* ```ts
	* const agentResponse = await client.agent.create({
	*   response_engine: {
	*     llm_id: 'llm_234sdertfsdsfsdf',
	*     type: 'retell-llm',
	*   },
	*   voice_id: 'retell-Cimo',
	* });
	* ```
	*/
	create(body, options) {
		return this._client.post("/create-agent", {
			body,
			...options
		});
	}
	/**
	* Retrieve details of a specific agent
	*
	* @example
	* ```ts
	* const agentResponse = await client.agent.retrieve(
	*   '16b980523634a6dc504898cda492e939',
	* );
	* ```
	*/
	retrieve(agentID, query = {}, options) {
		return this._client.get(path`/get-agent/${agentID}`, {
			query,
			...options
		});
	}
	/**
	* Update an existing agent's latest draft version
	*
	* @example
	* ```ts
	* const agentResponse = await client.agent.update(
	*   '16b980523634a6dc504898cda492e939',
	*   { agent_name: 'Jarvis' },
	* );
	* ```
	*/
	update(agentID, params, options) {
		const { version, ...body } = params;
		return this._client.patch(path`/update-agent/${agentID}`, {
			query: { version },
			body,
			...options
		});
	}
	/**
	* List unique agents with pagination.
	*
	* @example
	* ```ts
	* const agents = await client.agent.list({
	*   filter_criteria: {
	*     channel: {
	*       type: 'string',
	*       op: 'eq',
	*       value: 'voice',
	*     },
	*   },
	* });
	* ```
	*/
	list(params = {}, options) {
		const { limit, pagination_key, sort_order, ...body } = params ?? {};
		return this._client.post("/v2/list-agents", {
			query: {
				limit,
				pagination_key,
				sort_order
			},
			body,
			...options
		});
	}
	/**
	* Delete an existing agent
	*
	* @example
	* ```ts
	* await client.agent.delete(
	*   'oBeDLoLOeuAbiuaMFXRtDOLriTJ5tSxD',
	* );
	* ```
	*/
	delete(agentID, options) {
		return this._client.delete(path`/delete-agent/${agentID}`, {
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
	/**
	* Create a new draft agent version from a base version.
	*
	* @example
	* ```ts
	* const response = await client.agent.createVersion(
	*   'agent_xxx',
	*   { base_version: 12 },
	* );
	* ```
	*/
	createVersion(agentID, body, options) {
		return this._client.post(path`/create-agent-version/${agentID}`, {
			body,
			...options
		});
	}
	/**
	* Delete a specific agent version.
	*
	* @example
	* ```ts
	* await client.agent.deleteVersion('agent_xxx', {
	*   version: 1,
	* });
	* ```
	*/
	deleteVersion(agentID, params, options) {
		const { version } = params;
		return this._client.delete(path`/delete-agent-version/${agentID}`, {
			query: { version },
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
	/**
	* List stored versions of a voice or chat agent with pagination.
	*
	* @example
	* ```ts
	* const response = await client.agent.listVersions(
	*   '16b980523634a6dc504898cda492e939',
	* );
	* ```
	*/
	listVersions(agentID, query = {}, options) {
		return this._client.get(path`/list-agent-versions/${agentID}`, {
			query,
			...options
		});
	}
	/**
	* Publish an existing draft version in place.
	*
	* @example
	* ```ts
	* await client.agent.publish('agent_xxx', { version: 15 });
	* ```
	*/
	publish(agentID, body, options) {
		return this._client.post(path`/publish-agent-version/${agentID}`, {
			body,
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
	/**
	* Remove references to resources that no longer exist in your workspace from an
	* agent draft version and its response engine — tools whose app connection has
	* been deleted, unknown knowledge bases, and deleted shared components — and remap
	* voices that are no longer accessible to a default voice. If the agent's response
	* engine version has been published, the engine is left untouched and only
	* agent-level references are repaired. Repairing an agent with nothing to fix is a
	* no-op.
	*
	* @example
	* ```ts
	* const response = await client.agent.repair(
	*   '16b980523634a6dc504898cda492e939',
	* );
	* ```
	*/
	repair(agentID, params = {}, options) {
		const { version } = params ?? {};
		return this._client.post(path`/repair-agent/${agentID}`, {
			query: { version },
			...options
		});
	}
};
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/resources/app.mjs
var App = class extends APIResource {
	/**
	* Create an App: the connection to one external system (a CRM, calendar, support
	* desk, and so on), holding its credentials and settings. Providers with
	* caller-managed credentials accept auth_config. Providers using the OAuth
	* callback must omit auth_config and be authorized through connect-app.
	* Credentials are stored encrypted and never returned. Up to 20 apps per provider
	* by default, unless a custom limit is configured for the organization.
	*/
	create(body, options) {
		return this._client.post("/create-app", {
			body,
			...options
		});
	}
	/**
	* Partially update an App. Omitted fields remain unchanged. Updating auth_config
	* or tenant metadata invalidates the cached provider token immediately. Providers
	* using the OAuth callback reject auth_config and must be reauthorized through
	* connect-app.
	*/
	update(appID, body, options) {
		return this._client.patch(path`/update-app/${appID}`, {
			body,
			...options
		});
	}
	/**
	* List Apps in the organization (paginated).
	*/
	list(query = {}, options) {
		return this._client.get("/list-apps", {
			query,
			...options
		});
	}
	/**
	* Delete an App. Fails when agents or knowledge bases still reference it, unless
	* force_delete is set. If a CRM config is linked to this App, the link is cleared.
	*/
	delete(appID, params = {}, options) {
		const { force_delete } = params ?? {};
		return this._client.delete(path`/delete-app/${appID}`, {
			query: { force_delete },
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
	/**
	* Get an App by id.
	*/
	get(appID, options) {
		return this._client.get(path`/get-app/${appID}`, options);
	}
	/**
	* One round of multi-step schema resolution for an app tool template against a
	* connected App. parameters is the input parameters resolved so far, with
	* properties configured by const or description, and is empty on the first call.
	* Returns the next input_schema to fill; complete marks the last round (it may
	* accompany the final input_schema) and may include an optional response_schema.
	* Input-schema property descriptions provide the default text for LLM inference,
	* and each property's default_input_mode ("const" or "description") is the input
	* mode to preselect for it. A property may also carry extra_info ({ text?, link?
	* }), guidance to render under its editor, e.g. a docs link on how to find an id.
	* Used by the tool config UI.
	*/
	getToolSchema(appID, body, options) {
		return this._client.post(path`/get-app-tool-schema/${appID}`, {
			body,
			...options
		});
	}
	/**
	* List the agents and knowledge bases referencing an App, most recently configured
	* first by default.
	*/
	listUsages(appID, query = {}, options) {
		return this._client.get(path`/list-app-usages/${appID}`, {
			query,
			...options
		});
	}
	/**
	* Probe the App's stored credentials by making a minimal authenticated call to the
	* provider. Returns success=true on a successful round-trip, and records the
	* outcome on the App's connection_status either way.
	*/
	testAuth(appID, options) {
		return this._client.post(path`/test-app-auth/${appID}`, options);
	}
};
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/resources/asset.mjs
var Asset = class extends APIResource {
	/**
	* Upload an image or audio asset. Audio is normalized to headerless mono PCM16 at
	* 24 kHz and can be referenced by `custom_on_hold_music_asset_id` on warm and
	* agentic-warm transfer options. Accepted audio formats are MP3, WAV, WebM, OGG,
	* M4A, AAC, and FLAC. The maximum upload size is 10 MB and audio duration is
	* limited to 210 seconds.
	*/
	create(body, options) {
		return this._client.post("/create-asset", multipartFormRequestOptions({
			body,
			...options
		}, this._client));
	}
};
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/resources/batch-call.mjs
var BatchCall = class extends APIResource {
	/**
	* Create a batch call
	*
	* @example
	* ```ts
	* const batchCallResponse =
	*   await client.batchCall.createBatchCall({
	*     from_number: '+14157774444',
	*     tasks: [{ to_number: '+12137774445' }],
	*   });
	* ```
	*/
	createBatchCall(body, options) {
		return this._client.post("/create-batch-call", {
			body,
			timeout: this._client._options.timeout ?? 3e5,
			...options
		});
	}
};
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/resources/crm.mjs
var CRM = class extends APIResource {
	/**
	* Get the organization's CRM configuration: which CRM app is linked, the custom
	* contact fields defined for it, and how post-call analysis data is written back
	* to contacts. Returns an empty configuration when nothing has been set up yet.
	*/
	getConfig(options) {
		return this._client.get("/get-crm-config", options);
	}
	/**
	* Get the contact schema of the connected CRM: the fields available on its contact
	* object, which are the values that sync mappings can reference.
	*/
	getSchema(query = {}, options) {
		return this._client.get("/get-crm-schema", {
			query,
			...options
		});
	}
	/**
	* Get the status of the organization's contact sync, whether it was started
	* manually or by the schedule. Returns status `idle` when no sync is running.
	*/
	getSyncJobStatus(options) {
		return this._client.get("/get-sync-job-status", options);
	}
	/**
	* Start a contact sync with the linked CRM app immediately, instead of waiting for
	* the scheduled sync. One sync runs per organization at a time: starting another
	* while one is in flight is rejected. Poll get-sync-job-status for progress.
	*/
	runSyncJob(options) {
		return this._client.post("/run-sync-job", options);
	}
	/**
	* Update the organization's CRM configuration. Omitted fields stay as they are; a
	* field that is sent replaces its stored value in full.
	*/
	updateConfig(body, options) {
		return this._client.post("/update-crm-config", {
			body,
			...options
		});
	}
};
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/resources/call.mjs
var Call = class extends APIResource {
	/**
	* Retrieve details of a specific call
	*
	* @example
	* ```ts
	* const callResponse = await client.call.retrieve(
	*   '119c3f8e47135a29e65947eeb34cf12d',
	* );
	* ```
	*/
	retrieve(callID, options) {
		return this._client.get(path`/v2/get-call/${callID}`, options);
	}
	/**
	* Update metadata and sensitive data storage settings for an existing call.
	*
	* @example
	* ```ts
	* const callResponse = await client.call.update(
	*   'call_a4441234567890777c4a4a123e6',
	*   {
	*     data_storage_setting: 'everything_except_pii',
	*     metadata: {
	*       customer_id: 'cust_123',
	*       notes: 'Follow-up required',
	*     },
	*   },
	* );
	* ```
	*/
	update(callID, body, options) {
		return this._client.patch(path`/v2/update-call/${callID}`, {
			body,
			...options
		});
	}
	/**
	* List calls with unified cursor pagination response.
	*
	* @example
	* ```ts
	* const calls = await client.call.list();
	* ```
	*/
	list(body = {}, options) {
		return this._client.post("/v3/list-calls", {
			body,
			timeout: this._client._options.timeout ?? 3e5,
			...options
		});
	}
	/**
	* Delete a specific call and its associated data
	*
	* @example
	* ```ts
	* await client.call.delete(
	*   '119c3f8e47135a29e65947eeb34cf12d',
	* );
	* ```
	*/
	delete(callID, options) {
		return this._client.delete(path`/v2/delete-call/${callID}`, {
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
	/**
	* Create a new outbound phone call.
	*
	* @example
	* ```ts
	* const phoneCallResponse = await client.call.createPhoneCall(
	*   {
	*     from_number: '+14157774444',
	*     to_number: '+12137774445',
	*   },
	* );
	* ```
	*/
	createPhoneCall(body, options) {
		return this._client.post("/v2/create-phone-call", {
			body,
			timeout: this._client._options.timeout ?? 12e4,
			...options
		});
	}
	/**
	* Create a new web call and return browser connection details.
	*
	* @example
	* ```ts
	* const createWebCallResponse =
	*   await client.call.createWebCall({
	*     agent_id: 'oBeDLoLOeuAbiuaMFXRtDOLriTJ5tSxD',
	*   });
	* ```
	*/
	createWebCall(body, options) {
		return this._client.post("/v3/create-web-call", {
			body,
			...options
		});
	}
	/**
	* Mint a subscribe-only access token for an in-progress call so a client can
	* listen to live audio. The returned token grants join + subscribe on the call's
	* existing audio room; it cannot publish. The call must be in ONGOING status.
	*
	* @example
	* ```ts
	* const response = await client.call.listenLive(
	*   '119c3f8e47135a29e65947eeb34cf12d',
	* );
	* ```
	*/
	listenLive(callID, options) {
		return this._client.post(path`/v2/listen-live-call/${callID}`, options);
	}
	/**
	* Register a new phone call for custom telephony
	*
	* @example
	* ```ts
	* const phoneCallResponse =
	*   await client.call.registerPhoneCall({
	*     agent_id: 'oBeDLoLOeuAbiuaMFXRtDOLriTJ5tSxD',
	*   });
	* ```
	*/
	registerPhoneCall(body, options) {
		return this._client.post("/v2/register-phone-call", {
			body,
			...options
		});
	}
	/**
	* Rerun post-call analysis for a specific call. This operation incurs charges.
	*
	* @example
	* ```ts
	* const callResponse = await client.call.rerunAnalysis(
	*   'call_119c3f8e47135a29e65947eeb34cf12d',
	* );
	* ```
	*/
	rerunAnalysis(callID, options) {
		return this._client.put(path`/rerun-call-analysis/${callID}`, options);
	}
	/**
	* Stop an ongoing call.
	*
	* @example
	* ```ts
	* await client.call.stop('call_a4441234567890777c4a4a123e6');
	* ```
	*/
	stop(callID, options) {
		return this._client.post(path`/v2/stop-call/${callID}`, {
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
	/**
	* Take over an in-progress call from the AI agent. The agent stops responding and
	* the specified live-listen participant is allowed to speak directly to the
	* caller. The call must be in ONGOING status.
	*
	* @example
	* ```ts
	* const response = await client.call.takeOverLive(
	*   '119c3f8e47135a29e65947eeb34cf12d',
	*   { participant_id: 'listener_a1b2c3d4e5f6g7h8i9j0' },
	* );
	* ```
	*/
	takeOverLive(callID, body, options) {
		return this._client.post(path`/v2/take-over-live-call/${callID}`, {
			body,
			...options
		});
	}
	/**
	* Update an ongoing call at runtime. Supports overriding dynamic variables,
	* metadata, and the data storage setting on the running call, and controlling the
	* live agent (inject context, trigger a response). These overrides take effect
	* immediately on the live call; metadata and data storage setting changes are also
	* persisted to the call record. To update a call that is no longer ongoing, use
	* /v2/update-call/{call_id}.
	*
	* @example
	* ```ts
	* const response = await client.call.updateLive(
	*   'call_a4441234567890777c4a4a123e6',
	*   {
	*     call_control: {
	*       additional_context:
	*         'Customer just opened a support ticket about billing.',
	*       trigger_response: true,
	*     },
	*     fields_to_override: {
	*       override_dynamic_variables: {
	*         additional_discount: '15%',
	*       },
	*     },
	*   },
	* );
	* ```
	*/
	updateLive(callID, body, options) {
		return this._client.patch(path`/v2/update-live-call/${callID}`, {
			body,
			...options
		});
	}
};
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/resources/chat.mjs
var Chat = class extends APIResource {
	/**
	* Create a chat session
	*
	* @example
	* ```ts
	* const chatResponse = await client.chat.create({
	*   agent_id: 'oBeDLoLOeuAbiuaMFXRtDOLriTJ5tSxD',
	* });
	* ```
	*/
	create(body, options) {
		return this._client.post("/create-chat", {
			body,
			...options
		});
	}
	/**
	* Retrieve details of a specific chat
	*
	* @example
	* ```ts
	* const chatResponse = await client.chat.retrieve(
	*   '16b980523634a6dc504898cda492e939',
	* );
	* ```
	*/
	retrieve(chatID, options) {
		return this._client.get(path`/get-chat/${chatID}`, options);
	}
	/**
	* Update metadata and sensitive data storage settings for an existing chat.
	*
	* @example
	* ```ts
	* const chatResponse = await client.chat.update(
	*   'chat_98c1a2157aa0559144d67bb0729',
	*   {
	*     data_storage_setting: 'everything',
	*     metadata: {
	*       customer_id: 'cust_123',
	*       notes: 'Follow-up required',
	*     },
	*     override_dynamic_variables: {
	*       additional_discount: '15%',
	*     },
	*   },
	* );
	* ```
	*/
	update(chatID, body, options) {
		return this._client.patch(path`/update-chat/${chatID}`, {
			body,
			...options
		});
	}
	/**
	* List chats with unified cursor pagination response.
	*
	* @example
	* ```ts
	* const chats = await client.chat.list();
	* ```
	*/
	list(body = {}, options) {
		return this._client.post("/v3/list-chats", {
			body,
			timeout: this._client._options.timeout ?? 3e5,
			...options
		});
	}
	/**
	* Delete an existing chat
	*
	* @example
	* ```ts
	* await client.chat.delete(
	*   '16b980523634a6dc504898cda492e939',
	* );
	* ```
	*/
	delete(chatID, options) {
		return this._client.delete(path`/delete-chat/${chatID}`, {
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
	/**
	* Create a chat completion message
	*
	* @example
	* ```ts
	* const response = await client.chat.createChatCompletion({
	*   chat_id: 'oBeDLoLOeuAbiuaMFXRtDOLriTJ5tSxD',
	*   content: 'hi how are you doing?',
	* });
	* ```
	*/
	createChatCompletion(body, options) {
		return this._client.post("/create-chat-completion", {
			body,
			timeout: this._client._options.timeout ?? 3e5,
			...options
		});
	}
	/**
	* Start an outbound SMS chat conversation with a phone number using the specified
	* agent. The agent must be configured for chat mode. The initial SMS message will
	* be automatically generated and sent based on the agent's configuration.
	*
	* @example
	* ```ts
	* const chatResponse = await client.chat.createSMSChat({
	*   from_number: '+12137771234',
	*   to_number: '+14155551234',
	* });
	* ```
	*/
	createSMSChat(body, options) {
		return this._client.post("/create-sms-chat", {
			body,
			...options
		});
	}
	/**
	* End an ongoing chat
	*
	* @example
	* ```ts
	* await client.chat.end('16b980523634a6dc504898cda492e939');
	* ```
	*/
	end(chatID, options) {
		return this._client.patch(path`/end-chat/${chatID}`, {
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
	/**
	* Rerun post-chat analysis for a specific chat. This operation incurs charges.
	*
	* @example
	* ```ts
	* const chatResponse = await client.chat.rerunAnalysis(
	*   'chat_16b980523634a6dc504898cda492e939',
	* );
	* ```
	*/
	rerunAnalysis(chatID, options) {
		return this._client.put(path`/rerun-chat-analysis/${chatID}`, options);
	}
};
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/resources/chat-agent.mjs
var ChatAgent = class extends APIResource {
	/**
	* Create a new chat agent
	*
	* @example
	* ```ts
	* const chatAgentResponse = await client.chatAgent.create({
	*   response_engine: {
	*     llm_id: 'llm_234sdertfsdsfsdf',
	*     type: 'retell-llm',
	*   },
	* });
	* ```
	*/
	create(body, options) {
		return this._client.post("/create-chat-agent", {
			body,
			...options
		});
	}
	/**
	* Retrieve details of a specific chat agent
	*
	* @example
	* ```ts
	* const chatAgentResponse = await client.chatAgent.retrieve(
	*   '16b980523634a6dc504898cda492e939',
	* );
	* ```
	*/
	retrieve(agentID, query = {}, options) {
		return this._client.get(path`/get-chat-agent/${agentID}`, {
			query,
			...options
		});
	}
	/**
	* Update an existing chat agent
	*
	* @example
	* ```ts
	* const chatAgentResponse = await client.chatAgent.update(
	*   '16b980523634a6dc504898cda492e939',
	* );
	* ```
	*/
	update(agentID, params, options) {
		const { version, ...body } = params;
		return this._client.patch(path`/update-chat-agent/${agentID}`, {
			query: { version },
			body,
			...options
		});
	}
	/**
	* List unique agents with pagination.
	*
	* @example
	* ```ts
	* const chatAgents = await client.chatAgent.list({
	*   filter_criteria: {
	*     channel: {
	*       type: 'string',
	*       op: 'eq',
	*       value: 'voice',
	*     },
	*   },
	* });
	* ```
	*/
	list(params = {}, options) {
		const { limit, pagination_key, sort_order, ...body } = params ?? {};
		return this._client.post("/v2/list-agents", {
			query: {
				limit,
				pagination_key,
				sort_order
			},
			body,
			...options
		});
	}
	/**
	* Delete an existing chat agent
	*
	* @example
	* ```ts
	* await client.chatAgent.delete(
	*   'oBeDLoLOeuAbiuaMFXRtDOLriTJ5tSxD',
	* );
	* ```
	*/
	delete(agentID, options) {
		return this._client.delete(path`/delete-chat-agent/${agentID}`, {
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
	/**
	* Create a new draft agent version from a base version.
	*
	* @example
	* ```ts
	* const response = await client.chatAgent.createVersion(
	*   'agent_xxx',
	*   { base_version: 12 },
	* );
	* ```
	*/
	createVersion(agentID, body, options) {
		return this._client.post(path`/create-agent-version/${agentID}`, {
			body,
			...options
		});
	}
	/**
	* Delete a specific agent version.
	*
	* @example
	* ```ts
	* await client.chatAgent.deleteVersion('agent_xxx', {
	*   version: 1,
	* });
	* ```
	*/
	deleteVersion(agentID, params, options) {
		const { version } = params;
		return this._client.delete(path`/delete-agent-version/${agentID}`, {
			query: { version },
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
	/**
	* Publish an existing draft version in place.
	*
	* @example
	* ```ts
	* await client.chatAgent.publish('agent_xxx', {
	*   version: 15,
	* });
	* ```
	*/
	publish(agentID, body, options) {
		return this._client.post(path`/publish-agent-version/${agentID}`, {
			body,
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
};
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/resources/concurrency.mjs
var Concurrency = class extends APIResource {
	/**
	* Get the current concurrency and concurrency limit of the org
	*/
	retrieve(options) {
		return this._client.get("/get-concurrency", options);
	}
};
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/resources/contact.mjs
var Contact = class extends APIResource {
	/**
	* Create a new contact.
	*
	* @example
	* ```ts
	* const contactResponse = await client.contact.create({
	*   phone_number: 'phone_number',
	* });
	* ```
	*/
	create(body, options) {
		return this._client.post("/create-contact", {
			body,
			...options
		});
	}
	/**
	* Update an existing contact.
	*
	* @example
	* ```ts
	* const contactResponse = await client.contact.update(
	*   'contact_id',
	* );
	* ```
	*/
	update(contactID, body, options) {
		return this._client.patch(path`/update-contact/${contactID}`, {
			body,
			...options
		});
	}
	/**
	* List contacts, newest created first by default, with the total count of matches
	* alongside the page. Page through results with `pagination_key`; `skip` is
	* available for offset-style paging but is slower on large contact sets and can
	* repeat or miss rows as contacts are added or deleted.
	*
	* @example
	* ```ts
	* const contacts = await client.contact.list();
	* ```
	*/
	list(body = {}, options) {
		return this._client.post("/list-contacts", {
			body,
			...options
		});
	}
	/**
	* Delete a contact. A contact linked to a record in a connected CRM cannot be
	* deleted while two-way sync is active — unlink the CRM app first, otherwise the
	* next sync would recreate it.
	*
	* @example
	* ```ts
	* await client.contact.delete('contact_id');
	* ```
	*/
	delete(contactID, options) {
		return this._client.delete(path`/delete-contact/${contactID}`, {
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
	/**
	* Trigger a backfill job that re-applies analysis data mappings to contacts using
	* historical call and SMS chat data. Only one backfill job can run per
	* organization at a time. Select contact_memory to rewrite memory from matching
	* ended phone calls and SMS chats in chronological order, one conversation at a
	* time, with no conversation-count cap. Backfill starts with the contact's
	* existing memory. Each rewrite builds on the previous result, and the final
	* successful result is saved once per contact. When mapped analysis fields and
	* contact_memory are selected together, they are saved together in one contact
	* update. Memory rewrites use the currently stored contact fields.
	*
	* @example
	* ```ts
	* const response = await client.contact.backfillAnalysisData({
	*   backfill_attributes: ['contact_memory'],
	* });
	* ```
	*/
	backfillAnalysisData(body, options) {
		return this._client.post("/backfill-contact-analysis-data", {
			body,
			...options
		});
	}
	/**
	* Start an incremental contact import from an uploaded CSV: creates new contacts
	* and updates existing ones matched by phone number. Mapped columns overwrite the
	* matched contact's fields; unmapped columns are ignored. Runs asynchronously —
	* poll get-contact-import for progress.
	*
	* @example
	* ```ts
	* const response = await client.contact.createImport({
	*   column_mapping: [
	*     {
	*       external_field_name: 'external_field_name',
	*       field_name: 'field_name',
	*     },
	*   ],
	*   upload_id: 'upload_26f1cbdf5713',
	* });
	* ```
	*/
	createImport(body, options) {
		return this._client.post("/create-contact-import", {
			body,
			...options
		});
	}
	/**
	* Retrieve a contact by ID.
	*
	* @example
	* ```ts
	* const contactResponse = await client.contact.get(
	*   'contact_id',
	* );
	* ```
	*/
	get(contactID, options) {
		return this._client.get(path`/get-contact/${contactID}`, options);
	}
	/**
	* Get the status of the contact analysis data backfill job.
	*
	* @example
	* ```ts
	* const response =
	*   await client.contact.getBackfillJobStatus();
	* ```
	*/
	getBackfillJobStatus(options) {
		return this._client.get("/get-backfill-contact-job-status", options);
	}
	/**
	* Retrieve a contact by phone number. At most one contact exists per phone number
	* in an organization.
	*
	* @example
	* ```ts
	* const contactResponse = await client.contact.getByPhone(
	*   'phone_number',
	* );
	* ```
	*/
	getByPhone(phoneNumber, options) {
		return this._client.get(path`/get-contact-by-phone/${phoneNumber}`, options);
	}
	/**
	* Status and counts for the org's current or latest contact import.
	*
	* @example
	* ```ts
	* const response = await client.contact.getImport();
	* ```
	*/
	getImport(options) {
		return this._client.get("/get-contact-import", options);
	}
	/**
	* List a contact's conversations (inbound calls, outbound calls, and chats) merged
	* into a single timeline, most recent first. Results are matched by the contact's
	* phone number. Use the returned `pagination_key` to fetch the next page.
	*
	* @example
	* ```ts
	* const response = await client.contact.listConversations(
	*   'contact_id',
	* );
	* ```
	*/
	listConversations(contactID, query = {}, options) {
		return this._client.get(path`/list-contact-conversations/${contactID}`, {
			query,
			...options
		});
	}
	/**
	* Upload a CSV file for a contact import. The file is stored privately and
	* referenced by the returned upload_id in create-contact-import.
	*
	* @example
	* ```ts
	* const response = await client.contact.uploadImportFile({
	*   file: fs.createReadStream('path/to/file'),
	* });
	* ```
	*/
	uploadImportFile(body, options) {
		return this._client.post("/upload-contact-import-file", multipartFormRequestOptions({
			body,
			...options
		}, this._client));
	}
};
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/resources/conversation-flow.mjs
var ConversationFlow = class extends APIResource {
	/**
	* Create a new Conversation Flow that can be attached to an agent. This is used to
	* generate response output for the agent.
	*
	* @example
	* ```ts
	* const conversationFlowResponse =
	*   await client.conversationFlow.create({
	*     model_choice: { model: 'gpt-4.1', type: 'cascading' },
	*     nodes: [
	*       {
	*         id: 'start',
	*         instruction: {
	*           text: 'Greet the customer and ask how you can help them.',
	*           type: 'prompt',
	*         },
	*         type: 'conversation',
	*       },
	*     ],
	*     start_speaker: 'agent',
	*   });
	* ```
	*/
	create(body, options) {
		return this._client.post("/create-conversation-flow", {
			body,
			...options
		});
	}
	/**
	* Retrieve details of a specific Conversation Flow
	*
	* @example
	* ```ts
	* const conversationFlowResponse =
	*   await client.conversationFlow.retrieve(
	*     'conversation_flow_id',
	*   );
	* ```
	*/
	retrieve(conversationFlowID, query = {}, options) {
		return this._client.get(path`/get-conversation-flow/${conversationFlowID}`, {
			query,
			...options
		});
	}
	/**
	* Update an existing conversation flow
	*
	* @example
	* ```ts
	* const conversationFlowResponse =
	*   await client.conversationFlow.update(
	*     'conversation_flow_id',
	*   );
	* ```
	*/
	update(conversationFlowID, params, options) {
		const { version, ...body } = params;
		return this._client.patch(path`/update-conversation-flow/${conversationFlowID}`, {
			query: { version },
			body,
			...options
		});
	}
	/**
	* List conversation flows with pagination
	*
	* @example
	* ```ts
	* const conversationFlows =
	*   await client.conversationFlow.list();
	* ```
	*/
	list(query = {}, options) {
		return this._client.get("/v2/list-conversation-flows", {
			query,
			...options
		});
	}
	/**
	* Delete a conversation flow and all its versions
	*
	* @example
	* ```ts
	* await client.conversationFlow.delete(
	*   'conversation_flow_id',
	* );
	* ```
	*/
	delete(conversationFlowID, params = {}, options) {
		const { force_delete } = params ?? {};
		return this._client.delete(path`/delete-conversation-flow/${conversationFlowID}`, {
			query: { force_delete },
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
};
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/resources/conversation-flow-component.mjs
var ConversationFlowComponent = class extends APIResource {
	/**
	* Create a new shared conversation flow component
	*
	* @example
	* ```ts
	* const conversationFlowComponentResponse =
	*   await client.conversationFlowComponent.create({
	*     name: 'Customer Information Collector',
	*     nodes: [
	*       {
	*         id: 'collect_info',
	*         instruction: {
	*           text: 'Ask the customer for their name and contact information.',
	*           type: 'prompt',
	*         },
	*         type: 'conversation',
	*       },
	*     ],
	*   });
	* ```
	*/
	create(body, options) {
		return this._client.post("/create-conversation-flow-component", {
			body,
			...options
		});
	}
	/**
	* Get a shared conversation flow component
	*
	* @example
	* ```ts
	* const conversationFlowComponentResponse =
	*   await client.conversationFlowComponent.retrieve(
	*     'conversation_flow_component_id',
	*   );
	* ```
	*/
	retrieve(conversationFlowComponentID, options) {
		return this._client.get(path`/get-conversation-flow-component/${conversationFlowComponentID}`, options);
	}
	/**
	* Update an existing shared conversation flow component
	*
	* @example
	* ```ts
	* const conversationFlowComponentResponse =
	*   await client.conversationFlowComponent.update(
	*     'conversation_flow_component_id',
	*   );
	* ```
	*/
	update(conversationFlowComponentID, body, options) {
		return this._client.patch(path`/update-conversation-flow-component/${conversationFlowComponentID}`, {
			body,
			...options
		});
	}
	/**
	* List shared conversation flow components with pagination
	*
	* @example
	* ```ts
	* const conversationFlowComponents =
	*   await client.conversationFlowComponent.list();
	* ```
	*/
	list(query = {}, options) {
		return this._client.get("/v2/list-conversation-flow-components", {
			query,
			...options
		});
	}
	/**
	* Delete a shared conversation flow component. When deleting a shared component,
	* creates local copies for all linked conversation flows.
	*
	* @example
	* ```ts
	* await client.conversationFlowComponent.delete(
	*   'conversation_flow_component_id',
	* );
	* ```
	*/
	delete(conversationFlowComponentID, options) {
		return this._client.delete(path`/delete-conversation-flow-component/${conversationFlowComponentID}`, {
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
};
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/resources/export-request.mjs
var ExportRequest = class extends APIResource {
	/**
	* List export requests with pagination
	*/
	list(query = {}, options) {
		return this._client.get("/v2/list-export-requests", {
			query,
			...options
		});
	}
};
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/resources/identity.mjs
var Identity = class extends APIResource {
	/**
	* Get info about the API key used to authenticate, and the org that owns it.
	*/
	retrieve(options) {
		return this._client.get("/get-api-key-info", options);
	}
};
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/resources/knowledge-base.mjs
var KnowledgeBase = class extends APIResource {
	/**
	* Create a new knowledge base
	*
	* @example
	* ```ts
	* const knowledgeBaseResponse =
	*   await client.knowledgeBase.create({
	*     knowledge_base_name: 'Sample KB',
	*   });
	* ```
	*/
	create(body, options) {
		return this._client.post("/create-knowledge-base", multipartFormRequestOptions({
			body,
			...options
		}, this._client));
	}
	/**
	* Retrieve details of a specific knowledge base
	*
	* @example
	* ```ts
	* const knowledgeBaseResponse =
	*   await client.knowledgeBase.retrieve('kb_1234567890');
	* ```
	*/
	retrieve(knowledgeBaseID, options) {
		return this._client.get(path`/get-knowledge-base/${knowledgeBaseID}`, options);
	}
	/**
	* List all knowledge bases
	*
	* @example
	* ```ts
	* const knowledgeBaseResponses =
	*   await client.knowledgeBase.list();
	* ```
	*/
	list(options) {
		return this._client.get("/list-knowledge-bases", options);
	}
	/**
	* Delete an existing knowledge base
	*
	* @example
	* ```ts
	* await client.knowledgeBase.delete('kb_1234567890');
	* ```
	*/
	delete(knowledgeBaseID, options) {
		return this._client.delete(path`/delete-knowledge-base/${knowledgeBaseID}`, {
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
	/**
	* Add sources to a knowledge base
	*
	* @example
	* ```ts
	* const knowledgeBaseResponse =
	*   await client.knowledgeBase.addSources('kb_1234567890');
	* ```
	*/
	addSources(knowledgeBaseID, body, options) {
		return this._client.post(path`/add-knowledge-base-sources/${knowledgeBaseID}`, multipartFormRequestOptions({
			body,
			...options
		}, this._client));
	}
	/**
	* Delete an existing source from knowledge base
	*
	* @example
	* ```ts
	* const knowledgeBaseResponse =
	*   await client.knowledgeBase.deleteSource(
	*     'source_1234567890',
	*     { knowledge_base_id: 'kb_1234567890' },
	*   );
	* ```
	*/
	deleteSource(sourceID, params, options) {
		const { knowledge_base_id } = params;
		return this._client.delete(path`/delete-knowledge-base-source/${knowledge_base_id}/source/${sourceID}`, options);
	}
};
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/resources/llm.mjs
var Llm = class extends APIResource {
	/**
	* Create a new Retell LLM Response Engine that can be attached to an agent. This
	* is used to generate response output for the agent.
	*
	* @example
	* ```ts
	* const llmResponse = await client.llm.create();
	* ```
	*/
	create(body, options) {
		return this._client.post("/create-retell-llm", {
			body,
			...options
		});
	}
	/**
	* Retrieve details of a specific Retell LLM Response Engine
	*
	* @example
	* ```ts
	* const llmResponse = await client.llm.retrieve(
	*   '16b980523634a6dc504898cda492e939',
	* );
	* ```
	*/
	retrieve(llmID, query = {}, options) {
		return this._client.get(path`/get-retell-llm/${llmID}`, {
			query,
			...options
		});
	}
	/**
	* Update an existing Retell LLM Response Engine
	*
	* @example
	* ```ts
	* const llmResponse = await client.llm.update(
	*   '16b980523634a6dc504898cda492e939',
	*   {
	*     begin_message:
	*       'Hey I am a virtual assistant calling from Retell Hospital.',
	*   },
	* );
	* ```
	*/
	update(llmID, params, options) {
		const { version, ...body } = params;
		return this._client.patch(path`/update-retell-llm/${llmID}`, {
			query: { version },
			body,
			...options
		});
	}
	/**
	* List Retell LLM Response Engines with pagination
	*
	* @example
	* ```ts
	* const llms = await client.llm.list();
	* ```
	*/
	list(query = {}, options) {
		return this._client.get("/v2/list-retell-llms", {
			query,
			...options
		});
	}
	/**
	* Delete an existing Retell LLM Response Engine
	*
	* @example
	* ```ts
	* await client.llm.delete('oBeDLoLOeuAbiuaMFXRtDOLriTJ5tSxD');
	* ```
	*/
	delete(llmID, params = {}, options) {
		const { force_delete } = params ?? {};
		return this._client.delete(path`/delete-retell-llm/${llmID}`, {
			query: { force_delete },
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
};
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/resources/mcp-tool.mjs
var McpTool = class extends APIResource {
	/**
	* Get MCP tools for a specific agent
	*/
	getMcpTools(agentID, query, options) {
		return this._client.get(path`/get-mcp-tools/${agentID}`, {
			query,
			...options
		});
	}
};
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/resources/phone-number.mjs
var PhoneNumber = class extends APIResource {
	/**
	* Buy a new phone number & Bind agents
	*
	* @example
	* ```ts
	* const phoneNumberResponse =
	*   await client.phoneNumber.create();
	* ```
	*/
	create(body, options) {
		return this._client.post("/create-phone-number", {
			body,
			...options
		});
	}
	/**
	* Retrieve details of a specific phone number
	*
	* @example
	* ```ts
	* const phoneNumberResponse =
	*   await client.phoneNumber.retrieve('+14157774444');
	* ```
	*/
	retrieve(phoneNumber, options) {
		return this._client.get(path`/get-phone-number/${phoneNumber}`, options);
	}
	/**
	* Update agent bound to a purchased phone number
	*
	* @example
	* ```ts
	* const phoneNumberResponse = await client.phoneNumber.update(
	*   '+14157774444',
	*   {
	*     inbound_agents: [
	*       {
	*         agent_id: 'oBeDLoLOeuAbiuaMFXRtDOLriTJ5tSxD',
	*         agent_version: 1,
	*         weight: 1,
	*       },
	*     ],
	*     nickname: 'Frontdesk Number',
	*     outbound_agents: [
	*       {
	*         agent_id: 'oBeDLoLOeuAbiuaMFXRtDOLriTJ5tSxD',
	*         agent_version: 1,
	*         weight: 1,
	*       },
	*     ],
	*   },
	* );
	* ```
	*/
	update(phoneNumber, body, options) {
		return this._client.patch(path`/update-phone-number/${phoneNumber}`, {
			body,
			...options
		});
	}
	/**
	* List phone numbers with pagination
	*
	* @example
	* ```ts
	* const phoneNumbers = await client.phoneNumber.list();
	* ```
	*/
	list(query = {}, options) {
		return this._client.get("/v2/list-phone-numbers", {
			query,
			...options
		});
	}
	/**
	* Delete an existing phone number
	*
	* @example
	* ```ts
	* await client.phoneNumber.delete('+14157774444');
	* ```
	*/
	delete(phoneNumber, options) {
		return this._client.delete(path`/delete-phone-number/${phoneNumber}`, {
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
	/**
	* Import a phone number from custom telephony & Bind agents
	*
	* @example
	* ```ts
	* const phoneNumberResponse = await client.phoneNumber.import(
	*   {
	*     phone_number: '+14157774444',
	*     termination_uri: 'someuri.pstn.twilio.com',
	*   },
	* );
	* ```
	*/
	import(body, options) {
		return this._client.post("/import-phone-number", {
			body,
			...options
		});
	}
};
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/resources/playground.mjs
var Playground = class extends APIResource {
	/**
	* Stateless playground completion. Send the full conversation history (same shape
	* as chat completion messages) and receive only the newly generated messages.
	* Nothing is persisted server-side — the caller manages conversation state.
	*
	* @example
	* ```ts
	* const response = await client.playground.completion(
	*   'agent_id',
	*   {
	*     messages: [
	*       {
	*         content: "Hi, I'd like to check my appointment.",
	*         role: 'user',
	*       },
	*       {
	*         content:
	*           'Sure! Could you please provide your name?',
	*         role: 'agent',
	*       },
	*       { content: 'My name is John Smith.', role: 'user' },
	*     ],
	*   },
	* );
	* ```
	*/
	completion(agentID, params, options) {
		const { version, ...body } = params;
		return this._client.post(path`/agent-playground-completion/${agentID}`, {
			query: { version },
			body,
			timeout: this._client._options.timeout ?? 3e5,
			...options
		});
	}
};
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/resources/tests.mjs
var Tests = class extends APIResource {
	/**
	* Create a batch test to run multiple test cases
	*/
	createBatchTest(body, options) {
		return this._client.post("/create-batch-test", {
			body,
			...options
		});
	}
	/**
	* Create a new test case definition
	*/
	createTestCaseDefinition(body, options) {
		return this._client.post("/create-test-case-definition", {
			body,
			...options
		});
	}
	/**
	* Delete a test case definition
	*/
	deleteTestCaseDefinition(testCaseDefinitionID, options) {
		return this._client.delete(path`/delete-test-case-definition/${testCaseDefinitionID}`, {
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
		});
	}
	/**
	* Get a batch test job by ID
	*/
	getBatchTest(testCaseBatchJobID, options) {
		return this._client.get(path`/get-batch-test/${testCaseBatchJobID}`, options);
	}
	/**
	* Get a test case definition by ID
	*/
	getTestCaseDefinition(testCaseDefinitionID, options) {
		return this._client.get(path`/get-test-case-definition/${testCaseDefinitionID}`, options);
	}
	/**
	* Get a test case job (test run) by ID
	*/
	getTestRun(testCaseJobID, options) {
		return this._client.get(path`/get-test-run/${testCaseJobID}`, options);
	}
	/**
	* List batch test jobs with pagination
	*/
	listBatchTests(query, options) {
		return this._client.get("/v2/list-batch-tests", {
			query,
			...options
		});
	}
	/**
	* List test case definitions with pagination
	*/
	listTestCaseDefinitions(query, options) {
		return this._client.get("/v2/list-test-case-definitions", {
			query,
			...options
		});
	}
	/**
	* List test case jobs (test runs) for a batch test job with pagination
	*/
	listTestRuns(testCaseBatchJobID, query = {}, options) {
		return this._client.get(path`/v2/list-test-runs/${testCaseBatchJobID}`, {
			query,
			...options
		});
	}
	/**
	* Update a test case definition
	*/
	updateTestCaseDefinition(testCaseDefinitionID, body, options) {
		return this._client.put(path`/update-test-case-definition/${testCaseDefinitionID}`, {
			body,
			...options
		});
	}
};
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/resources/voice.mjs
var Voice = class extends APIResource {
	/**
	* Retrieve details of a specific voice
	*/
	retrieve(voiceID, options) {
		return this._client.get(path`/get-voice/${voiceID}`, options);
	}
	/**
	* List all voices available to the user
	*/
	list(options) {
		return this._client.get("/list-voices", options);
	}
	/**
	* Add a community voice to the voice library
	*/
	addResource(body, options) {
		return this._client.post("/add-community-voice", {
			body,
			...options
		});
	}
	/**
	* Clone a voice from audio files
	*/
	clone(body, options) {
		return this._client.post("/clone-voice", multipartFormRequestOptions({
			body,
			...options
		}, this._client));
	}
	/**
	* Search for community voices from voice providers
	*/
	search(body, options) {
		return this._client.post("/search-community-voice", {
			body,
			...options
		});
	}
};
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/internal/utils/log.mjs
var levelNumbers = {
	off: 0,
	error: 200,
	warn: 300,
	info: 400,
	debug: 500
};
var parseLogLevel = (maybeLevel, sourceName, client) => {
	if (!maybeLevel) return;
	if (hasOwn(levelNumbers, maybeLevel)) return maybeLevel;
	loggerFor(client).warn(`${sourceName} was set to ${JSON.stringify(maybeLevel)}, expected one of ${JSON.stringify(Object.keys(levelNumbers))}`);
};
function noop() {}
function makeLogFn(fnLevel, logger, logLevel) {
	if (!logger || levelNumbers[fnLevel] > levelNumbers[logLevel]) return noop;
	else return logger[fnLevel].bind(logger);
}
var noopLogger = {
	error: noop,
	warn: noop,
	info: noop,
	debug: noop
};
var cachedLoggers = /* @__PURE__ */ new WeakMap();
function loggerFor(client) {
	const logger = client.logger;
	const logLevel = client.logLevel ?? "off";
	if (!logger) return noopLogger;
	const cachedLogger = cachedLoggers.get(logger);
	if (cachedLogger && cachedLogger[0] === logLevel) return cachedLogger[1];
	const levelLogger = {
		error: makeLogFn("error", logger, logLevel),
		warn: makeLogFn("warn", logger, logLevel),
		info: makeLogFn("info", logger, logLevel),
		debug: makeLogFn("debug", logger, logLevel)
	};
	cachedLoggers.set(logger, [logLevel, levelLogger]);
	return levelLogger;
}
var formatRequestDetails = (details) => {
	if (details.options) {
		details.options = { ...details.options };
		delete details.options["headers"];
	}
	if (details.headers) details.headers = Object.fromEntries((details.headers instanceof Headers ? [...details.headers] : Object.entries(details.headers)).map(([name, value]) => [name, name.toLowerCase() === "authorization" || name.toLowerCase() === "api-key" || name.toLowerCase() === "x-api-key" || name.toLowerCase() === "cookie" || name.toLowerCase() === "set-cookie" ? "***" : value]));
	if ("retryOfRequestLogID" in details) {
		if (details.retryOfRequestLogID) details.retryOf = details.retryOfRequestLogID;
		delete details.retryOfRequestLogID;
	}
	return details;
};
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/internal/parse.mjs
async function defaultParseResponse(client, props) {
	const { response, requestLogID, retryOfRequestLogID, startTime } = props;
	const body = await (async () => {
		if (response.status === 204) return null;
		if (props.options.__binaryResponse) return response;
		const mediaType = response.headers.get("content-type")?.split(";")[0]?.trim();
		if (mediaType?.includes("application/json") || mediaType?.endsWith("+json")) {
			if (response.headers.get("content-length") === "0") return;
			return await response.json();
		}
		return await response.text();
	})();
	loggerFor(client).debug(`[${requestLogID}] response parsed`, formatRequestDetails({
		retryOfRequestLogID,
		url: response.url,
		status: response.status,
		body,
		durationMs: Date.now() - startTime
	}));
	return body;
}
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/core/api-promise.mjs
var _APIPromise_client;
/**
* A subclass of `Promise` providing additional helper methods
* for interacting with the SDK.
*/
var APIPromise = class APIPromise extends Promise {
	constructor(client, responsePromise, parseResponse = defaultParseResponse) {
		super((resolve) => {
			resolve(null);
		});
		this.responsePromise = responsePromise;
		this.parseResponse = parseResponse;
		_APIPromise_client.set(this, void 0);
		__classPrivateFieldSet(this, _APIPromise_client, client, "f");
	}
	_thenUnwrap(transform) {
		return new APIPromise(__classPrivateFieldGet(this, _APIPromise_client, "f"), this.responsePromise, async (client, props) => transform(await this.parseResponse(client, props), props));
	}
	/**
	* Gets the raw `Response` instance instead of parsing the response
	* data.
	*
	* If you want to parse the response body but still get the `Response`
	* instance, you can use {@link withResponse()}.
	*
	* 👋 Getting the wrong TypeScript type for `Response`?
	* Try setting `"moduleResolution": "NodeNext"` or add `"lib": ["DOM"]`
	* to your `tsconfig.json`.
	*/
	asResponse() {
		return this.responsePromise.then((p) => p.response);
	}
	/**
	* Gets the parsed response data and the raw `Response` instance.
	*
	* If you just want to get the raw `Response` instance without parsing it,
	* you can use {@link asResponse()}.
	*
	* 👋 Getting the wrong TypeScript type for `Response`?
	* Try setting `"moduleResolution": "NodeNext"` or add `"lib": ["DOM"]`
	* to your `tsconfig.json`.
	*/
	async withResponse() {
		const [data, response] = await Promise.all([this.parse(), this.asResponse()]);
		return {
			data,
			response
		};
	}
	parse() {
		if (!this.parsedPromise) this.parsedPromise = this.responsePromise.then((data) => this.parseResponse(__classPrivateFieldGet(this, _APIPromise_client, "f"), data));
		return this.parsedPromise;
	}
	then(onfulfilled, onrejected) {
		return this.parse().then(onfulfilled, onrejected);
	}
	catch(onrejected) {
		return this.parse().catch(onrejected);
	}
	finally(onfinally) {
		return this.parse().finally(onfinally);
	}
};
_APIPromise_client = /* @__PURE__ */ new WeakMap();
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/internal/utils/env.mjs
/**
* Read an environment variable.
*
* Trims beginning and trailing whitespace.
*
* Will return undefined if the environment variable doesn't exist or cannot be accessed.
*/
var readEnv = (env) => {
	if (typeof globalThis.process !== "undefined") return globalThis.process.env?.[env]?.trim() || void 0;
	if (typeof globalThis.Deno !== "undefined") return globalThis.Deno.env?.get?.(env)?.trim() || void 0;
};
//#endregion
//#region node_modules/.pnpm/retell-sdk@6.2.4/node_modules/retell-sdk/client.mjs
var _Retell_instances;
var _a;
var _Retell_encoder;
var _Retell_baseURLOverridden;
/**
* API Client for interfacing with the Retell API.
*/
var Retell = class {
	/**
	* API Client for interfacing with the Retell API.
	*
	* @param {string | undefined} [opts.apiKey=process.env['RETELL_API_KEY'] ?? undefined]
	* @param {string} [opts.baseURL=process.env['RETELL_BASE_URL'] ?? https://api.retellai.com] - Override the default base URL for the API.
	* @param {number} [opts.timeout=1 minute] - The maximum amount of time (in milliseconds) the client will wait for a response before timing out.
	* @param {MergedRequestInit} [opts.fetchOptions] - Additional `RequestInit` options to be passed to `fetch` calls.
	* @param {Fetch} [opts.fetch] - Specify a custom `fetch` function implementation.
	* @param {number} [opts.maxRetries=2] - The maximum number of times the client will retry a request.
	* @param {HeadersLike} opts.defaultHeaders - Default headers to include with every request to the API.
	* @param {Record<string, string | undefined>} opts.defaultQuery - Default query parameters to include with every request to the API.
	*/
	constructor({ baseURL = readEnv("RETELL_BASE_URL"), apiKey = readEnv("RETELL_API_KEY"), ...opts } = {}) {
		_Retell_instances.add(this);
		_Retell_encoder.set(this, void 0);
		this.call = new Call(this);
		this.chat = new Chat(this);
		this.phoneNumber = new PhoneNumber(this);
		this.agent = new Agent(this);
		this.chatAgent = new ChatAgent(this);
		this.llm = new Llm(this);
		this.conversationFlow = new ConversationFlow(this);
		this.conversationFlowComponent = new ConversationFlowComponent(this);
		this.knowledgeBase = new KnowledgeBase(this);
		this.voice = new Voice(this);
		this.asset = new Asset(this);
		this.concurrency = new Concurrency(this);
		this.identity = new Identity(this);
		this.exportRequest = new ExportRequest(this);
		this.batchCall = new BatchCall(this);
		this.tests = new Tests(this);
		this.playground = new Playground(this);
		this.mcpTool = new McpTool(this);
		this.contact = new Contact(this);
		this.app = new App(this);
		this.crm = new CRM(this);
		if (apiKey === void 0) throw new RetellError("The RETELL_API_KEY environment variable is missing or empty; either provide it, or instantiate the Retell client with an apiKey option, like new Retell({ apiKey: 'YOUR_RETELL_API_KEY' }).");
		const options = {
			apiKey,
			...opts,
			baseURL: baseURL || `https://api.retellai.com`
		};
		this.baseURL = options.baseURL;
		this.timeout = options.timeout ?? _a.DEFAULT_TIMEOUT;
		this.logger = options.logger ?? console;
		const defaultLogLevel = "warn";
		this.logLevel = defaultLogLevel;
		this.logLevel = parseLogLevel(options.logLevel, "ClientOptions.logLevel", this) ?? parseLogLevel(readEnv("RETELL_LOG"), "process.env['RETELL_LOG']", this) ?? defaultLogLevel;
		this.fetchOptions = options.fetchOptions;
		this.maxRetries = options.maxRetries ?? 2;
		this.fetch = options.fetch ?? getDefaultFetch();
		__classPrivateFieldSet(this, _Retell_encoder, FallbackEncoder, "f");
		const customHeadersEnv = readEnv("RETELL_CUSTOM_HEADERS");
		if (customHeadersEnv) {
			const parsed = {};
			for (const line of customHeadersEnv.split("\n")) {
				const colon = line.indexOf(":");
				if (colon >= 0) parsed[line.substring(0, colon).trim()] = line.substring(colon + 1).trim();
			}
			options.defaultHeaders = {
				...parsed,
				...options.defaultHeaders
			};
		}
		this._options = options;
		this.apiKey = apiKey;
	}
	/**
	* Create a new client instance re-using the same options given to the current client with optional overriding.
	*/
	withOptions(options) {
		return new this.constructor({
			...this._options,
			baseURL: this.baseURL,
			maxRetries: this.maxRetries,
			timeout: this.timeout,
			logger: this.logger,
			logLevel: this.logLevel,
			fetch: this.fetch,
			fetchOptions: this.fetchOptions,
			apiKey: this.apiKey,
			...options
		});
	}
	defaultQuery() {
		return this._options.defaultQuery;
	}
	validateHeaders({ values, nulls }) {}
	async authHeaders(opts) {
		return buildHeaders([{ Authorization: `Bearer ${this.apiKey}` }]);
	}
	/**
	* Basic re-implementation of `qs.stringify` for primitive types.
	*/
	stringifyQuery(query) {
		return stringifyQuery(query);
	}
	getUserAgent() {
		return `${this.constructor.name}/JS ${VERSION}`;
	}
	defaultIdempotencyKey() {
		return `stainless-node-retry-${uuid4()}`;
	}
	makeStatusError(status, error, message, headers) {
		return APIError.generate(status, error, message, headers);
	}
	buildURL(path, query, defaultBaseURL) {
		const baseURL = !__classPrivateFieldGet(this, _Retell_instances, "m", _Retell_baseURLOverridden).call(this) && defaultBaseURL || this.baseURL;
		const url = isAbsoluteURL(path) ? new URL(path) : new URL(baseURL + (baseURL.endsWith("/") && path.startsWith("/") ? path.slice(1) : path));
		const defaultQuery = this.defaultQuery();
		const pathQuery = Object.fromEntries(url.searchParams);
		if (!isEmptyObj(defaultQuery) || !isEmptyObj(pathQuery)) query = {
			...pathQuery,
			...defaultQuery,
			...query
		};
		if (typeof query === "object" && query && !Array.isArray(query)) url.search = this.stringifyQuery(query);
		return url.toString();
	}
	/**
	* Used as a callback for mutating the given `FinalRequestOptions` object.
	*/
	async prepareOptions(options) {}
	/**
	* Used as a callback for mutating the given `RequestInit` object.
	*
	* This is useful for cases where you want to add certain headers based off of
	* the request properties, e.g. `method` or `url`.
	*/
	async prepareRequest(request, { url, options }) {}
	get(path, opts) {
		return this.methodRequest("get", path, opts);
	}
	post(path, opts) {
		return this.methodRequest("post", path, opts);
	}
	patch(path, opts) {
		return this.methodRequest("patch", path, opts);
	}
	put(path, opts) {
		return this.methodRequest("put", path, opts);
	}
	delete(path, opts) {
		return this.methodRequest("delete", path, opts);
	}
	methodRequest(method, path, opts) {
		return this.request(Promise.resolve(opts).then((opts) => {
			return {
				method,
				path,
				...opts
			};
		}));
	}
	request(options, remainingRetries = null) {
		return new APIPromise(this, this.makeRequest(options, remainingRetries, void 0));
	}
	async makeRequest(optionsInput, retriesRemaining, retryOfRequestLogID) {
		const options = await optionsInput;
		const maxRetries = options.maxRetries ?? this.maxRetries;
		if (retriesRemaining == null) retriesRemaining = maxRetries;
		await this.prepareOptions(options);
		const { req, url, timeout } = await this.buildRequest(options, { retryCount: maxRetries - retriesRemaining });
		await this.prepareRequest(req, {
			url,
			options
		});
		/** Not an API request ID, just for correlating local log entries. */
		const requestLogID = "log_" + (Math.random() * (1 << 24) | 0).toString(16).padStart(6, "0");
		const retryLogStr = retryOfRequestLogID === void 0 ? "" : `, retryOf: ${retryOfRequestLogID}`;
		const startTime = Date.now();
		loggerFor(this).debug(`[${requestLogID}] sending request`, formatRequestDetails({
			retryOfRequestLogID,
			method: options.method,
			url,
			options,
			headers: req.headers
		}));
		if (options.signal?.aborted) throw new APIUserAbortError();
		const controller = new AbortController();
		const response = await this.fetchWithTimeout(url, req, timeout, controller).catch(castToError);
		const headersTime = Date.now();
		if (response instanceof globalThis.Error) {
			const retryMessage = `retrying, ${retriesRemaining} attempts remaining`;
			if (options.signal?.aborted) throw new APIUserAbortError();
			const isTimeout = isAbortError(response) || /timed? ?out/i.test(String(response) + ("cause" in response ? String(response.cause) : ""));
			if (retriesRemaining) {
				loggerFor(this).info(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} - ${retryMessage}`);
				loggerFor(this).debug(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} (${retryMessage})`, formatRequestDetails({
					retryOfRequestLogID,
					url,
					durationMs: headersTime - startTime,
					message: response.message
				}));
				return this.retryRequest(options, retriesRemaining, retryOfRequestLogID ?? requestLogID);
			}
			loggerFor(this).info(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} - error; no more retries left`);
			loggerFor(this).debug(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} (error; no more retries left)`, formatRequestDetails({
				retryOfRequestLogID,
				url,
				durationMs: headersTime - startTime,
				message: response.message
			}));
			if (isTimeout) throw new APIConnectionTimeoutError();
			throw new APIConnectionError({ cause: response });
		}
		const responseInfo = `[${requestLogID}${retryLogStr}] ${req.method} ${url} ${response.ok ? "succeeded" : "failed"} with status ${response.status} in ${headersTime - startTime}ms`;
		if (!response.ok) {
			const shouldRetry = await this.shouldRetry(response);
			if (retriesRemaining && shouldRetry) {
				const retryMessage = `retrying, ${retriesRemaining} attempts remaining`;
				await CancelReadableStream(response.body);
				loggerFor(this).info(`${responseInfo} - ${retryMessage}`);
				loggerFor(this).debug(`[${requestLogID}] response error (${retryMessage})`, formatRequestDetails({
					retryOfRequestLogID,
					url: response.url,
					status: response.status,
					headers: response.headers,
					durationMs: headersTime - startTime
				}));
				return this.retryRequest(options, retriesRemaining, retryOfRequestLogID ?? requestLogID, response.headers);
			}
			const retryMessage = shouldRetry ? `error; no more retries left` : `error; not retryable`;
			loggerFor(this).info(`${responseInfo} - ${retryMessage}`);
			const errText = await response.text().catch((err) => castToError(err).message);
			const errJSON = safeJSON(errText);
			const errMessage = errJSON ? void 0 : errText;
			loggerFor(this).debug(`[${requestLogID}] response error (${retryMessage})`, formatRequestDetails({
				retryOfRequestLogID,
				url: response.url,
				status: response.status,
				headers: response.headers,
				message: errMessage,
				durationMs: Date.now() - startTime
			}));
			throw this.makeStatusError(response.status, errJSON, errMessage, response.headers);
		}
		loggerFor(this).info(responseInfo);
		loggerFor(this).debug(`[${requestLogID}] response start`, formatRequestDetails({
			retryOfRequestLogID,
			url: response.url,
			status: response.status,
			headers: response.headers,
			durationMs: headersTime - startTime
		}));
		return {
			response,
			options,
			controller,
			requestLogID,
			retryOfRequestLogID,
			startTime
		};
	}
	async fetchWithTimeout(url, init, ms, controller) {
		const { signal, method, ...options } = init || {};
		const abort = this._makeAbort(controller);
		if (signal) signal.addEventListener("abort", abort, { once: true });
		const timeout = setTimeout(abort, ms);
		const isReadableBody = globalThis.ReadableStream && options.body instanceof globalThis.ReadableStream || typeof options.body === "object" && options.body !== null && Symbol.asyncIterator in options.body;
		const fetchOptions = {
			signal: controller.signal,
			...isReadableBody ? { duplex: "half" } : {},
			method: "GET",
			...options
		};
		if (method) fetchOptions.method = method.toUpperCase();
		try {
			return await this.fetch.call(void 0, url, fetchOptions);
		} finally {
			clearTimeout(timeout);
		}
	}
	async shouldRetry(response) {
		const shouldRetryHeader = response.headers.get("x-should-retry");
		if (shouldRetryHeader === "true") return true;
		if (shouldRetryHeader === "false") return false;
		if (response.status === 408) return true;
		if (response.status === 409) return true;
		if (response.status === 429) return true;
		if (response.status >= 500) return true;
		return false;
	}
	async retryRequest(options, retriesRemaining, requestLogID, responseHeaders) {
		let timeoutMillis;
		const retryAfterMillisHeader = responseHeaders?.get("retry-after-ms");
		if (retryAfterMillisHeader) {
			const timeoutMs = parseFloat(retryAfterMillisHeader);
			if (!Number.isNaN(timeoutMs)) timeoutMillis = timeoutMs;
		}
		const retryAfterHeader = responseHeaders?.get("retry-after");
		if (retryAfterHeader && !timeoutMillis) {
			const timeoutSeconds = parseFloat(retryAfterHeader);
			if (!Number.isNaN(timeoutSeconds)) timeoutMillis = timeoutSeconds * 1e3;
			else timeoutMillis = Date.parse(retryAfterHeader) - Date.now();
		}
		if (timeoutMillis === void 0) {
			const maxRetries = options.maxRetries ?? this.maxRetries;
			timeoutMillis = this.calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries);
		}
		await sleep(timeoutMillis);
		return this.makeRequest(options, retriesRemaining - 1, requestLogID);
	}
	calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries) {
		const initialRetryDelay = .5;
		const maxRetryDelay = 8;
		const numRetries = maxRetries - retriesRemaining;
		return Math.min(initialRetryDelay * Math.pow(2, numRetries), maxRetryDelay) * (1 - Math.random() * .25) * 1e3;
	}
	async buildRequest(inputOptions, { retryCount = 0 } = {}) {
		const options = { ...inputOptions };
		const { method, path, query, defaultBaseURL } = options;
		const url = this.buildURL(path, query, defaultBaseURL);
		if ("timeout" in options) validatePositiveInteger("timeout", options.timeout);
		options.timeout = options.timeout ?? this.timeout;
		const { bodyHeaders, body } = this.buildBody({ options });
		return {
			req: {
				method,
				headers: await this.buildHeaders({
					options: inputOptions,
					method,
					bodyHeaders,
					retryCount
				}),
				...options.signal && { signal: options.signal },
				...globalThis.ReadableStream && body instanceof globalThis.ReadableStream && { duplex: "half" },
				...body && { body },
				...this.fetchOptions ?? {},
				...options.fetchOptions ?? {}
			},
			url,
			timeout: options.timeout
		};
	}
	async buildHeaders({ options, method, bodyHeaders, retryCount }) {
		let idempotencyHeaders = {};
		if (this.idempotencyHeader && method !== "get") {
			if (!options.idempotencyKey) options.idempotencyKey = this.defaultIdempotencyKey();
			idempotencyHeaders[this.idempotencyHeader] = options.idempotencyKey;
		}
		const headers = buildHeaders([
			idempotencyHeaders,
			{
				Accept: "application/json",
				"User-Agent": this.getUserAgent(),
				"X-Stainless-Retry-Count": String(retryCount),
				...options.timeout ? { "X-Stainless-Timeout": String(Math.trunc(options.timeout / 1e3)) } : {},
				...getPlatformHeaders()
			},
			await this.authHeaders(options),
			this._options.defaultHeaders,
			bodyHeaders,
			options.headers
		]);
		this.validateHeaders(headers);
		return headers.values;
	}
	_makeAbort(controller) {
		return () => controller.abort();
	}
	buildBody({ options }) {
		const { body, headers: rawHeaders } = options;
		if (!body) {
			if (body == null && "body" in options) return __classPrivateFieldGet(this, _Retell_encoder, "f").call(this, {
				body,
				headers: buildHeaders([rawHeaders])
			});
			return {
				bodyHeaders: void 0,
				body: void 0
			};
		}
		const headers = buildHeaders([rawHeaders]);
		if (ArrayBuffer.isView(body) || body instanceof ArrayBuffer || body instanceof DataView || typeof body === "string" && headers.values.has("content-type") || globalThis.Blob && body instanceof globalThis.Blob || body instanceof FormData || body instanceof URLSearchParams || globalThis.ReadableStream && body instanceof globalThis.ReadableStream) return {
			bodyHeaders: void 0,
			body
		};
		else if (typeof body === "object" && (Symbol.asyncIterator in body || Symbol.iterator in body && "next" in body && typeof body.next === "function")) return {
			bodyHeaders: void 0,
			body: ReadableStreamFrom(body)
		};
		else if (typeof body === "object" && headers.values.get("content-type") === "application/x-www-form-urlencoded") return {
			bodyHeaders: { "content-type": "application/x-www-form-urlencoded" },
			body: this.stringifyQuery(body)
		};
		else return __classPrivateFieldGet(this, _Retell_encoder, "f").call(this, {
			body,
			headers
		});
	}
};
_a = Retell, _Retell_encoder = /* @__PURE__ */ new WeakMap(), _Retell_instances = /* @__PURE__ */ new WeakSet(), _Retell_baseURLOverridden = function _Retell_baseURLOverridden() {
	return this.baseURL !== "https://api.retellai.com";
};
Retell.Retell = _a;
Retell.DEFAULT_TIMEOUT = 6e4;
Retell.RetellError = RetellError;
Retell.APIError = APIError;
Retell.APIConnectionError = APIConnectionError;
Retell.APIConnectionTimeoutError = APIConnectionTimeoutError;
Retell.APIUserAbortError = APIUserAbortError;
Retell.NotFoundError = NotFoundError;
Retell.ConflictError = ConflictError;
Retell.RateLimitError = RateLimitError;
Retell.BadRequestError = BadRequestError;
Retell.AuthenticationError = AuthenticationError;
Retell.InternalServerError = InternalServerError;
Retell.PermissionDeniedError = PermissionDeniedError;
Retell.UnprocessableEntityError = UnprocessableEntityError;
Retell.toFile = toFile;
Retell.verify = verify;
Retell.sign = sign;
Retell.Call = Call;
Retell.Chat = Chat;
Retell.PhoneNumber = PhoneNumber;
Retell.Agent = Agent;
Retell.ChatAgent = ChatAgent;
Retell.Llm = Llm;
Retell.ConversationFlow = ConversationFlow;
Retell.ConversationFlowComponent = ConversationFlowComponent;
Retell.KnowledgeBase = KnowledgeBase;
Retell.Voice = Voice;
Retell.Asset = Asset;
Retell.Concurrency = Concurrency;
Retell.Identity = Identity;
Retell.ExportRequest = ExportRequest;
Retell.BatchCall = BatchCall;
Retell.Tests = Tests;
Retell.Playground = Playground;
Retell.McpTool = McpTool;
Retell.Contact = Contact;
Retell.App = App;
Retell.CRM = CRM;
//#endregion
export { Retell };
