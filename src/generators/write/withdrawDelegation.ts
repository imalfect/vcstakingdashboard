import { TransactionRequest } from '@/components/TransactionProcessor/types';
import sfc from '@/config/contracts/sfc';
import { Address } from 'viem';
export default function withdrawDelegation(
	abi: typeof sfc,
	contract: Address,
	validatorId: bigint,
	requestId: bigint
): TransactionRequest {
	return {
		abi,
		address: contract,
		functionName: 'withdraw',
		args: [validatorId, requestId],
		name: 'Finalize withdrawal request',
		contractKey: 'sfc'
	};
}
