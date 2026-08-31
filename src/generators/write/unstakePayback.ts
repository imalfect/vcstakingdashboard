import {
	TransactionContractKey,
	TransactionRequest
} from '@/components/TransactionProcessor/types';
import payback from '@/config/contracts/payback';
import { Address } from 'viem';
export default function unstakePayback(
	abi: typeof payback,
	contract: Address,
	amount: bigint,
	delegator?: Address,
	contractKey: Extract<TransactionContractKey, 'payback' | 'paybackLegacy'> = 'payback'
): TransactionRequest {
	return {
		abi,
		address: contract,
		functionName: delegator ? 'unstakeFor' : 'unstake',
		args: delegator ? [delegator, amount] : [amount],
		name: contractKey === 'paybackLegacy' ? 'Unstake Legacy Payback' : 'Unstake Payback',
		contractKey
	} as TransactionRequest;
}
