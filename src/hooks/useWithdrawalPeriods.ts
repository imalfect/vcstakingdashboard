import { useStakingSession } from '@/components/Contexts/StakingSession';
import SFCAbi from '@/config/contracts/sfc';
import { ReadState } from '@/types/readState';
import { useReadContracts } from 'wagmi';

export type WithdrawalPeriods = { time: bigint; epochs: bigint };

export default function useWithdrawalPeriods(): ReadState<WithdrawalPeriods | null> {
	const state = useStakingSession();
	const session = state.status === 'supported' ? state.session : undefined;
	const sfcAddress = session?.chain.contracts.sfc.address;
	const withdrawalPeriods = useReadContracts({
		contracts:
			session && sfcAddress
				? [
						{
							abi: SFCAbi,
							address: sfcAddress,
							chainId: session.chain.id,
							functionName: 'withdrawalPeriodEpochs'
						},
						{
							abi: SFCAbi,
							address: sfcAddress,
							chainId: session.chain.id,
							functionName: 'withdrawalPeriodTime'
						}
					]
				: [],
		scopeKey: session ? `dashboard:${session.chain.id}` : undefined,
		query: { enabled: Boolean(session && sfcAddress) }
	});
	const epochsResult = withdrawalPeriods.data?.[0];
	const timeResult = withdrawalPeriods.data?.[1];
	const resultError =
		epochsResult?.status === 'failure'
			? epochsResult.error
			: timeResult?.status === 'failure'
				? timeResult.error
				: null;
	const data =
		epochsResult?.status === 'success' &&
		typeof epochsResult.result === 'bigint' &&
		timeResult?.status === 'success' &&
		typeof timeResult.result === 'bigint'
			? { epochs: epochsResult.result, time: timeResult.result }
			: null;
	return {
		data,
		isLoading: withdrawalPeriods.isLoading,
		isFetching: withdrawalPeriods.isFetching,
		error: withdrawalPeriods.error ?? resultError,
		failures: [],
		refetch: async () => {
			await withdrawalPeriods.refetch();
		}
	};
}
