import { TransactionRequest } from '@/components/TransactionProcessor/types';
import sfc from '@/config/contracts/sfc';
import { Address } from 'viem';
export default function claimRewards(
	abi: typeof sfc,
	contract: Address,
	validatorId: bigint
): TransactionRequest {
	return {
		abi,
		address: contract,
		functionName: 'claimRewards',
		args: [validatorId],
		name: 'Claim rewards',
		contractKey: 'sfc'
	};
}
