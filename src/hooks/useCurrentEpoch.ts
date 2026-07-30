import { useStakingSession } from '@/components/Contexts/StakingSession';
import SFCAbi from '@/config/contracts/sfc';
import { ReadState } from '@/types/readState';
import { useReadContract } from 'wagmi';

export default function useCurrentEpoch(): ReadState<bigint | null> {
	const state = useStakingSession();
	const session = state.status === 'supported' ? state.session : undefined;
	const currentEpoch = useReadContract({
		abi: SFCAbi,
		address: session?.chain.contracts.sfc.address,
		chainId: session?.chain.id,
		functionName: 'currentEpoch',
		scopeKey: session ? `dashboard:${session.chain.id}` : undefined,
		query: { enabled: Boolean(session) }
	});
	return {
		data:
			currentEpoch.error === null && typeof currentEpoch.data === 'bigint' ? currentEpoch.data : null,
		isLoading: currentEpoch.isLoading,
		isFetching: currentEpoch.isFetching,
		error: currentEpoch.error,
		failures: [],
		refetch: async () => {
			await currentEpoch.refetch();
		}
	};
}
