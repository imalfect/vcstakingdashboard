import { useStakingSession } from '@/components/Contexts/StakingSession';
import sfc from '@/config/contracts/sfc';
import getLockupInfo from '@/generators/read/getLockupInfo';
import getPendingRewards from '@/generators/read/getPendingRewards';
import getUnlockedStake from '@/generators/read/getUnlockedStake';
import useLastValidatorId from '@/hooks/useLastValidatorId';
import { Delegation } from '@/types/delegation';
import { ReadState } from '@/types/readState';
import { Address } from 'viem';
import { useReadContracts } from 'wagmi';

function isLockupInfo(result: unknown): result is readonly [bigint, bigint, bigint, bigint] {
	return (
		Array.isArray(result) && result.length === 4 && result.every((value) => typeof value === 'bigint')
	);
}

export type DelegationReadFailure = {
	validatorId: bigint;
	operation: 'getUnlockedStake' | 'getLockupInfo' | 'pendingRewards';
	error: Error;
};

const operationNames: readonly DelegationReadFailure['operation'][] = [
	'getUnlockedStake',
	'getLockupInfo',
	'pendingRewards'
];

function asError(error: unknown, operation: DelegationReadFailure['operation']): Error {
	return error instanceof Error ? error : new Error(`Invalid ${operation} response.`);
}

export default function useAddressDelegations(
	address: Address
): ReadState<readonly Delegation[], DelegationReadFailure> {
	const state = useStakingSession();
	const session = state.status === 'supported' ? state.session : undefined;
	const lastValidatorId = useLastValidatorId();
	const validatorIds: bigint[] = [];
	if (lastValidatorId.data !== null && lastValidatorId.error === null) {
		for (let validatorId = 1n; validatorId <= lastValidatorId.data; validatorId += 1n) {
			validatorIds.push(validatorId);
		}
	}
	const sfcAddress = session?.chain.contracts.sfc.address;
	const canRead =
		Boolean(session && sfcAddress && address) &&
		lastValidatorId.data !== null &&
		lastValidatorId.error === null;
	const scopeKey = session ? `dashboard:${session.chain.id}` : undefined;
	const delegations = useReadContracts({
		allowFailure: true,
		contracts:
			session && sfcAddress
				? validatorIds.flatMap((validatorId) => [
						{
							...getUnlockedStake(sfc, sfcAddress, validatorId, address),
							chainId: session.chain.id
						},
						{
							...getLockupInfo(sfc, sfcAddress, validatorId, address),
							chainId: session.chain.id
						},
						{
							...getPendingRewards(sfc, sfcAddress, validatorId, address),
							chainId: session.chain.id
						}
					])
				: [],
		scopeKey,
		query: { enabled: canRead && validatorIds.length > 0 }
	});

	const data: Delegation[] = [];
	const failures: DelegationReadFailure[] = [];
	if (delegations.data) {
		validatorIds.forEach((validatorId, validatorIndex) => {
			const results = delegations.data?.slice(validatorIndex * 3, validatorIndex * 3 + 3);
			if (!results || results.length !== 3) return;

			const unlockedStakeResult = results[0];
			const lockupInfoResult = results[1];
			const pendingRewardResult = results[2];
			if (
				unlockedStakeResult.status !== 'success' ||
				typeof unlockedStakeResult.result !== 'bigint' ||
				lockupInfoResult.status !== 'success' ||
				!isLockupInfo(lockupInfoResult.result) ||
				pendingRewardResult.status !== 'success' ||
				typeof pendingRewardResult.result !== 'bigint'
			) {
				results.forEach((result, operationIndex) => {
					const operation = operationNames[operationIndex];
					const valid =
						result.status === 'success' &&
						(operation === 'getLockupInfo'
							? isLockupInfo(result.result)
							: typeof result.result === 'bigint');
					if (!valid) {
						failures.push({
							validatorId,
							operation,
							error: asError(result.status === 'failure' ? result.error : undefined, operation)
						});
					}
				});
				return;
			}

			const unlockedStake = unlockedStakeResult.result;
			const lockupInfo = lockupInfoResult.result;
			const pendingReward = pendingRewardResult.result;
			const lockedAmount = lockupInfo[0];
			if (unlockedStake + lockedAmount === 0n) return;

			data.push({
				validatorId,
				unlockedAmount: unlockedStake,
				lockedAmount,
				totalAmount: unlockedStake + lockedAmount,
				lockedDelegation: {
					lockedStake: lockupInfo[0],
					fromEpoch: lockupInfo[1],
					endTime: lockupInfo[2],
					duration: lockupInfo[3]
				},
				claimableRewards: pendingReward
			});
		});
	}

	return {
		data,
		isLoading:
			lastValidatorId.isLoading || (canRead && validatorIds.length > 0 && delegations.isLoading),
		isFetching: lastValidatorId.isFetching || delegations.isFetching,
		error: lastValidatorId.error ?? delegations.error,
		failures,
		refetch: async () => {
			if (lastValidatorId.data === null || lastValidatorId.error) {
				await lastValidatorId.refetch();
			} else if (canRead && validatorIds.length > 0) {
				await delegations.refetch();
			}
		}
	};
}
