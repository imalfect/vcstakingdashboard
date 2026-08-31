import type {
	ActiveTransactionBatch,
	TrackedTransaction,
	TransactionContractKey,
	TransactionPhase,
	TransactionRequest
} from '@/components/TransactionProcessor/types';
import paybackAbi from '@/config/contracts/payback';
import sfcAbi from '@/config/contracts/sfc';
import { getVinuChain } from '@/config/wagmiShared';
import { isAddress, isAddressEqual, isHash, type Address, type Hash } from 'viem';

export const TRANSACTION_STORAGE_KEY = 'vcstakingdashboard:transaction-processor:v1';
const VERSION = 1;
const MAX_NAME_LENGTH = 120;
const MAX_MESSAGE_LENGTH = 240;
const phaseLookup: Record<TransactionPhase, true> = {
	queued: true,
	paused_wallet_mismatch: true,
	awaiting_wallet: true,
	broadcast_failed: true,
	broadcast_outcome_unknown: true,
	confirming: true,
	confirmation_failed: true,
	confirmed: true,
	reverted: true,
	replacement_failed: true,
	stopped: true,
	skipped: true
};
const requestKeys = ['name', 'contractKey', 'address', 'functionName', 'args', 'value'];
const rowKeys = [
	'id',
	'request',
	'broadcastAttempt',
	'confirmationAttempt',
	'phase',
	'hash',
	'message'
];
const batchKeys = ['version', 'id', 'account', 'chainId', 'transactions'];

type StoredRequest = {
	name: string;
	contractKey: TransactionContractKey;
	address: Address;
	functionName: string;
	args?: readonly (bigint | Address)[];
	value?: bigint;
};

type StoredRow = Omit<TrackedTransaction, 'request'> & { request: StoredRequest };
type StoredBatch = Omit<ActiveTransactionBatch, 'transactions'> & {
	version: number;
	transactions: readonly StoredRow[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function bigintArgs(value: unknown, length: number): value is readonly bigint[] {
	return (
		Array.isArray(value) &&
		value.length === length &&
		value.every((item) => typeof item === 'bigint' && item >= 0n)
	);
}

function addressArgs(value: unknown, length: number): value is readonly Address[] {
	return Array.isArray(value) && value.length === length && value.every((item) => isAddress(item));
}

function addressAndBigintArgs(value: unknown): value is readonly [Address, bigint] {
	return (
		Array.isArray(value) &&
		value.length === 2 &&
		isAddress(value[0]) &&
		typeof value[1] === 'bigint' &&
		value[1] >= 0n
	);
}

function hasOnlyKeys(value: Record<string, unknown>, allowed: readonly string[]): boolean {
	return Object.keys(value).every((key) => allowed.includes(key));
}

function restoreRequest(raw: unknown, chainId: number): TransactionRequest | null {
	if (
		!isRecord(raw) ||
		!hasOnlyKeys(raw, requestKeys) ||
		typeof raw.name !== 'string' ||
		raw.name.length < 1 ||
		raw.name.length > MAX_NAME_LENGTH
	)
		return null;
	if (
		raw.contractKey !== 'sfc' &&
		raw.contractKey !== 'payback' &&
		raw.contractKey !== 'paybackLegacy'
	)
		return null;
	if (typeof raw.functionName !== 'string' || !isAddress(raw.address as string)) return null;
	const chain = getVinuChain(chainId);
	if (!chain) return null;

	const key = raw.contractKey;
	const configured = (() => {
		if (key === 'sfc') return chain.contracts.sfc.address;
		if (key === 'payback')
			return 'payback' in chain.contracts ? chain.contracts.payback?.address : undefined;
		return 'legacyPayback' in chain.contracts
			? chain.contracts.legacyPayback?.address
			: undefined;
	})();
	if (!configured || !isAddressEqual(raw.address as Address, configured)) return null;

	const fn = raw.functionName;
	const args = raw.args;
	const value = raw.value;
	if (typeof value === 'bigint' && value < 0n) return null;
	let valid = false;
	if (key === 'sfc') {
		valid =
			((fn === 'claimRewards' || fn === 'restakeRewards') &&
				bigintArgs(args, 1) &&
				value === undefined) ||
			(fn === 'delegate' && bigintArgs(args, 1) && typeof value === 'bigint') ||
			((fn === 'lockStake' || fn === 'relockStake') && bigintArgs(args, 3) && value === undefined) ||
			((fn === 'undelegate' || fn === 'unlockStake' || fn === 'withdraw') &&
				bigintArgs(args, 2) &&
				value === undefined);
	} else if (key === 'payback') {
		valid =
			(fn === 'stake' && (args === undefined || bigintArgs(args, 0)) && typeof value === 'bigint') ||
			(fn === 'stakeFor' && addressArgs(args, 1) && typeof value === 'bigint') ||
			((fn === 'unstake' || fn === 'withdrawStake') &&
				bigintArgs(args, 1) &&
				value === undefined) ||
			(fn === 'unstakeFor' && addressAndBigintArgs(args) && value === undefined);
	} else {
		valid =
			(fn === 'unstake' || fn === 'withdrawStake') &&
			bigintArgs(args, 1) &&
			value === undefined;
	}
	if (!valid) return null;

	return {
		abi: key === 'sfc' ? sfcAbi : paybackAbi,
		address: raw.address as Address,
		functionName: fn,
		...(args === undefined ? {} : { args }),
		...(value === undefined ? {} : { value }),
		name: raw.name,
		contractKey: key
	} as TransactionRequest;
}

export function serializeStoredBatch(batch: ActiveTransactionBatch): string {
	const stored: StoredBatch = {
		version: VERSION,
		id: batch.id,
		account: batch.account,
		chainId: batch.chainId,
		transactions: batch.transactions.map((row) => ({
			id: row.id,
			request: {
				name: row.request.name,
				contractKey: row.request.contractKey,
				address: row.request.address,
				functionName: String(row.request.functionName),
				...(row.request.args === undefined
					? {}
					: { args: row.request.args as readonly (bigint | Address)[] }),
				...(row.request.value === undefined ? {} : { value: row.request.value })
			},
			broadcastAttempt: row.broadcastAttempt,
			confirmationAttempt: row.confirmationAttempt,
			phase: row.phase,
			...(row.hash ? { hash: row.hash } : {}),
			...(row.message ? { message: row.message.slice(0, MAX_MESSAGE_LENGTH) } : {})
		}))
	};
	return JSON.stringify(stored, (_key, value) =>
		typeof value === 'bigint' ? { __vcstakingBigInt: value.toString() } : value
	);
}

export function parseStoredBatch(raw: string): ActiveTransactionBatch | null {
	try {
		const parsed: unknown = JSON.parse(raw, (_key, value) => {
			if (
				isRecord(value) &&
				Object.keys(value).length === 1 &&
				typeof value.__vcstakingBigInt === 'string' &&
				/^(0|[1-9]\d*)$/.test(value.__vcstakingBigInt)
			) {
				return BigInt(value.__vcstakingBigInt);
			}
			return value;
		});
		if (
			!isRecord(parsed) ||
			!hasOnlyKeys(parsed, batchKeys) ||
			parsed.version !== VERSION ||
			typeof parsed.id !== 'string' ||
			parsed.id.length < 1 ||
			parsed.id.length > 120
		)
			return null;
		if (
			!isAddress(parsed.account as string) ||
			typeof parsed.chainId !== 'number' ||
			!getVinuChain(parsed.chainId)
		)
			return null;
		if (
			!Array.isArray(parsed.transactions) ||
			parsed.transactions.length < 1 ||
			parsed.transactions.length > 32
		)
			return null;

		const rows: TrackedTransaction[] = [];
		for (let index = 0; index < parsed.transactions.length; index += 1) {
			const rawRow = parsed.transactions[index];
			if (!isRecord(rawRow) || !hasOnlyKeys(rawRow, rowKeys) || rawRow.id !== `${parsed.id}:${index}`)
				return null;
			if (!Number.isSafeInteger(rawRow.broadcastAttempt) || (rawRow.broadcastAttempt as number) < 0)
				return null;
			if (
				!Number.isSafeInteger(rawRow.confirmationAttempt) ||
				(rawRow.confirmationAttempt as number) < 0
			)
				return null;
			if (
				typeof rawRow.phase !== 'string' ||
				!Object.prototype.hasOwnProperty.call(phaseLookup, rawRow.phase)
			)
				return null;
			if (rawRow.hash !== undefined && (typeof rawRow.hash !== 'string' || !isHash(rawRow.hash)))
				return null;
			if (
				rawRow.message !== undefined &&
				(typeof rawRow.message !== 'string' || rawRow.message.length > MAX_MESSAGE_LENGTH)
			)
				return null;
			const request = restoreRequest(rawRow.request, parsed.chainId);
			if (!request) return null;

			let phase = rawRow.phase as TransactionPhase;
			let message = rawRow.message as string | undefined;
			const hash = rawRow.hash as Hash | undefined;
			if (hash && phase !== 'confirmed' && phase !== 'reverted' && phase !== 'replacement_failed')
				phase = 'confirming';
			if (!hash && phase === 'awaiting_wallet') {
				phase = 'broadcast_outcome_unknown';
				message =
					'The previous wallet request was interrupted. Inspect wallet and account activity before starting a new action.';
			}
			if (
				!hash &&
				['confirming', 'confirmation_failed', 'confirmed', 'reverted', 'replacement_failed'].includes(
					phase
				)
			)
				return null;
			rows.push({
				id: rawRow.id,
				request,
				broadcastAttempt: rawRow.broadcastAttempt as number,
				confirmationAttempt: rawRow.confirmationAttempt as number,
				phase,
				...(hash ? { hash } : {}),
				...(message ? { message } : {})
			});
		}

		let foundUnconfirmed = false;
		let foundActiveHash = false;
		for (const row of rows) {
			if (row.phase === 'confirmed') {
				if (foundUnconfirmed) return null;
				continue;
			}
			foundUnconfirmed = true;
			if (row.hash) {
				if (foundActiveHash) return null;
				foundActiveHash = true;
			}
		}

		const unknownIndex = rows.findIndex(({ phase }) => phase === 'broadcast_outcome_unknown');
		if (unknownIndex >= 0) {
			for (let index = unknownIndex + 1; index < rows.length; index += 1) {
				if (!rows[index].hash && rows[index].phase !== 'confirmed') {
					rows[index] = {
						...rows[index],
						phase: 'skipped',
						message: 'Skipped because an earlier wallet outcome is unknown.'
					};
				}
			}
		}

		return {
			id: parsed.id,
			account: parsed.account as Address,
			chainId: parsed.chainId as ActiveTransactionBatch['chainId'],
			transactions: rows
		};
	} catch {
		return null;
	}
}
