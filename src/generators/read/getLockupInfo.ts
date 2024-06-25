import { default as sfc } from '@/config/contracts/sfc';
import { ReadContractParameters } from '@wagmi/core';
import { Address } from 'viem';
export default function getLockupInfo(
	abi: typeof sfc,
	contract: Address,
	validatorId: bigint,
	address: Address
): ReadContractParameters {
	return {
		abi: abi,
		address: contract,
		functionName: 'getLockupInfo',
		args: [address || '0x0', validatorId]
	};
}
