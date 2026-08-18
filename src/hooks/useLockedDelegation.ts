import { useStakingSession } from '@/components/Contexts/StakingSession';
import SFCAbi from '@/config/contracts/sfc';
import { LockedDelegation } from '@/types/lockedDelegation';
import { ReadState } from '@/types/readState';
import { Address } from 'viem';
import { useReadContract } from 'wagmi';

export default function useLockedDelegation(
	address: Address | null,
	validatorId: bigint
): ReadState<LockedDelegation | null> {
	const state = useStakingSession();
	const session = state.status === 'supported' ? state.session : undefined;
	const lockupInfo = useReadContract({
		abi: SFCAbi,
		address: session?.chain.contracts.sfc.address,
		chainId: session?.chain.id,
		functionName: 'getLockupInfo',
		args: address ? [address, validatorId] : undefined,
		scopeKey: session ? `dashboard:${session.chain.id}` : undefined,
		query: { enabled: Boolean(session && address) }
	});
	const data =
		lockupInfo.error === null && lockupInfo.data && lockupInfo.data[3] !== 0n
			? {
					lockedStake: lockupInfo.data[0],
					fromEpoch: lockupInfo.data[1],
					endTime: lockupInfo.data[2],
					duration: lockupInfo.data[3]
				}
			: null;
	return {
		data,
		isLoading: lockupInfo.isLoading,
		isFetching: lockupInfo.isFetching,
		error: lockupInfo.error,
		failures: [],
		refetch: async () => {
			await lockupInfo.refetch();
		}
	};
}
