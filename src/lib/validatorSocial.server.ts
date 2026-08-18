import type {
	ValidatorSocialError,
	ValidatorSocialInfo,
	ValidatorSocialResult
} from '@/types/socialInfo';
import { Resolver } from 'node:dns/promises';
import type { IncomingHttpHeaders } from 'node:http';
import { request } from 'node:https';
import { BlockList, isIP } from 'node:net';

export const VALIDATOR_SOCIAL_BATCH_LIMIT = 12;
export const VALIDATOR_SOCIAL_URL_BYTES = 2_048;
export const VALIDATOR_SOCIAL_BATCH_DEADLINE_MS = 6_000;

const MAX_REDIRECTS = 3;
const DNS_TIMEOUT_MS = 1_000;
const HOP_TIMEOUT_MS = 3_000;
const MAX_BODY_BYTES = 64 * 1_024;
const MAX_HEADER_BYTES = 8 * 1_024;
const SUCCESS_TTL_MS = 5 * 60 * 1_000;
const SUCCESS_CACHE_ENTRIES = 128;
const GLOBAL_FETCH_LIMIT = 8;
const GLOBAL_QUEUE_LIMIT = 32;
const USER_AGENT = 'VinuChain-Staking-Dashboard/1.0';

// Keep address-family rules separate: Node's BlockList cross-matches IPv4-mapped IPv6 addresses.
const blockedIpv4Addresses = new BlockList();
for (const [network, prefix] of [
	['0.0.0.0', 8],
	['10.0.0.0', 8],
	['100.64.0.0', 10],
	['127.0.0.0', 8],
	['169.254.0.0', 16],
	['172.16.0.0', 12],
	['192.0.0.0', 24],
	['192.0.2.0', 24],
	['192.88.99.0', 24],
	['192.168.0.0', 16],
	['198.18.0.0', 15],
	['198.51.100.0', 24],
	['203.0.113.0', 24],
	['224.0.0.0', 4],
	['240.0.0.0', 4]
] as const) {
	blockedIpv4Addresses.addSubnet(network, prefix, 'ipv4');
}
const blockedIpv6Addresses = new BlockList();
for (const [network, prefix] of [
	['::', 3],
	['4000::', 2],
	['8000::', 1],
	['2001::', 23],
	['2001:2::', 48],
	['2001:20::', 28],
	['2001:db8::', 32],
	['2002::', 16],
	['3fff::', 20]
] as const) {
	blockedIpv6Addresses.addSubnet(network, prefix, 'ipv6');
}

class SocialFetchError extends Error {
	constructor(readonly code: ValidatorSocialError) {
		super(code);
	}
}

type CanonicalResult =
	| { ok: true; url: URL; canonicalUrl: string }
	| { ok: false; error: 'invalid-url' | 'blocked-url' };

type CacheEntry = { data: ValidatorSocialInfo; expiresAt: number };
const successCache = new Map<string, CacheEntry>();

let activeFetches = 0;
type QueueWaiter = {
	deadlineAt: number;
	resolve: (acquired: boolean) => void;
	timer: ReturnType<typeof setTimeout>;
};
const fetchQueue: QueueWaiter[] = [];

function utf8Bytes(value: string): number {
	return Buffer.byteLength(value, 'utf8');
}

export function canonicalizeValidatorSocialUrl(rawUrl: string): CanonicalResult {
	let url: URL;
	try {
		url = new URL(rawUrl);
	} catch {
		return { ok: false, error: 'invalid-url' };
	}
	if (
		url.protocol !== 'https:' ||
		url.username !== '' ||
		url.password !== '' ||
		url.hash !== '' ||
		url.port !== ''
	) {
		return { ok: false, error: 'invalid-url' };
	}
	const hostname = url.hostname.toLowerCase();
	if (
		isIP(hostname) !== 0 ||
		hostname === 'localhost' ||
		hostname.endsWith('.localhost') ||
		hostname.endsWith('.local') ||
		!hostname.includes('.') ||
		hostname.split('.').some((label) => label.length === 0)
	) {
		return { ok: false, error: 'blocked-url' };
	}
	const canonicalUrl = url.href;
	if (utf8Bytes(canonicalUrl) > VALIDATOR_SOCIAL_URL_BYTES) {
		return { ok: false, error: 'invalid-url' };
	}
	return { ok: true, url, canonicalUrl };
}

function pruneExpiredWaiters(now: number): void {
	for (let index = fetchQueue.length - 1; index >= 0; index -= 1) {
		const waiter = fetchQueue[index];
		if (waiter.deadlineAt <= now) {
			fetchQueue.splice(index, 1);
			clearTimeout(waiter.timer);
			waiter.resolve(false);
		}
	}
}

function acquireFetchSlot(deadlineAt: number): Promise<boolean> {
	const now = Date.now();
	if (deadlineAt <= now) return Promise.resolve(false);
	pruneExpiredWaiters(now);
	if (activeFetches < GLOBAL_FETCH_LIMIT) {
		activeFetches += 1;
		return Promise.resolve(true);
	}
	if (fetchQueue.length >= GLOBAL_QUEUE_LIMIT) return Promise.resolve(false);
	return new Promise((resolve) => {
		const waiter: QueueWaiter = {
			deadlineAt,
			resolve,
			timer: setTimeout(
				() => {
					const index = fetchQueue.indexOf(waiter);
					if (index !== -1) fetchQueue.splice(index, 1);
					resolve(false);
				},
				Math.max(0, deadlineAt - now)
			)
		};
		fetchQueue.push(waiter);
	});
}

function releaseFetchSlot(): void {
	activeFetches = Math.max(0, activeFetches - 1);
	const now = Date.now();
	while (activeFetches < GLOBAL_FETCH_LIMIT && fetchQueue.length > 0) {
		const waiter = fetchQueue.shift();
		if (!waiter) break;
		clearTimeout(waiter.timer);
		if (waiter.deadlineAt <= now) {
			waiter.resolve(false);
			continue;
		}
		activeFetches += 1;
		waiter.resolve(true);
	}
}

function getCached(canonicalUrl: string): ValidatorSocialInfo | undefined {
	const entry = successCache.get(canonicalUrl);
	if (!entry) return undefined;
	if (entry.expiresAt <= Date.now()) {
		successCache.delete(canonicalUrl);
		return undefined;
	}
	successCache.delete(canonicalUrl);
	successCache.set(canonicalUrl, entry);
	return entry.data;
}

function cacheSuccess(canonicalUrl: string, data: ValidatorSocialInfo): void {
	successCache.delete(canonicalUrl);
	successCache.set(canonicalUrl, { data, expiresAt: Date.now() + SUCCESS_TTL_MS });
	while (successCache.size > SUCCESS_CACHE_ENTRIES) {
		const oldest = successCache.keys().next().value as string | undefined;
		if (oldest === undefined) break;
		successCache.delete(oldest);
	}
}

function addressIsPublic(address: string): boolean {
	const family = isIP(address);
	if (family === 4) return !blockedIpv4Addresses.check(address, 'ipv4');
	if (family === 6) return !/^::ffff:/i.test(address) && !blockedIpv6Addresses.check(address, 'ipv6');
	return false;
}

async function resolvePublicAddresses(hostname: string, deadlineAt: number): Promise<string[]> {
	const remainingMs = deadlineAt - Date.now();
	if (remainingMs <= 0) throw new SocialFetchError('unavailable');
	const resolver = new Resolver({ timeout: DNS_TIMEOUT_MS, tries: 1 });
	const settledDns = Promise.allSettled([resolver.resolve4(hostname), resolver.resolve6(hostname)]);
	let deadlineTimer: ReturnType<typeof setTimeout> | undefined;
	const absoluteDeadline = new Promise<never>((_resolve, reject) => {
		deadlineTimer = setTimeout(() => {
			resolver.cancel();
			reject(new SocialFetchError('unavailable'));
		}, remainingMs);
	});
	let results: Awaited<typeof settledDns>;
	try {
		results = await Promise.race([settledDns, absoluteDeadline]);
	} finally {
		clearTimeout(deadlineTimer);
	}
	const [ipv4, ipv6] = results;
	if (Date.now() >= deadlineAt) throw new SocialFetchError('unavailable');
	const addresses = [
		...(ipv4.status === 'fulfilled' ? ipv4.value : []),
		...(ipv6.status === 'fulfilled' ? ipv6.value : [])
	];
	if (addresses.length === 0) throw new SocialFetchError('unavailable');
	if (addresses.some((address) => !addressIsPublic(address))) {
		throw new SocialFetchError('blocked-url');
	}
	return addresses;
}

function headerValue(headers: IncomingHttpHeaders, name: string): string | undefined {
	const value = headers[name];
	return Array.isArray(value) ? value.join(',') : value;
}
type HopResult = { kind: 'redirect'; location: string } | { kind: 'json'; value: unknown };

async function requestJson(url: URL, address: string, deadlineAt: number): Promise<HopResult> {
	if (Date.now() >= deadlineAt) throw new SocialFetchError('unavailable');
	const remainingMs = deadlineAt - Date.now();
	const timeoutMs = Math.min(HOP_TIMEOUT_MS, remainingMs);
	if (timeoutMs <= 0) throw new SocialFetchError('unavailable');
	const family = isIP(address);
	if (family !== 4 && family !== 6) throw new SocialFetchError('blocked-url');

	return new Promise<HopResult>((resolve, reject) => {
		let settled = false;
		let absoluteTimer: ReturnType<typeof setTimeout> | undefined;
		const finish = (error?: SocialFetchError, value?: HopResult) => {
			if (settled) return;
			settled = true;
			clearTimeout(absoluteTimer);
			if (error) reject(error);
			else if (value) resolve(value);
			else reject(new SocialFetchError('invalid-response'));
		};
		const req = request(
			{
				protocol: 'https:',
				hostname: url.hostname,
				port: 443,
				path: `${url.pathname}${url.search}`,
				method: 'GET',
				servername: url.hostname,
				agent: false,
				maxHeaderSize: MAX_HEADER_BYTES,
				headers: {
					accept: 'application/json',
					'accept-encoding': 'identity',
					'user-agent': USER_AGENT,
					host: url.hostname
				},
				lookup: (_hostname, options, callback) => {
					if (typeof options === 'object' && options.all) {
						callback(null, [{ address, family }]);
					} else {
						callback(null, address, family);
					}
				}
			},
			(response) => {
				const status = response.statusCode ?? 0;
				if ([301, 302, 303, 307, 308].includes(status)) {
					response.destroy();
					const location = headerValue(response.headers, 'location');
					if (!location) finish(new SocialFetchError('invalid-response'));
					else finish(undefined, { kind: 'redirect', location });
					return;
				}
				if (status === 404) {
					response.destroy();
					finish(new SocialFetchError('not-found'));
					return;
				}
				if (status !== 200) {
					response.destroy();
					finish(new SocialFetchError('unavailable'));
					return;
				}
				const contentType = (headerValue(response.headers, 'content-type') ?? '')
					.split(';', 1)[0]
					.trim()
					.toLowerCase();
				const contentEncoding = (headerValue(response.headers, 'content-encoding') ?? 'identity')
					.trim()
					.toLowerCase();
				if (
					!(
						contentType === 'application/json' ||
						contentType.endsWith('+json') ||
						contentType === 'text/plain'
					)
				) {
					response.destroy();
					finish(new SocialFetchError('invalid-response'));
					return;
				}
				if (contentEncoding !== 'identity') {
					response.destroy();
					finish(new SocialFetchError('invalid-response'));
					return;
				}
				const declaredLength = headerValue(response.headers, 'content-length');
				if (declaredLength !== undefined) {
					const parsedLength = Number(declaredLength);
					if (!Number.isSafeInteger(parsedLength) || parsedLength < 0 || parsedLength > MAX_BODY_BYTES) {
						response.destroy();
						finish(new SocialFetchError('invalid-response'));
						return;
					}
				}
				const chunks: Buffer[] = [];
				let received = 0;
				response.on('data', (chunk: Buffer | string) => {
					if (settled) return;
					const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
					received += bytes.length;
					if (received > MAX_BODY_BYTES) {
						response.destroy();
						finish(new SocialFetchError('invalid-response'));
						return;
					}
					chunks.push(bytes);
				});
				response.on('end', () => {
					if (settled) return;
					try {
						const text = new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks));
						finish(undefined, { kind: 'json', value: JSON.parse(text) });
					} catch {
						finish(new SocialFetchError('invalid-response'));
					}
				});
				response.on('error', () => finish(new SocialFetchError('unavailable')));
			}
		);
		absoluteTimer = setTimeout(() => req.destroy(new SocialFetchError('unavailable')), timeoutMs);
		req.on('error', (error) =>
			finish(error instanceof SocialFetchError ? error : new SocialFetchError('unavailable'))
		);
		req.end();
	});
}

function normalizeWebsite(value: unknown): string | undefined {
	if (value === undefined) return undefined;
	if (typeof value !== 'string') throw new SocialFetchError('invalid-response');
	let url: URL;
	try {
		url = new URL(value);
	} catch {
		throw new SocialFetchError('invalid-response');
	}
	if (url.protocol !== 'https:' || url.username !== '' || url.password !== '') {
		throw new SocialFetchError('invalid-response');
	}
	if (utf8Bytes(url.href) > VALIDATOR_SOCIAL_URL_BYTES) {
		throw new SocialFetchError('invalid-response');
	}
	return url.href;
}

function normalizeLogo(value: unknown): string | undefined {
	if (typeof value !== 'string') return undefined;
	try {
		const url = new URL(value);
		if (
			url.protocol !== 'https:' ||
			url.username !== '' ||
			url.password !== '' ||
			utf8Bytes(url.href) > VALIDATOR_SOCIAL_URL_BYTES
		) {
			return undefined;
		}
		return url.href;
	} catch {
		return undefined;
	}
}

function normalizeSocialInfo(value: unknown): ValidatorSocialInfo {
	if (typeof value !== 'object' || value === null || Array.isArray(value)) {
		throw new SocialFetchError('invalid-response');
	}
	const record = value as Record<string, unknown>;
	if (typeof record.name !== 'string') throw new SocialFetchError('invalid-response');
	const name = record.name.trim();
	if (name.length === 0 || name.length > 120) throw new SocialFetchError('invalid-response');
	let contact: string | undefined;
	if (record.contact !== undefined) {
		if (typeof record.contact !== 'string') throw new SocialFetchError('invalid-response');
		contact = record.contact.trim();
		if (contact.length > 320) throw new SocialFetchError('invalid-response');
		if (contact.length === 0) contact = undefined;
	}
	const normalized: ValidatorSocialInfo = { name };
	const website = normalizeWebsite(record.website);
	const logoUrl = normalizeLogo(record.logoUrl);
	if (logoUrl !== undefined) normalized.logoUrl = logoUrl;
	if (website !== undefined) normalized.website = website;
	if (contact !== undefined) normalized.contact = contact;
	return normalized;
}

async function fetchCanonicalSocialInfo(
	initialUrl: URL,
	canonicalUrl: string,
	deadlineAt: number
): Promise<ValidatorSocialResult> {
	if (Date.now() >= deadlineAt) return { ok: false, error: 'unavailable' };
	const cached = getCached(canonicalUrl);
	if (cached) return { ok: true, data: cached };
	const acquired = await acquireFetchSlot(deadlineAt);
	if (!acquired) return { ok: false, error: Date.now() >= deadlineAt ? 'unavailable' : 'busy' };
	try {
		let currentUrl = initialUrl;
		for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
			if (Date.now() >= deadlineAt) throw new SocialFetchError('unavailable');
			const addresses = await resolvePublicAddresses(currentUrl.hostname, deadlineAt);
			if (Date.now() >= deadlineAt) throw new SocialFetchError('unavailable');
			const response = await requestJson(currentUrl, addresses[0], deadlineAt);
			if (Date.now() >= deadlineAt) throw new SocialFetchError('unavailable');
			if (response.kind === 'redirect') {
				if (redirectCount === MAX_REDIRECTS) throw new SocialFetchError('unavailable');
				let redirectedRaw: string;
				try {
					redirectedRaw = new URL(response.location, currentUrl).href;
				} catch {
					throw new SocialFetchError('invalid-url');
				}
				const redirected = canonicalizeValidatorSocialUrl(redirectedRaw);
				if (!redirected.ok) throw new SocialFetchError(redirected.error);
				currentUrl = redirected.url;
				continue;
			}
			const data = normalizeSocialInfo(response.value);
			if (Date.now() >= deadlineAt) throw new SocialFetchError('unavailable');
			cacheSuccess(canonicalUrl, data);
			return { ok: true, data };
		}
		return { ok: false, error: 'unavailable' };
	} catch (error) {
		return {
			ok: false,
			error: error instanceof SocialFetchError ? error.code : 'unavailable'
		};
	} finally {
		releaseFetchSlot();
	}
}

export async function fetchValidatorSocialInfo(
	rawUrl: string,
	deadlineAt: number
): Promise<ValidatorSocialResult> {
	const canonical = canonicalizeValidatorSocialUrl(rawUrl);
	if (!canonical.ok) return canonical;
	return fetchCanonicalSocialInfo(canonical.url, canonical.canonicalUrl, deadlineAt);
}
