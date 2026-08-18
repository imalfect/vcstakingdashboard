import { useStakingSession } from '@/components/Contexts/StakingSession';
import SFCAbi from '@/config/contracts/sfc';
import { ReadState } from '@/types/readState';
import { useReadContract } from 'wagmi';

export default function useActiveValidators(epoch: bigint | null): ReadState<readonly bigint[]> {
	const state = useStakingSession();
	const session = state.status === 'supported' ? state.session : undefined;
	const activeValidators = useReadContract({
		abi: SFCAbi,
		address: session?.chain.contracts.sfc.address,
		chainId: session?.chain.id,
		functionName: 'getEpochValidatorIDs',
		args: [epoch ?? 0n],
		scopeKey: session ? `dashboard:${session.chain.id}` : undefined,
		query: { enabled: Boolean(session && epoch !== null) }
	});
	return {
		data:
			activeValidators.error === null && Array.isArray(activeValidators.data)
				? activeValidators.data
				: [],
		isLoading: activeValidators.isLoading,
		isFetching: activeValidators.isFetching,
		error: activeValidators.error,
		failures: [],
		refetch: async () => {
			await activeValidators.refetch();
		}
	};
}
