'use server';

import {
	canonicalizeValidatorSocialUrl,
	fetchValidatorSocialInfo,
	VALIDATOR_SOCIAL_BATCH_DEADLINE_MS,
	VALIDATOR_SOCIAL_BATCH_LIMIT
} from '@/lib/validatorSocial.server';
import type { ValidatorSocialBatchResult, ValidatorSocialResult } from '@/types/socialInfo';

const ACTION_FETCH_LIMIT = 4;

export default async function getValidatorSocialInfo(
	urls: unknown
): Promise<ValidatorSocialBatchResult> {
	if (!Array.isArray(urls)) return { ok: false, error: 'invalid-request' };
	if (urls.length > VALIDATOR_SOCIAL_BATCH_LIMIT) {
		return { ok: false, error: 'batch-limit' };
	}
	const deadlineAt = Date.now() + VALIDATOR_SOCIAL_BATCH_DEADLINE_MS;
	const validatedUrls: string[] = [];
	for (const url of Array.from(urls)) {
		if (typeof url !== 'string') return { ok: false, error: 'invalid-request' };
		validatedUrls.push(url);
	}
	if (validatedUrls.length === 0) return { ok: true, data: [] };

	const results: ValidatorSocialResult[] = new Array(validatedUrls.length);
	const canonicalWork = new Map<string, { url: string; indexes: number[] }>();
	validatedUrls.forEach((rawUrl, index) => {
		const canonical = canonicalizeValidatorSocialUrl(rawUrl);
		if (!canonical.ok) {
			results[index] = canonical;
			return;
		}
		const existing = canonicalWork.get(canonical.canonicalUrl);
		if (existing) existing.indexes.push(index);
		else {
			canonicalWork.set(canonical.canonicalUrl, {
				url: canonical.canonicalUrl,
				indexes: [index]
			});
		}
	});

	const work = [...canonicalWork.values()];
	let nextIndex = 0;
	const workers = Array.from({ length: Math.min(ACTION_FETCH_LIMIT, work.length) }, async () => {
		while (nextIndex < work.length) {
			const item = work[nextIndex];
			nextIndex += 1;
			const result = await fetchValidatorSocialInfo(item.url, deadlineAt);
			for (const resultIndex of item.indexes) results[resultIndex] = result;
		}
	});
	await Promise.all(workers);
	return { ok: true, data: results };
}
