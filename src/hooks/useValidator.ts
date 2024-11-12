import SFCAbi from '@/config/contracts/sfc';
import StakeAbi from '@/config/contracts/stake';
import Validator from '@/types/validator';
import { VinuChain } from '@/types/vinuChain';
import dayjs from 'dayjs';
import { Chain } from 'viem';
import { useClient, useReadContract, useReadContracts } from 'wagmi';

export default function useValidator(validatorId: bigint): Validator | null {
	const client = useClient();
	const typedChain = client?.chain as (Chain & VinuChain) | undefined;
	const sfcContract = {
		address: typedChain?.contracts.sfc.address,
		abi: SFCAbi
	};
	const stakeContract = {
		address: typedChain?.contracts.stake.address,
		abi: StakeAbi
	};
	const validatorData = useReadContracts({
		contracts: [
			{
				...sfcContract,
				functionName: 'getValidator',
				args: [validatorId]
			},
			{
				...sfcContract,
				functionName: 'getSelfStake',
				args: [validatorId]
			},
			{
				...stakeContract,
				functionName: 'getInfo',
				args: [validatorId]
			}
		]
	});
	const validatorInfo = validatorData.data && validatorData.data[0].result;
	const selfStake = validatorData.data && validatorData.data[1].result;
	const socialInfo = validatorData.data && validatorData.data[2].result;
	const lockupInfo = useReadContract({
		...sfcContract,
		functionName: 'getLockupInfo',
		args: [(validatorInfo && validatorInfo[6]) || '0x0', validatorId]
	}).data;
	if (!validatorInfo || !selfStake || !lockupInfo) {
		return null;
	}
	return {
		id: validatorId,
		status: validatorInfo[0],
		deactivated: validatorInfo[1] !== 0n,
		deactivatedTime: validatorInfo[1] !== 0n ? validatorInfo[2] : undefined,
		deactivatedEpoch: validatorInfo[2] !== 0n ? validatorInfo[3] : undefined,
		receivedStake: validatorInfo[3],
		createdEpoch: validatorInfo[4],
		createdTime: validatorInfo[5],
		auth: validatorInfo[6],
		selfStake: selfStake,
		delegatedStake: validatorInfo[3] - selfStake,
		lockedSelfStake: lockupInfo[0],
		remainingLockedStakeDays: Math.max(0, Math.floor(dayjs.unix(Number(lockupInfo[2])).diff(dayjs(), 'days'))),
		socialInfoUrl: socialInfo
	};
}
