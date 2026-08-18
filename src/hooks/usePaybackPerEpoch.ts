import { EPOCH_DURATION_SECONDS } from '@/config/constants';
import useBaseRewardPerSecond from '@/hooks/useBaseRewardPerSecond';
import useCurrentEpoch from '@/hooks/useCurrentEpoch';
import useEpochSnapshot from '@/hooks/useEpochSnapshot';
import useTotalPaybackStake from '@/hooks/useTotalPaybackStake';
import { ReadState } from '@/types/readState';
export type PaybackPrerequisiteFailure = {
	source: 'currentEpoch' | 'totalPaybackStake' | 'baseRewardPerSecond' | 'previousEpochSnapshot';
	error: Error;
};

export default function usePaybackPerEpoch(
	stake: bigint
): ReadState<bigint | null, PaybackPrerequisiteFailure> {
	const totalPaybackStake = useTotalPaybackStake();
	const currentEpoch = useCurrentEpoch();
	const previousEpochApplicable =
		currentEpoch.error === null && currentEpoch.data !== null && currentEpoch.data > 0n;
	const baseRewardPerSecond = useBaseRewardPerSecond(previousEpochApplicable);
	const previousEpochSnapshot = useEpochSnapshot(
		previousEpochApplicable && currentEpoch.data !== null ? currentEpoch.data - 1n : null
	);
	let data: bigint | null = null;
	const currentEpochData = currentEpoch.error === null ? currentEpoch.data : null;
	const totalPaybackStakeData = totalPaybackStake.error === null ? totalPaybackStake.data : null;
	const baseRewardPerSecondData =
		baseRewardPerSecond.error === null ? baseRewardPerSecond.data : null;
	if (currentEpochData === 0n && totalPaybackStakeData !== null) {
		data = 0n;
	} else if (
		currentEpochData !== null &&
		currentEpochData > 0n &&
		totalPaybackStakeData !== null &&
		baseRewardPerSecondData !== null &&
		baseRewardPerSecond.error === null &&
		previousEpochSnapshot.error === null &&
		!baseRewardPerSecond.isLoading &&
		!previousEpochSnapshot.isLoading
	) {
		if (baseRewardPerSecondData === 0n) {
			data = 0n;
		} else if (previousEpochSnapshot.data !== null) {
			const denominator = totalPaybackStakeData + previousEpochSnapshot.data.totalStake;
			data =
				denominator === 0n
					? 0n
					: (stake * BigInt(EPOCH_DURATION_SECONDS) * baseRewardPerSecondData) / denominator;
		}
	}

	const failures: PaybackPrerequisiteFailure[] = [];
	if (currentEpoch.error) failures.push({ source: 'currentEpoch', error: currentEpoch.error });
	if (totalPaybackStake.error)
		failures.push({ source: 'totalPaybackStake', error: totalPaybackStake.error });
	if (previousEpochApplicable && baseRewardPerSecond.error)
		failures.push({ source: 'baseRewardPerSecond', error: baseRewardPerSecond.error });
	if (previousEpochApplicable && previousEpochSnapshot.error)
		failures.push({ source: 'previousEpochSnapshot', error: previousEpochSnapshot.error });

	return {
		data,
		isLoading:
			currentEpoch.isLoading ||
			totalPaybackStake.isLoading ||
			(previousEpochApplicable && baseRewardPerSecond.isLoading) ||
			(previousEpochApplicable && previousEpochSnapshot.isLoading),
		isFetching:
			currentEpoch.isFetching ||
			totalPaybackStake.isFetching ||
			(previousEpochApplicable && baseRewardPerSecond.isFetching) ||
			(previousEpochApplicable && previousEpochSnapshot.isFetching),
		error:
			currentEpoch.error ??
			totalPaybackStake.error ??
			(previousEpochApplicable ? baseRewardPerSecond.error : null) ??
			(previousEpochApplicable ? previousEpochSnapshot.error : null),
		failures,
		refetch: async () => {
			const requests = [currentEpoch.refetch(), totalPaybackStake.refetch()];
			if (previousEpochApplicable) {
				requests.push(baseRewardPerSecond.refetch(), previousEpochSnapshot.refetch());
			}
			await Promise.all(requests);
		}
	};
}
