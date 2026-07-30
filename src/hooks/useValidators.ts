import { useStakingSession } from '@/components/Contexts/StakingSession';
import SFCAbi from '@/config/contracts/sfc';
import StakeAbi from '@/config/contracts/stake';
import type { ReadState } from '@/types/readState';
import type Validator from '@/types/validator';
import dayjs from 'dayjs';
import { isAddress, type Address } from 'viem';
import { useReadContracts } from 'wagmi';

export type ValidatorReadFailure = {
	validatorId: bigint;
	operation: 'getValidator' | 'getSelfStake' | 'getInfo' | 'getLockupInfo';
	error: Error;
};

type ValidatorTuple = readonly [bigint, bigint, bigint, bigint, bigint, bigint, Address];
type LockupTuple = readonly [bigint, bigint, bigint, bigint];

function isValidatorTuple(value: unknown): value is ValidatorTuple {
	return (
		Array.isArray(value) &&
		value.length === 7 &&
		value.slice(0, 6).every((item) => typeof item === 'bigint') &&
		typeof value[6] === 'string' &&
		isAddress(value[6])
	);
}

function isLockupTuple(value: unknown): value is LockupTuple {
	return (
		Array.isArray(value) && value.length === 4 && value.every((item) => typeof item === 'bigint')
	);
}

function resultError(error: unknown, operation: ValidatorReadFailure['operation']): Error {
	return error instanceof Error ? error : new Error(`Invalid ${operation} response.`);
}

export default function useValidators(
	ids: readonly bigint[]
): ReadState<readonly (Validator | null)[], ValidatorReadFailure> {
	const state = useStakingSession();
	const session = state.status === 'supported' ? state.session : undefined;
	const uniqueIds = [...new Set(ids)];
	const sfcAddress = session?.chain.contracts.sfc.address;
	const stakeAddress = session?.chain.contracts.stake.address;
	const scopeKey = session ? `dashboard:${session.chain.id}` : undefined;
	const canRead = Boolean(session && sfcAddress && stakeAddress && uniqueIds.length > 0);

	const baseReads = useReadContracts({
		allowFailure: true,
		contracts:
			session && sfcAddress && stakeAddress
				? uniqueIds.flatMap((validatorId) => [
						{
							abi: SFCAbi,
							address: sfcAddress,
							chainId: session.chain.id,
							functionName: 'getValidator' as const,
							args: [validatorId] as const
						},
						{
							abi: SFCAbi,
							address: sfcAddress,
							chainId: session.chain.id,
							functionName: 'getSelfStake' as const,
							args: [validatorId] as const
						},
						{
							abi: StakeAbi,
							address: stakeAddress,
							chainId: session.chain.id,
							functionName: 'getInfo' as const,
							args: [validatorId] as const
						}
					])
				: [],
		scopeKey,
		query: { enabled: canRead }
	});

	const validatorAddresses = new Map<bigint, Address>();
	if (baseReads.data) {
		uniqueIds.forEach((validatorId, index) => {
			const validatorResult = baseReads.data?.[index * 3];
			if (validatorResult?.status === 'success' && isValidatorTuple(validatorResult.result)) {
				validatorAddresses.set(validatorId, validatorResult.result[6]);
			}
		});
	}
	const lockupIds = uniqueIds.filter((validatorId) => validatorAddresses.has(validatorId));
	const lockupReads = useReadContracts({
		allowFailure: true,
		contracts:
			session && sfcAddress
				? lockupIds.map((validatorId) => ({
						abi: SFCAbi,
						address: sfcAddress,
						chainId: session.chain.id,
						functionName: 'getLockupInfo' as const,
						args: [validatorAddresses.get(validatorId) as Address, validatorId] as const
					}))
				: [],
		scopeKey,
		query: { enabled: Boolean(session && sfcAddress && lockupIds.length > 0) }
	});

	const failures: ValidatorReadFailure[] = [];
	const validators = new Map<bigint, Validator>();
	if (baseReads.data) {
		uniqueIds.forEach((validatorId, index) => {
			const validatorResult = baseReads.data?.[index * 3];
			const selfStakeResult = baseReads.data?.[index * 3 + 1];
			const socialInfoResult = baseReads.data?.[index * 3 + 2];
			const lockupIndex = lockupIds.indexOf(validatorId);
			const lockupResult = lockupIndex === -1 ? undefined : lockupReads.data?.[lockupIndex];
			const validatorValid =
				validatorResult?.status === 'success' && isValidatorTuple(validatorResult.result);
			const selfStakeValid =
				selfStakeResult?.status === 'success' && typeof selfStakeResult.result === 'bigint';
			const socialInfoValid =
				socialInfoResult?.status === 'success' && typeof socialInfoResult.result === 'string';
			const lockupValid = lockupResult?.status === 'success' && isLockupTuple(lockupResult.result);

			if (!validatorValid && validatorResult) {
				failures.push({
					validatorId,
					operation: 'getValidator',
					error: resultError(
						validatorResult.status === 'failure' ? validatorResult.error : undefined,
						'getValidator'
					)
				});
			}
			if (!selfStakeValid && selfStakeResult) {
				failures.push({
					validatorId,
					operation: 'getSelfStake',
					error: resultError(
						selfStakeResult.status === 'failure' ? selfStakeResult.error : undefined,
						'getSelfStake'
					)
				});
			}
			if (!socialInfoValid && socialInfoResult) {
				failures.push({
					validatorId,
					operation: 'getInfo',
					error: resultError(
						socialInfoResult.status === 'failure' ? socialInfoResult.error : undefined,
						'getInfo'
					)
				});
			}
			if (validatorValid && lockupResult && !lockupValid) {
				failures.push({
					validatorId,
					operation: 'getLockupInfo',
					error: resultError(
						lockupResult.status === 'failure' ? lockupResult.error : undefined,
						'getLockupInfo'
					)
				});
			}
			if (!validatorValid || !selfStakeValid || !socialInfoValid || !lockupValid) return;

			const validatorInfo = validatorResult.result as ValidatorTuple;
			const selfStake = selfStakeResult.result as bigint;
			const socialInfoUrl = socialInfoResult.result as string;
			const lockupInfo = lockupResult.result as LockupTuple;
			validators.set(validatorId, {
				id: validatorId,
				status: validatorInfo[0],
				deactivated: validatorInfo[1] !== 0n,
				deactivatedTime: validatorInfo[1] !== 0n ? validatorInfo[1] : undefined,
				deactivatedEpoch: validatorInfo[2] !== 0n ? validatorInfo[2] : undefined,
				receivedStake: validatorInfo[3],
				createdEpoch: validatorInfo[4],
				createdTime: validatorInfo[5],
				auth: validatorInfo[6],
				selfStake,
				delegatedStake: validatorInfo[3] - selfStake,
				lockedSelfStake: lockupInfo[0],
				remainingLockedStakeDays: Math.max(0, dayjs.unix(Number(lockupInfo[2])).diff(dayjs(), 'days')),
				socialInfoUrl: socialInfoUrl || undefined
			});
		});
	}

	return {
		data: ids.map((validatorId) => validators.get(validatorId) ?? null),
		isLoading:
			canRead &&
			(baseReads.isLoading ||
				(baseReads.data !== undefined && lockupIds.length > 0 && lockupReads.isLoading)),
		isFetching: baseReads.isFetching || lockupReads.isFetching,
		error: baseReads.error ?? lockupReads.error,
		failures,
		refetch: async () => {
			await baseReads.refetch();
			if (lockupIds.length > 0) await lockupReads.refetch();
		}
	};
}
