import SFCAbi from '@/config/contracts/sfc';
import { VinuChain } from '@/types/vinuChain';
import { Chain } from 'viem';
import { useClient, useReadContract } from 'wagmi';

export default function useLastValidatorId() {
	const client = useClient();
	const typedChain = client?.chain as (Chain & VinuChain) | undefined;
	const lastValidatorId = useReadContract({
		abi: SFCAbi,
		address: typedChain?.contracts.sfc.address,
		functionName: 'lastValidatorID'
	});
	return lastValidatorId.data as bigint | null;
}
