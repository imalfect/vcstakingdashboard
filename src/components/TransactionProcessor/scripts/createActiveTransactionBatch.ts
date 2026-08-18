import type {
	ActiveTransactionBatch,
	TransactionRequest
} from '@/components/TransactionProcessor/types';
import type { SupportedChainId } from '@/config/wagmiShared';
import type { Address } from 'viem';

export default function createActiveTransactionBatch(
	id: string,
	account: Address,
	chainId: SupportedChainId,
	requests: readonly TransactionRequest[]
): ActiveTransactionBatch {
	return {
		id,
		account,
		chainId,
		transactions: requests.map((request, index) => ({
			id: `${id}:${index}`,
			request,
			broadcastAttempt: 0,
			confirmationAttempt: 0,
			phase: 'queued' as const
		}))
	};
}
