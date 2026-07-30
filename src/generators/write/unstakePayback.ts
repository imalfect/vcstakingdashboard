import { TransactionRequest } from '@/components/TransactionProcessor/types';
import payback from '@/config/contracts/payback';
import { Address } from 'viem';
export default function unstakePayback(
	abi: typeof payback,
	contract: Address,
	amount: bigint
): TransactionRequest {
	return {
		abi,
		address: contract,
		functionName: 'unstake',
		args: [amount],
		name: 'Unstake Payback',
		contractKey: 'payback'
	};
}
