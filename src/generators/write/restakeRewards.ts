import { TransactionRequest } from '@/components/TransactionProcessor/types';
import sfc from '@/config/contracts/sfc';
import { Address } from 'viem';
export default function restakeRewards(
	abi: typeof sfc,
	contract: Address,
	validatorId: bigint
): TransactionRequest {
	return {
		abi,
		address: contract,
		functionName: 'restakeRewards',
		args: [validatorId],
		name: 'Restake rewards',
		contractKey: 'sfc'
	};
}
