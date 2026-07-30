import { TransactionRequest } from '@/components/TransactionProcessor/types';
import sfc from '@/config/contracts/sfc';
import { Address } from 'viem';
export default function relockValidatorDelegation(
	abi: typeof sfc,
	contract: Address,
	validatorId: bigint,
	amount: bigint,
	duration: number
): TransactionRequest {
	return {
		abi,
		address: contract,
		functionName: 'relockStake',
		args: [validatorId, BigInt(duration), amount],
		name: 'Relock Validator Delegation',
		contractKey: 'sfc'
	};
}
