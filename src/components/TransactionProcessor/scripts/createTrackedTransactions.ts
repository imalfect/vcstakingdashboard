import { TrackedTransaction, TransactionProp } from '@/components/TransactionProcessor/types';
import { WriteContractParameters } from '@wagmi/core';

export default function createTrackedTransactions(
	transactions: TransactionProp[]
): TrackedTransaction[] {
	return transactions.map((transaction, index) => ({
		id: index,
		name: transaction.name,
		status: 'pending',
		wagmiTransaction: transaction as WriteContractParameters
	}));
}
