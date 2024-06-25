import { default as sfc } from '@/config/contracts/sfc';
import { ReadContractParameters } from '@wagmi/core';
import { Address } from 'viem';
export default function getPendingRewards(
	abi: typeof sfc,
	contract: Address,
	validatorId: bigint,
	address: Address
): ReadContractParameters {
	return {
		abi: abi,
		address: contract,
		functionName: 'pendingRewards',
		args: [address || '0x0', validatorId]
	};
}
