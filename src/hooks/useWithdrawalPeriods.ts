import SFCAbi from '@/config/contracts/sfc';
import { VinuChain } from '@/types/vinuChain';
import { Chain } from 'viem';
import { useClient, useReadContracts } from 'wagmi';

export default function useWithdrawalPeriods() {
	const client = useClient();
	const typedChain = client?.chain as (Chain & VinuChain) | undefined;
	const withdrawalPeriods = useReadContracts({
		contracts: [
			{
				abi: SFCAbi,
				address: typedChain?.contracts.sfc.address,
				functionName: 'withdrawalPeriodEpochs'
			},
			{
				abi: SFCAbi,
				address: typedChain?.contracts.sfc.address,
				functionName: 'withdrawalPeriodTime'
			}
		]
	});
	return {
		time: (withdrawalPeriods.data && withdrawalPeriods.data[1].result) || 0n,
		epochs: (withdrawalPeriods.data && withdrawalPeriods.data[0].result) || 0n
	};
}
