import sfc from '@/config/contracts/sfc';
import getLockupInfo from '@/generators/read/getLockupInfo';
import getPendingRewards from '@/generators/read/getPendingRewards';
import getUnlockedStake from '@/generators/read/getUnlockedStake';
import useLastValidatorId from '@/hooks/useLastValidatorId';
import { Delegation } from '@/types/delegation';
import { VinuChain } from '@/types/vinuChain';
import { Address, Chain } from 'viem';
import { useClient, useReadContracts } from 'wagmi';

export default function useAddressDelegations(address: Address): Delegation[] {
	const client = useClient();
	const typedChain = client?.chain as (Chain & VinuChain) | undefined;
	const lastValidatorId = useLastValidatorId();
	const validatorIds = Array.from({ length: Number(lastValidatorId) }, (_, i) => i + 1);
	const unlockedStakes = useReadContracts({
		contracts: validatorIds.map((validatorId) =>
			getUnlockedStake(sfc, typedChain?.contracts.sfc.address || '0x0', BigInt(validatorId), address)
		)
	});
	const lockupInfos = useReadContracts({
		contracts: validatorIds.map((validatorId) =>
			getLockupInfo(sfc, typedChain?.contracts.sfc.address || '0x0', BigInt(validatorId), address)
		)
	});
	const pendingRewards = useReadContracts({
		contracts: validatorIds.map((validatorId) =>
			getPendingRewards(sfc, typedChain?.contracts.sfc.address || '0x0', BigInt(validatorId), address)
		)
	});
	return validatorIds
		.map((validatorId, index) => {
			const unlockedStake = // @ts-ignore
				unlockedStakes.data && (unlockedStakes.data[index].result as unknown as bigint);
			const lockupInfo = lockupInfos.data && (lockupInfos.data[index].result as unknown as bigint[]);
			const pendingReward =
				pendingRewards.data && (pendingRewards.data[index].result as unknown as bigint);
			if ((unlockedStake || 0n) + ((lockupInfo && lockupInfo[0]) || 0n) === 0n) {
				return null;
			}
			return {
				validatorId: BigInt(validatorId),
				unlockedAmount: unlockedStake,
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
		})
		.filter((delegation) => delegation !== null) as Delegation[];
}
