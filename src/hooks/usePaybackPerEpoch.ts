import { EPOCH_DURATION_SECONDS } from '@/config/constants';
import useBaseRewardPerSecond from '@/hooks/useBaseRewardPerSecond';
import useCurrentEpoch from '@/hooks/useCurrentEpoch';
import useEpochSnapshot from '@/hooks/useEpochSnapshot';
import useTotalPaybackStake from '@/hooks/useTotalPaybackStake';
import BigNumber from 'bignumber.js';

export default function usePaybackPerEpoch(stake: bigint) {
	const totalStake = useTotalPaybackStake();
	const rps = useBaseRewardPerSecond();
	const currentEpoch = useCurrentEpoch();
	const previousEpochSnapshot = useEpochSnapshot(currentEpoch - 1n);
	if (totalStake === 0n) return 0n;
	return BigInt(
		new BigNumber(stake.toString())
			.div(
				new BigNumber(totalStake.toString()).plus((previousEpochSnapshot?.totalStake || 0n).toString())
			)
			.times(new BigNumber(EPOCH_DURATION_SECONDS).times(rps.toString()))
			.toFixed()
	);
}
