import { useStakingSession } from '@/components/Contexts/StakingSession';
import PaybackAbi from '@/config/contracts/payback';
import { Address } from 'viem';
import { useReadContract } from 'wagmi';

export default function usePaybackMinimumStake(paybackAddress: Address): {
	minimumStake: bigint | null;
	isLoading: boolean;
	isFetching: boolean;
	error: Error | null;
	refetch: () => Promise<void>;
} {
	const state = useStakingSession();
	const session = state.status === 'supported' ? state.session : undefined;
	const minimumStake = useReadContract({
		abi: PaybackAbi,
		address: paybackAddress,
		chainId: session?.chain.id,
		functionName: 'minStake',
		scopeKey: session ? `dashboard:${session.chain.id}` : undefined,
		query: { enabled: Boolean(session) }
	});

	return {
		minimumStake: typeof minimumStake.data === 'bigint' ? minimumStake.data : null,
		isLoading: minimumStake.isLoading,
		isFetching: minimumStake.isFetching,
		error: minimumStake.error,
		refetch: async () => {
			await minimumStake.refetch();
		}
	};
}
