import { EPOCH_DURATION_SECONDS } from '@/config/constants';
import useBaseRewardPerSecond from '@/hooks/useBaseRewardPerSecond';
import useCurrentEpoch from '@/hooks/useCurrentEpoch';
import useEpochSnapshot from '@/hooks/useEpochSnapshot';
import BigNumber from 'bignumber.js';

export default function useApproximateDelegationRewards(stake: bigint, lockDuration?: number) {
	const baseRPS = Number(useBaseRewardPerSecond()) / 1e18;
	const newstake = Number(stake) / 1e18;
	const currentEpoch = useCurrentEpoch();
	const lastEpochSnapshot = useEpochSnapshot(currentEpoch - 1n);

	const percentage = Number(0.3) + Number(0.00191780785714286) * (Math.abs(lockDuration || 0));

	if (!baseRPS || !lastEpochSnapshot) return null;
	if (stake === 0n) return null;

	const rewardPerEpoch = (((EPOCH_DURATION_SECONDS) * (baseRPS)) * (newstake / Number(lastEpochSnapshot.totalBaseRewardWeight)) * (Number(percentage) * (1 - 0.15)));

	const rewardsPerDay = rewardPerEpoch * (6);
	
	return {
		rewardPerEpoch: (rewardPerEpoch.toFixed(0)),
		rewardsPerDay: (rewardsPerDay.toFixed(0)),
		apr: ((rewardsPerDay * (365) / (Number(newstake) / 1e18)) * (100)).toFixed(2)
	};
}

//Total Delegator Reward = Delegator Reward + Delegator Fees
//
// Delegator Reward per epoch (locked stake):
// delegator_BaseReward = (epochDuration * baseRewardPerSecond) * [(delegatorStake * (validatorEpochUptime/epochDuration)^2) / totalBaseRewardWeight] * (1 - 0.15)
//
// Delegator Reward per epoch (unlocked stake):
// delegator_BaseReward = (epochDuration * baseRewardPerSecond) * [(delegatorStake * (validatorEpochUptime/epochDuration)^2) / totalBaseRewardWeight] * 0.30 * (1 - 0.15)


