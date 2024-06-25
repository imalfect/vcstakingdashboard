import SFCAbi from '@/config/contracts/sfc';
import { VinuChain } from '@/types/vinuChain';
import { Chain } from 'viem';
import { useClient, useReadContract } from 'wagmi';

export default function useCurrentEpoch() {
	const client = useClient();
	const typedChain = client?.chain as (Chain & VinuChain) | undefined;
	const currentEpoch = useReadContract({
		abi: SFCAbi,
		address: typedChain?.contracts.sfc.address,
		functionName: 'currentEpoch'
	});
	return (currentEpoch.data as bigint) || 0n;
}
