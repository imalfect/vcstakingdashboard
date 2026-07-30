import { useStakingSession } from '@/components/Contexts/StakingSession';
import SFCAbi from '@/config/contracts/sfc';
import { ReadState } from '@/types/readState';
import { useReadContract } from 'wagmi';

export default function useLastValidatorId(): ReadState<bigint | null> {
	const state = useStakingSession();
	const session = state.status === 'supported' ? state.session : undefined;
	const lastValidatorId = useReadContract({
		abi: SFCAbi,
		address: session?.chain.contracts.sfc.address,
		chainId: session?.chain.id,
		functionName: 'lastValidatorID',
		scopeKey: session ? `dashboard:${session.chain.id}` : undefined,
		query: { enabled: Boolean(session) }
	});
	return {
		data:
			lastValidatorId.error === null && typeof lastValidatorId.data === 'bigint'
				? lastValidatorId.data
				: null,
		isLoading: lastValidatorId.isLoading,
		isFetching: lastValidatorId.isFetching,
		error: lastValidatorId.error,
		failures: [],
		refetch: async () => {
			await lastValidatorId.refetch();
		}
	};
}
