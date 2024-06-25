import SFCAbi from '@/config/contracts/sfc';
import { VinuChain } from '@/types/vinuChain';
import { Chain } from 'viem';
import { useClient, useReadContract } from 'wagmi';

export default function useActiveValidators(epoch: bigint) {
	const client = useClient();
	const typedChain = client?.chain as (Chain & VinuChain) | undefined;
	const activeValidators = useReadContract({
		abi: SFCAbi,
		address: typedChain?.contracts.sfc.address,
		functionName: 'getEpochValidatorIDs',
		args: [epoch]
	});
	return activeValidators.data as bigint[] | [];
}
