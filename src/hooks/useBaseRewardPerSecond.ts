import SFCAbi from '@/config/contracts/sfc';
import { VinuChain } from '@/types/vinuChain';
import { Chain } from 'viem';
import { useClient, useReadContract } from 'wagmi';

export default function useBaseRewardPerSecond() {
	const client = useClient();
	const typedChain = client?.chain as (Chain & VinuChain) | undefined;
	const baseRPS = useReadContract({
		abi: SFCAbi,
		address: typedChain?.contracts.sfc.address,
		functionName: 'baseRewardPerSecond'
	});
	return (baseRPS.data as bigint) || 0n;
}
