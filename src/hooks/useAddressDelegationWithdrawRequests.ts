import sfc from '@/config/contracts/sfc';
import getDelegationWithdrawRequests from '@/generators/read/getDelegationWithdrawRequests';
import useLastValidatorId from '@/hooks/useLastValidatorId';
import { DelegationWithdrawRequest } from '@/types/delegationWithdrawRequest';
import { VinuChain } from '@/types/vinuChain';
import { Address, Chain } from 'viem';
import { useClient, useReadContracts } from 'wagmi';

export default function useAddressDelegationWithdrawRequests(
	address: Address
): DelegationWithdrawRequest[] {
	const client = useClient();
	const typedChain = client?.chain as (Chain & VinuChain) | undefined;
	const lastValidatorId = useLastValidatorId();
	const validatorIds = Array.from({ length: Number(lastValidatorId) }, (_, i) => i + 1);
	const withdrawRequests = useReadContracts({
		contracts: validatorIds.map((validatorId) =>
			getDelegationWithdrawRequests(
				sfc,
				typedChain?.contracts.sfc.address || '0x0',
				BigInt(validatorId),
				address
			)
		)
	}).data as {
		status: 'success' | 'failure';
		result: {
			epoch: bigint;
			time: bigint;
			amount: bigint;
		}[];
	}[];
	console.log(withdrawRequests);
	if (!withdrawRequests) return [];
	if (withdrawRequests[0].status === 'failure') return [];
	return validatorIds
		.map((validatorId, index) => {
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
		.filter((delegation) => delegation !== null) as DelegationWithdrawRequest[];
}
