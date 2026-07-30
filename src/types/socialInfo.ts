export interface ValidatorSocialInfo {
	name: string;
	logoUrl?: string;
	website?: string;
	contact?: string;
}

export type ValidatorSocialError =
	| 'invalid-url'
	| 'blocked-url'
	| 'not-found'
	| 'unavailable'
	| 'invalid-response'
	| 'busy';

export type ValidatorSocialResult =
	| { ok: true; data: ValidatorSocialInfo }
	| { ok: false; error: ValidatorSocialError };

export type ValidatorSocialBatchResult =
	| { ok: true; data: readonly ValidatorSocialResult[] }
	| { ok: false; error: 'invalid-request' | 'batch-limit' };
