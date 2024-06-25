import { default as sfc } from '@/config/contracts/sfc';
import { ReadContractParameters } from '@wagmi/core';
import { Address } from 'viem';
export default function getWrRequests(
	abi: typeof sfc,
	contract: Address,
	validatorId: bigint,
	address: Address
): ReadContractParameters {
	return {
		abi: abi,
		address: contract,
		functionName: 'getWrRequests',
		args: [address || '0x0', validatorId, 0, 100]
	};
}
