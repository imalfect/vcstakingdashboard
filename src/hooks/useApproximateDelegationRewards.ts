import { EPOCH_DURATION_SECONDS } from '@/config/constants';
import useBaseRewardPerSecond from '@/hooks/useBaseRewardPerSecond';
import useCurrentEpoch from '@/hooks/useCurrentEpoch';
import useEpochSnapshot from '@/hooks/useEpochSnapshot';
import BigNumber from 'bignumber.js';

export default function useApproximateDelegationRewards(stake: bigint, lockDuration?: number) {
	const baseRPS = useBaseRewardPerSecond();
	console.log(`Base reward per second is ${baseRPS}`);
	const currentEpoch = useCurrentEpoch();
	const lastEpochSnapshot = useEpochSnapshot(currentEpoch - 1n);
	console.log(lockDuration);
	const percentage = new BigNumber('0.3').plus(
		new BigNumber('0.00191780785714286').times(new BigNumber(lockDuration || 0).div(86400))
	);
	if (!baseRPS || !lastEpochSnapshot) return null;
	if (stake === 0n) return null;

	const rewardPerEpoch = new BigNumber(EPOCH_DURATION_SECONDS)
		.times(baseRPS.toString())
		.times(new BigNumber(stake.toString()).div(lastEpochSnapshot.totalBaseRewardWeight.toString()))
		.times(percentage)
		.times(1 - 0.15);
	const rewardsPerDay = rewardPerEpoch.times(86400 / EPOCH_DURATION_SECONDS);
	console.log(stake);
	console.log(
		`Reward per day is ${rewardsPerDay.shiftedBy(-18)} on a stake of ${new BigNumber(stake.toString()).shiftedBy(-18)}`
	);
	console.log(`Reward per year is ${rewardsPerDay.times(365).shiftedBy(-18)}`);
	return {
		rewardPerEpoch: BigInt(rewardPerEpoch.toFixed(0)),
		rewardsPerDay: BigInt(rewardsPerDay.toFixed(0)),
		apr: rewardsPerDay.times(365).div(stake.toString()).times(100).toFixed(2)
	};
}

//Total Delegator Reward = Delegator Reward + Delegator Fees
//
// Delegator Reward per epoch (locked stake):
// delegator_BaseReward = (epochDuration * baseRewardPerSecond) * [(delegatorStake * (validatorEpochUptime/epochDuration)^2) / totalBaseRewardWeight] * (1 - 0.15)
//
// Delegator Reward per epoch (unlocked stake):
// delegator_BaseReward = (epochDuration * baseRewardPerSecond) * [(delegatorStake * (validatorEpochUptime/epochDuration)^2) / totalBaseRewardWeight] * 0.30 * (1 - 0.15)
