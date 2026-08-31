import {
	TransactionContractKey,
	TransactionRequest
} from '@/components/TransactionProcessor/types';
import payback from '@/config/contracts/payback';
import { Address } from 'viem';
export default function withdrawPayback(
	abi: typeof payback,
	contract: Address,
	wrId: bigint,
	contractKey: Extract<TransactionContractKey, 'payback' | 'paybackLegacy'> = 'payback'
): TransactionRequest {
	return {
		abi,
		address: contract,
		functionName: 'withdrawStake',
		args: [wrId],
		name: contractKey === 'paybackLegacy' ? 'Withdraw Legacy Payback' : 'Withdraw Payback',
		contractKey
	};
}
