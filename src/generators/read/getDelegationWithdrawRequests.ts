import { default as sfc } from '@/config/contracts/sfc';
import { Address } from 'viem';
export default function getDelegationWithdrawRequests(
	address: Address,
	validatorId: bigint,
	offset: bigint,
	limit: bigint
) {
	return {
		abi: sfc,
		functionName: 'getWrRequests' as const,
		args: [address, validatorId, offset, limit] as const
	};
}
