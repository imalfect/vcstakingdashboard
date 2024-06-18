import { TransactionProp } from '@/components/TransactionProcessor/types';
import sfc from '@/config/contracts/sfc';
import { Address } from 'viem';
export default function lockupValidatorDelegation(
	abi: typeof sfc,
	contract: Address,
	validatorId: bigint,
	amount: bigint,
	duration: number
): TransactionProp {
	return {
		abi,
		address: contract,
		functionName: 'lockStake',
		args: [validatorId, duration, amount],
		name: 'Lock Validator Delegation'
	};
}
