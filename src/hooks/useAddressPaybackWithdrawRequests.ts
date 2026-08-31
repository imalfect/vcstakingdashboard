import { useStakingSession } from '@/components/Contexts/StakingSession';
import payback from '@/config/contracts/payback';
import { PaybackWithdrawRequest } from '@/types/paybackWithdrawRequest';
import { Address } from 'viem';
import { useReadContract, useReadContracts } from 'wagmi';

export default function useAddressPaybackWithdrawRequests(
	address: Address,
	paybackAddress: Address,
	includeDelegators = true
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
	const requests =
		count === 0n
			? []
			: (activeWithdrawRequests.data ?? []).map((request) => ({
					id: request.id,
					time: request.time,
					amount: request.amount,
					unlockTime: request.unlockTime,
					completed: request.completed
				}));
	const withdrawalDelegators = useReadContracts({
		contracts: includeDelegators
			? requests.map((request) => ({
					address: paybackAddress,
					abi: payback,
					chainId: session?.chain.id,
					functionName: 'getWithdrawalRequestDelegator' as const,
					args: [address, request.id] as const
				}))
			: [],
		scopeKey,
		query: { enabled: enabled && includeDelegators && requests.length > 0 }
	});
	const data = requests.map((request, index) => {
		const delegator = withdrawalDelegators.data?.[index]?.result;
		return {
			...request,
			...(includeDelegators && typeof delegator === 'string'
				? { delegator: delegator as Address }
				: {})
		};
	});

	return {
		data,
		isLoading:
			activeWithdrawRequestsCount.isLoading ||
			(count !== null && count > 0n && activeWithdrawRequests.isLoading) ||
			(includeDelegators && requests.length > 0 && withdrawalDelegators.isLoading),
		error:
			activeWithdrawRequestsCount.error ??
			activeWithdrawRequests.error ??
			(includeDelegators ? withdrawalDelegators.error : null),
		refetch: async () => {
			await activeWithdrawRequestsCount.refetch();
			if (count !== null && count > 0n) await activeWithdrawRequests.refetch();
			if (includeDelegators && requests.length > 0) await withdrawalDelegators.refetch();
		}
	};
}
