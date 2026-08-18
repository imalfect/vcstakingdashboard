import { EPOCH_DURATION_SECONDS } from '@/config/constants';
import useBaseRewardPerSecond from '@/hooks/useBaseRewardPerSecond';
import useCurrentEpoch from '@/hooks/useCurrentEpoch';
import useEpochSnapshot from '@/hooks/useEpochSnapshot';
import BigNumber from 'bignumber.js';

const LOCK_MULTIPLIER_SCALE = 100_000_000_000_000_000n;
const BASE_LOCK_MULTIPLIER_SCALED = 30_000_000_000_000_000n;
const DAILY_LOCK_MULTIPLIER_SCALED = 191_780_785_714_286n;
const VALIDATOR_REWARD_SHARE_SCALED = 85n;
const VALIDATOR_REWARD_SHARE_SCALE = 100n;

export default function useApproximateDelegationRewards(stakeWei: bigint, lockDays = 0) {
	const baseRewardPerSecond = useBaseRewardPerSecond();
	const currentEpoch = useCurrentEpoch();
	const previousEpochSnapshot = useEpochSnapshot(
		currentEpoch.error === null && currentEpoch.data !== null && currentEpoch.data > 0n
			? currentEpoch.data - 1n
			: null
	);
	if (
		currentEpoch.error ||
		currentEpoch.data === null ||
		previousEpochSnapshot.error ||
		!previousEpochSnapshot.data ||
		baseRewardPerSecond.error ||
		baseRewardPerSecond.data === null ||
		baseRewardPerSecond.data === 0n ||
		stakeWei === 0n ||
		previousEpochSnapshot.data.totalBaseRewardWeight === 0n
	) {
		return null;
	}

	const lockDaysClamped = BigInt(Math.max(0, lockDays));
	const lockMultiplierScaled =
		BASE_LOCK_MULTIPLIER_SCALED + DAILY_LOCK_MULTIPLIER_SCALED * lockDaysClamped;
	const epochRewardNumerator =
		BigInt(EPOCH_DURATION_SECONDS) *
		baseRewardPerSecond.data *
		stakeWei *
		lockMultiplierScaled *
		VALIDATOR_REWARD_SHARE_SCALED;
	const epochRewardDenominator =
		previousEpochSnapshot.data.totalBaseRewardWeight *
		LOCK_MULTIPLIER_SCALE *
		VALIDATOR_REWARD_SHARE_SCALE;
	// Regression: 9600 * 10^18 * 1 * 0.3 * 0.85 / (2_448_000_000_000_000_000_001) floors to 0n; rounded BigNumber division produced 1n.
	const rewardPerEpochWei = epochRewardNumerator / epochRewardDenominator;
	const rewardsPerDayWei =
		(epochRewardNumerator * 86400n) / (epochRewardDenominator * BigInt(EPOCH_DURATION_SECONDS));
	const rewardsPerDay = new BigNumber(rewardsPerDayWei.toString());

	return {
		rewardPerEpochWei,
		rewardsPerDayWei,
		apr: rewardsPerDay.times(365).times(100).dividedBy(stakeWei.toString()).toFixed(2)
	};
}
