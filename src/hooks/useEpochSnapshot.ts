import { useStakingSession } from '@/components/Contexts/StakingSession';
import SFCAbi from '@/config/contracts/sfc';
import { ReadState } from '@/types/readState';
import { useReadContract } from 'wagmi';

export type EpochSnapshot = {
	endTime: bigint;
	epochFee: bigint;
	totalBaseRewardWeight: bigint;
	totalTxRewardWeight: bigint;
	baseRewardPerSecond: bigint;
	totalStake: bigint;
	totalSupply: bigint;
};

export default function useEpochSnapshot(epoch: bigint | null): ReadState<EpochSnapshot | null> {
	const state = useStakingSession();
	const session = state.status === 'supported' ? state.session : undefined;
	const epochSnapshot = useReadContract({
		abi: SFCAbi,
		address: session?.chain.contracts.sfc.address,
		chainId: session?.chain.id,
		functionName: 'getEpochSnapshot',
		args: [epoch ?? 0n],
		scopeKey: session ? `dashboard:${session.chain.id}` : undefined,
		query: { enabled: Boolean(session && epoch !== null && epoch >= 0n) }
	});
	const data =
		epochSnapshot.error === null && epochSnapshot.data && epochSnapshot.data[0] !== 0n
			? {
					endTime: epochSnapshot.data[0],
					epochFee: epochSnapshot.data[1],
					totalBaseRewardWeight: epochSnapshot.data[2],
					totalTxRewardWeight: epochSnapshot.data[3],
					baseRewardPerSecond: epochSnapshot.data[4],
					totalStake: epochSnapshot.data[5],
					totalSupply: epochSnapshot.data[6]
				}
			: null;
	return {
		data,
		isLoading: epochSnapshot.isLoading,
		isFetching: epochSnapshot.isFetching,
		error: epochSnapshot.error,
		failures: [],
		refetch: async () => {
			await epochSnapshot.refetch();
		}
	};
}
