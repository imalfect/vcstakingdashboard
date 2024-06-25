import sfc from '@/config/contracts/sfc';
import getWrRequests from '@/generators/read/getWrRequests';
import useLastValidatorId from '@/hooks/useLastValidatorId';
import { VinuChain } from '@/types/vinuChain';
import { WithdrawRequest } from '@/types/withdrawRequest';
import { Address, Chain } from 'viem';
import { useClient, useReadContracts } from 'wagmi';

export default function useAddressWithdrawRequests(address: Address): WithdrawRequest[] {
	const client = useClient();
	const typedChain = client?.chain as (Chain & VinuChain) | undefined;
	const lastValidatorId = useLastValidatorId();
	const validatorIds = Array.from({ length: Number(lastValidatorId) }, (_, i) => i + 1);
	const withdrawRequests = useReadContracts({
		contracts: validatorIds.map((validatorId) =>
			getWrRequests(sfc, typedChain?.contracts.sfc.address || '0x0', BigInt(validatorId), address)
		)
	}).data as {
		result: {
			epoch: bigint;
			time: bigint;
			amount: bigint;
		}[];
	}[];
	if (!withdrawRequests) return [];
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
				} as WithdrawRequest;
			});
		})
		.flat()
		.filter((delegation) => delegation !== null) as WithdrawRequest[];
}
