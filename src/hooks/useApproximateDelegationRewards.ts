import { EPOCH_DURATION_SECONDS } from '@/config/constants';
import useBaseRewardPerSecond from '@/hooks/useBaseRewardPerSecond';
import useCurrentEpoch from '@/hooks/useCurrentEpoch';
import useEpochSnapshot from '@/hooks/useEpochSnapshot';
import BigNumber from 'bignumber.js';

export default function useApproximateDelegationRewards(stake: bigint, lockDuration?: number) {
	const baseRPS = useBaseRewardPerSecond();
	const currentEpoch = useCurrentEpoch();
	const lastEpochSnapshot = useEpochSnapshot(currentEpoch - 1n);
	const percentage = 0.3 + 0.00191780785714286 * ((lockDuration || 0) / 86400);
	if (!baseRPS || !lastEpochSnapshot) return null;
	if (stake === 0n) return null;

	// @ts-ignore bignumber supports bigint
	const rewardPerEpoch = new BigNumber(EPOCH_DURATION_SECONDS)
		// @ts-ignore
		.times(baseRPS)
		.times(
			// @ts-ignore
			new BigNumber(stake).shiftedBy(18).div(lastEpochSnapshot.totalBaseRewardWeight)
		)
		.times(percentage)
		.times(1 - 0.15);
	console.log(rewardPerEpoch);
	const rewardsPerDay = rewardPerEpoch.times(86400 / Number(EPOCH_DURATION_SECONDS));
	return {
		rewardPerEpoch: BigInt(rewardPerEpoch.toFixed(0)),
		rewardsPerDay: BigInt(rewardsPerDay.toFixed(0)),
		apr: rewardsPerDay.times(365).div(new BigNumber(stake).shiftedBy(18)).times(100).toFixed(2)
	};
}

//Total Delegator Reward = Delegator Reward + Delegator Fees
//
// Delegator Reward per epoch (locked stake):
// delegator_BaseReward = (epochDuration * baseRewardPerSecond) * [(delegatorStake * (validatorEpochUptime/epochDuration)^2) / totalBaseRewardWeight] * (1 - 0.15)
//
// Delegator Reward per epoch (unlocked stake):
// delegator_BaseReward = (epochDuration * baseRewardPerSecond) * [(delegatorStake * (validatorEpochUptime/epochDuration)^2) / totalBaseRewardWeight] * 0.30 * (1 - 0.15)
