import { TransactionRequest } from '@/components/TransactionProcessor/types';
import payback from '@/config/contracts/payback';
import { Address } from 'viem';
export default function stakeForPayback(
	abi: typeof payback,
	contract: Address,
	amount: bigint,
	delegator?: Address
): TransactionRequest {
	return {
		abi,
		address: contract,
		functionName: delegator ? 'stakeFor' : 'stake',
		...(delegator ? { args: [delegator] } : {}),
		value: amount,
		name: delegator ? 'Stake Payback for Address' : 'Stake for Payback',
		contractKey: 'payback'
	} as TransactionRequest;
}
