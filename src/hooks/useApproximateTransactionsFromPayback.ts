import { useStakingSession } from '@/components/Contexts/StakingSession';
import { useGasPrice } from 'wagmi';

export default function useApproximateTransactionsFromPayback(
	payback: bigint,
	gasPerTransaction: bigint
): bigint {
	const state = useStakingSession();
	const session = state.status === 'supported' ? state.session : undefined;
	const gasPrice = useGasPrice({
		chainId: session?.chain.id,
		scopeKey: session ? `dashboard:${session.chain.id}` : undefined,
		query: { enabled: Boolean(session) }
	});
	if (!gasPrice.data || gasPrice.data === 0n) return 0n;
	return payback / (gasPerTransaction * gasPrice.data);
}
