import { useStakingSession } from '@/components/Contexts/StakingSession';
import payback from '@/config/contracts/payback';
import { PaybackWithdrawRequest } from '@/types/paybackWithdrawRequest';
import { Address } from 'viem';
import { useReadContract } from 'wagmi';

export default function useAddressPaybackWithdrawRequests(
	address: Address,
	paybackAddress: Address
): {
	data: readonly PaybackWithdrawRequest[];
	isLoading: boolean;
	error: Error | null;
	refetch: () => Promise<void>;
} {
	const state = useStakingSession();
	const session = state.status === 'supported' ? state.session : undefined;
	const scopeKey = session ? `dashboard:${session.chain.id}` : undefined;
	const enabled = Boolean(session);
	const activeWithdrawRequestsCount = useReadContract({
		address: paybackAddress,
		abi: payback,
		chainId: session?.chain.id,
		functionName: 'getNumberOfActiveWithdrawalRequestIDs',
		args: [address],
		scopeKey,
		query: { enabled }
	});
	const count =
		typeof activeWithdrawRequestsCount.data === 'bigint' ? activeWithdrawRequestsCount.data : null;
	const activeWithdrawRequests = useReadContract({
		address: paybackAddress,
		abi: payback,
		chainId: session?.chain.id,
		functionName: 'getActiveWrRequests',
		args: [address, 0n, count ?? 0n],
		scopeKey,
		query: { enabled: enabled && count !== null && count > 0n }
	});
	const data =
		count === 0n
			? []
			: (activeWithdrawRequests.data ?? []).map((request) => ({
					id: request.id,
					time: request.time,
					amount: request.amount,
					unlockTime: request.unlockTime,
					completed: request.completed
				}));

	return {
		data,
		isLoading:
			activeWithdrawRequestsCount.isLoading ||
			(count !== null && count > 0n && activeWithdrawRequests.isLoading),
		error: activeWithdrawRequestsCount.error ?? activeWithdrawRequests.error,
		refetch: async () => {
			await activeWithdrawRequestsCount.refetch();
			if (count !== null && count > 0n) await activeWithdrawRequests.refetch();
		}
	};
}
