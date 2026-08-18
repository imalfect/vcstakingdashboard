import { TransactionRequest } from '@/components/TransactionProcessor/types';
import sfc from '@/config/contracts/sfc';
import { Address } from 'viem';
export default function delegateToValidator(
	abi: typeof sfc,
	contract: Address,
	validatorId: bigint,
	amount: bigint
): TransactionRequest {
	return {
		abi,
		address: contract,
		functionName: 'delegate',
		value: amount,
		args: [validatorId],
		name: 'Delegate to Validator',
		contractKey: 'sfc'
	};
}
