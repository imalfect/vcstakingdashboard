import { usePaybackContractAddress } from '@/components/Contexts/PaybackCapability';
import { useStakingSession } from '@/components/Contexts/StakingSession';
import PaybackABI from '@/config/contracts/payback';
import { ReadState } from '@/types/readState';
import { useReadContract } from 'wagmi';

export default function useTotalPaybackStake(): ReadState<bigint | null> {
	const state = useStakingSession();
	const session = state.status === 'supported' ? state.session : undefined;
	const paybackAddress = usePaybackContractAddress();
	const totalStake = useReadContract({
		abi: PaybackABI,
		address: paybackAddress,
		chainId: session?.chain.id,
		functionName: 'totalStake',
		scopeKey: session ? `dashboard:${session.chain.id}` : undefined,
		query: { enabled: Boolean(session && paybackAddress) }
	});
	return {
		data: totalStake.error === null && typeof totalStake.data === 'bigint' ? totalStake.data : null,
		isLoading: totalStake.isLoading,
		isFetching: totalStake.isFetching,
		error: totalStake.error,
		failures: [],
		refetch: async () => {
			await totalStake.refetch();
		}
	};
}
