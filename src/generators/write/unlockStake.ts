import { TransactionProp } from '@/components/TransactionProcessor/types';
import sfc from '@/config/contracts/sfc';
import { Address } from 'viem';
export default function unlockStake(
	abi: typeof sfc,
	contract: Address,
	validatorId: bigint,
	amount: bigint
): TransactionProp {
	return {
		abi,
		address: contract,
		functionName: 'unlockStake',
		args: [validatorId, amount],
		name: 'DANGER: Unlock Stake'
	};
}
