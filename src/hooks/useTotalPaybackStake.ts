import PaybackABI from '@/config/contracts/payback';
import { VinuChain } from '@/types/vinuChain';
import { Chain } from 'viem';
import { useClient, useReadContract } from 'wagmi';

export default function useTotalPaybackStake(): bigint {
	const client = useClient();
	const typedChain = client?.chain as (Chain & VinuChain) | undefined;
	const totalStake = useReadContract({
		abi: PaybackABI,
		address: typedChain?.contracts.payback.address,
		functionName: 'totalStake'
	});
	if (!totalStake.data) return 0n;
	return totalStake.data;
}
