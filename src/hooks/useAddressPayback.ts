import { usePaybackContractAddress } from '@/components/Contexts/PaybackCapability';
import { useStakingSession } from '@/components/Contexts/StakingSession';
import PaybackAbi from '@/config/contracts/payback';
import { Address } from 'viem';
import { useReadContract } from 'wagmi';

export default function useAddressPayback(address: Address): {
	stake: bigint;
	isLoading: boolean;
	error: Error | null;
	refetch: () => Promise<void>;
} {
	const state = useStakingSession();
	const session = state.status === 'supported' ? state.session : undefined;
	const paybackAddress = usePaybackContractAddress();
	const addressPayback = useReadContract({
		abi: PaybackAbi,
		address: paybackAddress,
		chainId: session?.chain.id,
		args: [address],
		functionName: 'getStake',
		scopeKey: session ? `dashboard:${session.chain.id}` : undefined,
		query: { enabled: Boolean(session && paybackAddress) }
	});

	return {
		stake: typeof addressPayback.data === 'bigint' ? addressPayback.data : 0n,
		isLoading: addressPayback.isLoading,
		error: addressPayback.error,
		refetch: async () => {
			await addressPayback.refetch();
		}
	};
}
