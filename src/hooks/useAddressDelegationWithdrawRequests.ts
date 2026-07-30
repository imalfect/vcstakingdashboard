import { useStakingSession } from '@/components/Contexts/StakingSession';
import sfc from '@/config/contracts/sfc';
import getDelegationWithdrawRequests from '@/generators/read/getDelegationWithdrawRequests';
import { DelegationWithdrawRequest } from '@/types/delegationWithdrawRequest';
import { ReadState } from '@/types/readState';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Address } from 'viem';
import { usePublicClient } from 'wagmi';

export const REQUESTS_PER_VALIDATOR_PAGE = 100n;
export const VALIDATORS_PER_QUERY_PAGE = 4;

type WithdrawalCursor = { validatorId: bigint; offset: bigint };
type WithdrawalTuple = { epoch: bigint; time: bigint; amount: bigint };

export type WithdrawalReadFailure = {
	validatorId: bigint;
	offset: bigint;
	error: Error;
};

export type DelegationWithdrawRequestsQuery = ReadState<
	readonly DelegationWithdrawRequest[],
	WithdrawalReadFailure
> & {
	hasMore: boolean;
	isFetchingMore: boolean;
	loadMore(): Promise<void>;
};

type WithdrawalPage = {
	requests: readonly DelegationWithdrawRequest[];
	failures: readonly WithdrawalReadFailure[];
	nextQueue: readonly WithdrawalCursor[];
	succeeded: boolean;
};

type BulkResult =
	| { cursor: WithdrawalCursor; ok: true; requests: readonly WithdrawalTuple[] }
	| { cursor: WithdrawalCursor; ok: false; error: Error };

type Candidate = {
	cursor: WithdrawalCursor;
	id: bigint;
	request: WithdrawalTuple;
};

function asError(error: unknown, message: string): Error {
	return error instanceof Error ? error : new Error(message);
}

function isWithdrawalTuple(value: unknown): value is WithdrawalTuple {
	if (!value || typeof value !== 'object') return false;
	const tuple = value as Partial<WithdrawalTuple>;
	return (
		typeof tuple.epoch === 'bigint' &&
		typeof tuple.time === 'bigint' &&
		typeof tuple.amount === 'bigint'
	);
}

function sameWithdrawalTuple(detail: unknown, request: WithdrawalTuple): boolean {
	return (
		Array.isArray(detail) &&
		detail.length === 3 &&
		detail[0] === request.epoch &&
		detail[1] === request.time &&
		detail[2] === request.amount
	);
}

export default function useAddressDelegationWithdrawRequests(
	address: Address,
	lastValidatorId: bigint
): DelegationWithdrawRequestsQuery {
	const state = useStakingSession();
	const session = state.status === 'supported' ? state.session : undefined;
	const chainId = session?.chain.id;
	const scopeKey = chainId === undefined ? undefined : `dashboard:${chainId}`;
	const sfcAddress = session?.chain.contracts.sfc.address;
	const publicClient = usePublicClient({ chainId });
	const initialQueue = useMemo<readonly WithdrawalCursor[]>(() => {
		const queue: WithdrawalCursor[] = [];
		for (let validatorId = 1n; validatorId <= lastValidatorId; validatorId += 1n) {
			queue.push({ validatorId, offset: 0n });
		}
		return queue;
	}, [lastValidatorId]);
	const enabled = Boolean(session && publicClient && sfcAddress && initialQueue.length > 0);
	const queryKey = [
		'delegation-withdraw-requests',
		{
			scopeKey,
			chainId,
			address,
			lastValidatorId: lastValidatorId.toString()
		}
	] as const;

	const query = useInfiniteQuery({
		queryKey,
		enabled,
		initialPageParam: initialQueue,
		queryFn: async ({ pageParam }): Promise<WithdrawalPage> => {
			if (!publicClient || !sfcAddress) throw new Error('Contract client is unavailable.');
			const cursors = pageParam.slice(0, VALIDATORS_PER_QUERY_PAGE);
			const untouched = pageParam.slice(VALIDATORS_PER_QUERY_PAGE);
			const bulkResults: BulkResult[] = await Promise.all(
				cursors.map(async (cursor) => {
					try {
						const result = await publicClient.readContract({
							...getDelegationWithdrawRequests(
								address,
								cursor.validatorId,
								cursor.offset,
								REQUESTS_PER_VALIDATOR_PAGE
							),
							address: sfcAddress
						});
						if (!Array.isArray(result) || !result.every(isWithdrawalTuple)) {
							throw new Error('Invalid withdrawal request list response.');
						}
						return { cursor, ok: true as const, requests: result };
					} catch (error) {
						return {
							cursor,
							ok: false as const,
							error: asError(error, 'Unable to read withdrawal requests.')
						};
					}
				})
			);

			const failures: WithdrawalReadFailure[] = bulkResults
				.filter((result): result is Extract<BulkResult, { ok: false }> => !result.ok)
				.map(({ cursor, error }) => ({
					validatorId: cursor.validatorId,
					offset: cursor.offset,
					error
				}));
			const successfulBulkResults = bulkResults.filter(
				(result): result is Extract<BulkResult, { ok: true }> => result.ok
			);
			const candidates: Candidate[] = successfulBulkResults.flatMap(({ cursor, requests }) =>
				requests.flatMap((request, index) =>
					request.epoch !== 0n || request.time !== 0n || request.amount !== 0n
						? [{ cursor, id: cursor.offset + BigInt(index), request }]
						: []
				)
			);
			const verifiedRequests: DelegationWithdrawRequest[] = [];
			const failedCursors = new Set<string>(
				failures.map(({ validatorId, offset }) => `${validatorId}:${offset}`)
			);

			if (candidates.length > 0) {
				try {
					const details = await publicClient.multicall({
						allowFailure: true,
						contracts: candidates.map(({ cursor, id }) => ({
							abi: sfc,
							address: sfcAddress,
							functionName: 'getWithdrawalRequest' as const,
							args: [address, cursor.validatorId, id] as const
						}))
					});
					details.forEach((detail, index) => {
						const candidate = candidates[index];
						if (detail.status === 'success' && sameWithdrawalTuple(detail.result, candidate.request)) {
							verifiedRequests.push({
								id: candidate.id,
								validatorId: candidate.cursor.validatorId,
								...candidate.request
							});
							return;
						}
						const cursorKey = `${candidate.cursor.validatorId}:${candidate.cursor.offset}`;
						failedCursors.add(cursorKey);
						failures.push({
							validatorId: candidate.cursor.validatorId,
							offset: candidate.id,
							error:
								detail.status === 'failure'
									? detail.error
									: new Error('Withdrawal request detail did not match the list entry.')
						});
					});
				} catch (error) {
					for (const { cursor } of successfulBulkResults) {
						failedCursors.add(`${cursor.validatorId}:${cursor.offset}`);
						failures.push({
							validatorId: cursor.validatorId,
							offset: cursor.offset,
							error: asError(error, 'Unable to verify withdrawal requests.')
						});
					}
				}
			}

			const succeeded = failures.length === 0;
			const nextQueue: WithdrawalCursor[] = succeeded ? [...untouched] : [...pageParam];
			if (succeeded) {
				for (const { cursor, requests } of successfulBulkResults) {
					if (
						requests.length === Number(REQUESTS_PER_VALIDATOR_PAGE) &&
						!failedCursors.has(`${cursor.validatorId}:${cursor.offset}`)
					) {
						nextQueue.push({
							validatorId: cursor.validatorId,
							offset: cursor.offset + REQUESTS_PER_VALIDATOR_PAGE
						});
					}
				}
			}

			return { requests: verifiedRequests, failures, nextQueue, succeeded };
		},
		getNextPageParam: (lastPage) =>
			lastPage.succeeded && lastPage.nextQueue.length > 0 ? lastPage.nextQueue : undefined
	});

	const requestMap = new Map<string, DelegationWithdrawRequest>();
	for (const page of query.data?.pages ?? []) {
		for (const request of page.requests) {
			requestMap.set(`${request.validatorId}:${request.id}`, request);
		}
	}
	const failures = query.data?.pages.flatMap((page) => page.failures) ?? [];
	const lastPage = query.data?.pages.at(-1);
	const clientError = session && !publicClient ? new Error('Contract client is unavailable.') : null;
	const hasMore =
		lastValidatorId > 0n &&
		(lastPage === undefined || !lastPage.succeeded || lastPage.nextQueue.length > 0);

	return {
		data: [...requestMap.values()],
		isLoading: enabled && query.isLoading,
		isFetching: query.isFetching,
		error: query.error ?? clientError,
		failures,
		hasMore,
		isFetchingMore: query.isFetchingNextPage,
		refetch: async () => {
			if (enabled) await query.refetch();
		},
		loadMore: async () => {
			if (query.hasNextPage && !query.isFetchingNextPage) await query.fetchNextPage();
		}
	};
}
