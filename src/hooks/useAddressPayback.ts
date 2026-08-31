import { usePaybackContractAddress } from '@/components/Contexts/PaybackCapability';
import { useStakingSession } from '@/components/Contexts/StakingSession';
import PaybackAbi from '@/config/contracts/payback';
import { Address } from 'viem';
import { useReadContract } from 'wagmi';

export default function useAddressPayback(
	address: Address,
	contractAddress?: Address,
	supportsSponsoredStaking = true
): {
	stake: bigint;
	ownedStake: bigint;
	isLoading: boolean;
	error: Error | null;
	refetch: () => Promise<void>;
} {
	const state = useStakingSession();
	const session = state.status === 'supported' ? state.session : undefined;
	const configuredPaybackAddress = usePaybackContractAddress();
	const paybackAddress = contractAddress ?? configuredPaybackAddress;
	const addressPayback = useReadContract({
		abi: PaybackAbi,
		address: paybackAddress,
		chainId: session?.chain.id,
		args: [address],
		functionName: 'getStake',
		scopeKey: session ? `dashboard:${session.chain.id}` : undefined,
		query: { enabled: Boolean(session && paybackAddress) }
	});
	const fundedPayback = useReadContract({
		abi: PaybackAbi,
		address: paybackAddress,
		chainId: session?.chain.id,
		args: [address, address],
		functionName: 'getFundedStake',
		scopeKey: session ? `dashboard:${session.chain.id}` : undefined,
		query: { enabled: Boolean(session && paybackAddress && supportsSponsoredStaking) }
	});
	const stake = typeof addressPayback.data === 'bigint' ? addressPayback.data : 0n;

	return {
		stake,
		ownedStake:
			supportsSponsoredStaking && typeof fundedPayback.data === 'bigint' ? fundedPayback.data : stake,
		isLoading: addressPayback.isLoading || (supportsSponsoredStaking && fundedPayback.isLoading),
		error: addressPayback.error ?? (supportsSponsoredStaking ? fundedPayback.error : null),
		refetch: async () => {
			await Promise.all([
				addressPayback.refetch(),
				...(supportsSponsoredStaking ? [fundedPayback.refetch()] : [])
			]);
		}
	};
}
