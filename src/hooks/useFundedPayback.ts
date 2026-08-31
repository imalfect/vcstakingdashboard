import { useStakingSession } from '@/components/Contexts/StakingSession';
import payback from '@/config/contracts/payback';
import { Address } from 'viem';
import { useReadContract } from 'wagmi';

export default function useFundedPayback(
	paybackAddress: Address,
	staker: Address,
	delegator: Address,
	enabled = true
) {
	const state = useStakingSession();
	const session = state.status === 'supported' ? state.session : undefined;
	const fundedStake = useReadContract({
		abi: payback,
		address: paybackAddress,
		chainId: session?.chain.id,
		functionName: 'getFundedStake',
		args: [staker, delegator],
		scopeKey: session ? `dashboard:${session.chain.id}` : undefined,
		query: { enabled: Boolean(session && enabled) }
	});

	return {
		stake: typeof fundedStake.data === 'bigint' ? fundedStake.data : 0n,
		isLoading: enabled && fundedStake.isLoading,
		isFetching: enabled && fundedStake.isFetching,
		error: enabled ? fundedStake.error : null,
		refetch: async () => {
			if (enabled) await fundedStake.refetch();
		}
	};
}
