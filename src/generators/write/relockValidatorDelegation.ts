import { TransactionProp } from '@/components/TransactionProcessor/types';
import sfc from '@/config/contracts/sfc';
import { Address } from 'viem';
export default function relockValidatorDelegation(
	abi: typeof sfc,
	contract: Address,
	validatorId: bigint,
	amount: bigint,
	duration: number
): TransactionProp {
	return {
		abi,
		address: contract,
		functionName: 'relockStake',
		args: [validatorId, duration, amount],
		name: 'Relock Validator Delegation'
	};
}
