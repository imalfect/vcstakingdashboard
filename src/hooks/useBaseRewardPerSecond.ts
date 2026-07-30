import { useStakingSession } from '@/components/Contexts/StakingSession';
import SFCAbi from '@/config/contracts/sfc';
import { ReadState } from '@/types/readState';
import { useReadContract } from 'wagmi';

export default function useBaseRewardPerSecond(enabled = true): ReadState<bigint | null> {
	const state = useStakingSession();
	const session = state.status === 'supported' ? state.session : undefined;
	const baseRPS = useReadContract({
		abi: SFCAbi,
		address: session?.chain.contracts.sfc.address,
		chainId: session?.chain.id,
		functionName: 'baseRewardPerSecond',
		scopeKey: session ? `dashboard:${session.chain.id}` : undefined,
		query: { enabled: Boolean(session && enabled) }
	});
	return {
		data: baseRPS.error === null && typeof baseRPS.data === 'bigint' ? baseRPS.data : null,
		isLoading: baseRPS.isLoading,
		isFetching: baseRPS.isFetching,
		error: baseRPS.error,
		failures: [],
		refetch: async () => {
			await baseRPS.refetch();
		}
	};
}
