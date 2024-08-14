import payback from '@/config/contracts/payback';
import { ReadContractParameters } from '@wagmi/core';
import { Address } from 'viem';
export default function getPaybackWithdrawRequest(
	abi: typeof payback,
	contract: Address,
	address: Address,
	wrId: bigint
): ReadContractParameters {
	return {
		abi: abi,
		address: contract,
		functionName: 'getWithdrawalRequest',
		args: [address || '0x0', wrId]
	};
}
