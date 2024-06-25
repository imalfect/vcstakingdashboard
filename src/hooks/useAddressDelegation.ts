import sfc from '@/config/contracts/sfc';
import getLockupInfo from '@/generators/read/getLockupInfo';
import getPendingRewards from '@/generators/read/getPendingRewards';
import getUnlockedStake from '@/generators/read/getUnlockedStake';
import { Delegation } from '@/types/delegation';
import { VinuChain } from '@/types/vinuChain';
import { Address, Chain } from 'viem';
import { useClient, useReadContract } from 'wagmi';

export default function useAddressDelegation(address: Address, validatorId: bigint): Delegation {
	const client = useClient();
	const typedChain = client?.chain as (Chain & VinuChain) | undefined;
	const unlockedStake = useReadContract(
		getUnlockedStake(sfc, typedChain?.contracts.sfc.address || '0x0', validatorId, address)
	).data as bigint;
	const lockupInfo = useReadContract(
		getLockupInfo(sfc, typedChain?.contracts.sfc.address || '0x0', validatorId, address)
	).data as bigint[];
	const pendingReward = useReadContract(
		getPendingRewards(sfc, typedChain?.contracts.sfc.address || '0x0', BigInt(validatorId), address)
	).data as bigint;
	return {
		validatorId: validatorId,
		unlockedAmount: unlockedStake || 0n,
		lockedAmount: (lockupInfo && lockupInfo[0]) || 0n,
		totalAmount: (unlockedStake || 0n) + ((lockupInfo && lockupInfo[0]) || 0n),
		lockedDelegation:
			(lockupInfo && {
				lockedStake: lockupInfo[0],
				fromEpoch: lockupInfo[1],
				endTime: lockupInfo[2],
				duration: lockupInfo[3]
			}) ||
			null,
		claimableRewards: pendingReward
	} as Delegation;
}
