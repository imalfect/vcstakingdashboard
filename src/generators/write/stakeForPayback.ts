import { TransactionProp } from '@/components/TransactionProcessor/types';
import payback from '@/config/contracts/payback';
import { Address } from 'viem';
export default function stakeForPayback(
	abi: typeof payback,
	contract: Address,
	amount: bigint
): TransactionProp {
	return {
		abi,
		address: contract,
		functionName: 'stake',
		value: amount,
		name: 'Stake for Payback'
	};
}
