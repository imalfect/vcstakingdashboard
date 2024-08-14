import { TransactionProp } from '@/components/TransactionProcessor/types';
import payback from '@/config/contracts/payback';
import { Address } from 'viem';
export default function withdrawPayback(
	abi: typeof payback,
	contract: Address,
	wrId: bigint
): TransactionProp {
	return {
		abi,
		address: contract,
		functionName: 'withdrawStake',
		args: [wrId],
		name: 'Withdraw Payback'
	};
}
