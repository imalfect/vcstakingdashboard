import SFCAbi from '@/config/contracts/sfc';
import { LockedDelegation } from '@/types/lockedDelegation';
import { VinuChain } from '@/types/vinuChain';
import { Address, Chain } from 'viem';
import { useClient, useReadContract } from 'wagmi';

export default function useLockedDelegation(
	address: Address | null,
	validatorId: bigint
): LockedDelegation | null {
	const client = useClient();
	const typedChain = client?.chain as (Chain & VinuChain) | undefined;
	const activeValidators = useReadContract({
		abi: SFCAbi,
		address: typedChain?.contracts.sfc.address,
		functionName: 'getLockupInfo',
		args: [address || '0x0', validatorId]
	});
	if (!activeValidators.data) return null;
	if (activeValidators.data[3] === 0n) return null;
	return {
		lockedStake: activeValidators.data[0],
		fromEpoch: activeValidators.data[1],
		endTime: activeValidators.data[2],
		duration: activeValidators.data[3]
	};
}
