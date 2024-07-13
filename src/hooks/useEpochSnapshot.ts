import SFCAbi from '@/config/contracts/sfc';
import { VinuChain } from '@/types/vinuChain';
import { Chain } from 'viem';
import { useClient, useReadContract } from 'wagmi';

export default function useEpochSnapshot(epoch: bigint) {
	const client = useClient();
	const typedChain = client?.chain as (Chain & VinuChain) | undefined;
	const epochSnapshot = useReadContract({
		abi: SFCAbi,
		address: typedChain?.contracts.sfc.address,
		functionName: 'getEpochSnapshot',
		args: [epoch]
	});
	if (!epochSnapshot.data || epochSnapshot.data[0] === 0n) return null;
	return {
		endTime: epochSnapshot.data[0] as bigint,
		epochFee: epochSnapshot.data[1] as bigint,
		totalBaseRewardWeight: epochSnapshot.data[2] as bigint,
		totalTxRewardWeight: epochSnapshot.data[3] as bigint,
		baseRewardPerSecond: epochSnapshot.data[4] as bigint,
		totalStake: epochSnapshot.data[5] as bigint,
		totalSupply: epochSnapshot.data[6] as bigint
	};
}
