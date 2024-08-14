import payback from '@/config/contracts/payback';
import getPaybackWithdrawRequest from '@/generators/read/getPaybackWithdrawRequest';
import { PaybackWithdrawRequest } from '@/types/paybackWithdrawRequest';
import { VinuChain } from '@/types/vinuChain';
import { Address, Chain } from 'viem';
import { useClient, useReadContract, useReadContracts } from 'wagmi';

export default function useAddressPaybackWithdrawRequests(
	address: Address
): PaybackWithdrawRequest[] {
	const client = useClient();
	const typedChain = client?.chain as (Chain & VinuChain) | undefined;
	const activeWithdrawRequestsCount = useReadContract({
		address: typedChain?.contracts.payback.address || '0x0',
		abi: payback,
		functionName: 'getNumberOfActiveWithdrawalRequestIDs',
		args: [address]
	});
	const activeWithdrawRequestsIDs = useReadContract({
		address: typedChain?.contracts.payback.address || '0x0',
		abi: payback,
		functionName: 'getActiveWithdrawalRequestIDs',
		args: [address, 0n, activeWithdrawRequestsCount.data || 0n]
	});
	const withdrawRequests = useReadContracts({
		contracts: activeWithdrawRequestsIDs.data?.map((id) =>
			getPaybackWithdrawRequest(
				payback,
				typedChain?.contracts.payback.address || '0x0',
				address,
				BigInt(id)
			)
		)
	});
	if (!withdrawRequests.data) return [];
	return withdrawRequests.data.map((withdrawRequest) => {
		const typedResult = withdrawRequest.result as [bigint, bigint, bigint, bigint, boolean];
		return {
			id: typedResult[0],
			time: typedResult[1],
			amount: typedResult[2],
			unlockTime: typedResult[3],
			completed: typedResult[4]
		};
	});
	/*if (withdrawRequests[0].status === 'failure') return [];
	return ids
		.map((id, index) => {
			return withdrawRequests[index].result.map((singleWithdrawRequest, wrIndex) => {
				if (
					!(
						singleWithdrawRequest.epoch &&
						singleWithdrawRequest.time &&
						singleWithdrawRequest.amount !== 0n
					)
				) {
					return null;
				}
				return {
					id: BigInt(wrIndex),
					validatorId: BigInt(validatorId),
					epoch: singleWithdrawRequest.epoch,
					time: singleWithdrawRequest.time,
					amount: singleWithdrawRequest.amount
				} as DelegationWithdrawRequest;
			});
		})
		.flat()
		.filter((delegation) => delegation !== null) as DelegationWithdrawRequest[];*/
}
