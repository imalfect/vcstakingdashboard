import type {
	ActiveTransactionBatch,
	TrackedTransaction,
	TransactionAction,
	TransactionProcessorState
} from '@/components/TransactionProcessor/types';

export const initialTransactionState: TransactionProcessorState = {
	hydrated: false,
	active: null,
	settlement: null
};

const MAX_MESSAGE_LENGTH = 240;
const WALLET_MISMATCH_MESSAGE = 'Switch back to the original account and network to continue.';

function bounded(message: string): string {
	return message.trim().slice(0, MAX_MESSAGE_LENGTH) || 'Transaction failed.';
}

function replaceTransaction(
	state: TransactionProcessorState,
	batchId: string,
	transactionId: string,
	update: (
		transaction: TrackedTransaction,
		batch: ActiveTransactionBatch
	) => TrackedTransaction | null
): TransactionProcessorState {
	const batch = state.active;
	if (!batch || batch.id !== batchId) return state;
	const index = batch.transactions.findIndex(({ id }) => id === transactionId);
	if (index < 0) return state;
	const current = batch.transactions[index];
	const next = update(current, batch);
	if (!next || next === current) return state;
	const transactions = [...batch.transactions];
	transactions[index] = next;
	return { ...state, active: { ...batch, transactions } };
}

function failAndSkip(
	transaction: TrackedTransaction,
	batch: ActiveTransactionBatch,
	phase: 'broadcast_outcome_unknown' | 'reverted' | 'replacement_failed',
	message: string
): ActiveTransactionBatch {
	const index = batch.transactions.findIndex(({ id }) => id === transaction.id);
	return {
		...batch,
		transactions: batch.transactions.map((row, rowIndex) => {
			if (rowIndex === index) return { ...row, phase, message: bounded(message) };
			if (rowIndex > index && !row.hash && row.phase !== 'confirmed') {
				return { ...row, phase: 'skipped', message: 'Skipped because an earlier transaction failed.' };
			}
			return row;
		})
	};
}

function isFailedTerminal(batch: ActiveTransactionBatch): boolean {
	return batch.transactions.some(({ phase }) =>
		['broadcast_outcome_unknown', 'reverted', 'replacement_failed', 'stopped'].includes(phase)
	);
}

export default function transactionReducer(
	state: TransactionProcessorState,
	action: TransactionAction
): TransactionProcessorState {
	switch (action.type) {
		case 'rehydrated':
			if (state.hydrated) return state;
			return { hydrated: true, active: action.batch, settlement: null };
		case 'batch_started':
			if (!state.hydrated || state.active) return state;
			return { ...state, active: action.batch, settlement: null };
		case 'wallet_mismatch':
			return replaceTransaction(state, action.batchId, action.transactionId, (row) =>
				row.broadcastAttempt === action.broadcastAttempt && row.phase === 'queued'
					? { ...row, phase: 'paused_wallet_mismatch', message: WALLET_MISMATCH_MESSAGE }
					: null
			);
		case 'wallet_resumed':
			return replaceTransaction(state, action.batchId, action.transactionId, (row) =>
				row.broadcastAttempt === action.broadcastAttempt && row.phase === 'paused_wallet_mismatch'
					? { ...row, phase: 'queued', message: undefined }
					: null
			);
		case 'broadcast_started':
			return replaceTransaction(state, action.batchId, action.transactionId, (row) =>
				row.broadcastAttempt === action.broadcastAttempt && row.phase === 'queued'
					? { ...row, phase: 'awaiting_wallet', message: 'Confirm this transaction in your wallet.' }
					: null
			);
		case 'broadcast_succeeded':
			return replaceTransaction(state, action.batchId, action.transactionId, (row) =>
				row.broadcastAttempt === action.broadcastAttempt && row.phase === 'awaiting_wallet' && !row.hash
					? { ...row, phase: 'confirming', hash: action.hash, message: undefined }
					: null
			);
		case 'broadcast_failed':
			return replaceTransaction(state, action.batchId, action.transactionId, (row) =>
				row.broadcastAttempt === action.broadcastAttempt && row.phase === 'awaiting_wallet' && !row.hash
					? { ...row, phase: 'broadcast_failed', message: bounded(action.message) }
					: null
			);
		case 'broadcast_outcome_unknown': {
			const batch = state.active;
			if (!batch || batch.id !== action.batchId) return state;
			const row = batch.transactions.find(({ id }) => id === action.transactionId);
			if (!row || row.broadcastAttempt !== action.broadcastAttempt || row.hash) return state;
			if (row.phase !== 'awaiting_wallet') return state;
			return {
				...state,
				active: failAndSkip(row, batch, 'broadcast_outcome_unknown', action.message)
			};
		}
		case 'receipt_confirmed':
			return replaceTransaction(state, action.batchId, action.transactionId, (row) =>
				row.confirmationAttempt === action.confirmationAttempt &&
				row.phase === 'confirming' &&
				row.hash === action.hash
					? { ...row, phase: 'confirmed', message: undefined }
					: null
			);
		case 'receipt_wait_failed':
			return replaceTransaction(state, action.batchId, action.transactionId, (row) =>
				row.confirmationAttempt === action.confirmationAttempt &&
				row.phase === 'confirming' &&
				row.hash === action.hash
					? { ...row, phase: 'confirmation_failed', message: bounded(action.message) }
					: null
			);
		case 'receipt_reverted': {
			const batch = state.active;
			if (!batch || batch.id !== action.batchId) return state;
			const row = batch.transactions.find(({ id }) => id === action.transactionId);
			if (
				!row ||
				row.confirmationAttempt !== action.confirmationAttempt ||
				row.hash !== action.hash ||
				row.phase !== 'confirming'
			)
				return state;
			return { ...state, active: failAndSkip(row, batch, 'reverted', action.message) };
		}
		case 'receipt_replaced': {
			const batch = state.active;
			if (!batch || batch.id !== action.batchId) return state;
			const row = batch.transactions.find(({ id }) => id === action.transactionId);
			if (
				!row ||
				row.confirmationAttempt !== action.confirmationAttempt ||
				row.hash !== action.hash ||
				row.phase !== 'confirming'
			)
				return state;
			if (action.reason !== 'repriced') {
				return {
					...state,
					active: failAndSkip(row, batch, 'replacement_failed', `Transaction was ${action.reason}.`)
				};
			}
			if (action.receiptStatus === 'success') {
				return replaceTransaction(state, action.batchId, action.transactionId, () => ({
					...row,
					hash: action.replacementHash,
					phase: 'confirmed',
					message: undefined
				}));
			}
			if (action.receiptStatus === 'reverted') {
				const repriced = { ...row, hash: action.replacementHash };
				return {
					...state,
					active: failAndSkip(
						repriced,
						{
							...batch,
							transactions: batch.transactions.map((item) => (item.id === row.id ? repriced : item))
						},
						'reverted',
						'Replacement transaction reverted.'
					)
				};
			}
			return replaceTransaction(state, action.batchId, action.transactionId, () => ({
				...row,
				hash: action.replacementHash,
				confirmationAttempt: row.confirmationAttempt + 1,
				message: undefined
			}));
		}
		case 'retry_transaction':
			return replaceTransaction(state, action.batchId, action.transactionId, (row, batch) => {
				const index = batch.transactions.findIndex(({ id }) => id === row.id);
				if (batch.transactions.slice(0, index).some(({ phase }) => phase !== 'confirmed')) return null;
				if (row.phase === 'broadcast_failed' && !row.hash) {
					return {
						...row,
						phase: 'queued',
						broadcastAttempt: row.broadcastAttempt + 1,
						message: undefined
					};
				}
				if (row.phase === 'confirmation_failed' && row.hash) {
					return {
						...row,
						phase: 'confirming',
						confirmationAttempt: row.confirmationAttempt + 1,
						message: undefined
					};
				}
				return null;
			});
		case 'cancel_batch': {
			const batch = state.active;
			if (
				!batch ||
				batch.id !== action.batchId ||
				batch.transactions.some(({ hash, phase }) => hash || phase === 'awaiting_wallet')
			)
				return state;
			return { ...state, active: null, settlement: { kind: 'cancelled', batch } };
		}
		case 'stop_remaining': {
			const batch = state.active;
			if (!batch || batch.id !== action.batchId) return state;
			const index = batch.transactions.findIndex(({ id }) => id === action.transactionId);
			if (
				index < 0 ||
				batch.transactions[index].phase !== 'broadcast_failed' ||
				batch.transactions[index].hash
			)
				return state;
			if (batch.transactions.slice(0, index).some(({ phase }) => phase !== 'confirmed')) return state;
			const transactions = batch.transactions.map((row, rowIndex) => {
				if (rowIndex === index)
					return { ...row, phase: 'stopped' as const, message: 'Stopped before broadcast.' };
				if (rowIndex > index && !row.hash)
					return {
						...row,
						phase: 'skipped' as const,
						message: 'Skipped because the batch was stopped.'
					};
				return row;
			});
			return { ...state, active: { ...batch, transactions } };
		}
		case 'acknowledge_completed': {
			const batch = state.active;
			if (
				!batch ||
				batch.id !== action.batchId ||
				!batch.transactions.every(({ phase }) => phase === 'confirmed')
			)
				return state;
			return { ...state, active: null, settlement: { kind: 'completed', batch } };
		}
		case 'acknowledge_failed': {
			const batch = state.active;
			if (!batch || batch.id !== action.batchId || !isFailedTerminal(batch)) return state;
			return { ...state, active: null, settlement: { kind: 'failed', batch } };
		}
		case 'settlement_consumed':
			return state.settlement?.batch.id === action.batchId ? { ...state, settlement: null } : state;
	}
}
