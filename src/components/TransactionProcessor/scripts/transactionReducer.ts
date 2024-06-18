import { TrackedTransaction, TransactionAction } from '@/components/TransactionProcessor/types';

export default function reducer(state: TrackedTransaction[], action: TransactionAction) {
	if (action.type === 'transaction_failed') {
		// Update the transaction status to error
		return state.map((transaction) => {
			if (transaction.id === action.payload.id) {
				transaction.status = 'error';
				transaction.message = action.payload.message || 'Transaction failed';
			} else if (transaction.id > action.payload.id) {
				transaction.status = 'error';
				transaction.message = 'Previous transaction failed';
			}
			return transaction;
		});
	}
	if (action.type === 'transaction_succeeded') {
		// Update the transaction status to success
		return state.map((transaction) => {
			if (transaction.id === action.payload.id) {
				transaction.status = 'success';
			}
			return transaction;
		});
	}
	if (action.type === 'transaction_signed') {
		// Update the transaction status to success
		return state.map((transaction) => {
			if (transaction.id === action.payload.id) {
				transaction.status = 'signed';
				transaction.hash = action.payload.hash;
			}
			return transaction;
		});
	}
	if (action.type === 'retry_failed_transactions') {
		// Update the transaction status to success
		return state.map((transaction) => {
			if (transaction.status === 'error') {
				transaction.status = 'pending';
				transaction.message = undefined;
			}
			return transaction;
		});
	}
	throw Error('Unknown action.');
}
