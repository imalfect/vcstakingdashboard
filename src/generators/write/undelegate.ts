import { TransactionRequest } from '@/components/TransactionProcessor/types';
import sfc from '@/config/contracts/sfc';
import { Address } from 'viem';
export default function undelegate(
	abi: typeof sfc,
	contract: Address,
	validatorId: bigint,
	amount: bigint
): TransactionRequest {
	return {
		abi,
		address: contract,
		functionName: 'undelegate',
		args: [validatorId, amount],
		name: 'Undelegate',
		contractKey: 'sfc'
	};
}
