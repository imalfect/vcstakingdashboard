'use client';

import { useDashboardContractRefresh } from '@/components/Contexts/DashboardContractRefresh';
import { useStakingSession } from '@/components/Contexts/StakingSession';
import { TransactionProcessorContextProvider } from '@/components/TransactionProcessor/context';
import { TransactionProcessorModal } from '@/components/TransactionProcessor/Modal';
import createActiveTransactionBatch from '@/components/TransactionProcessor/scripts/createActiveTransactionBatch';
import transactionReducer, {
	initialTransactionState
} from '@/components/TransactionProcessor/scripts/transactionReducer';
import {
	parseStoredBatch,
	serializeStoredBatch,
	TRANSACTION_STORAGE_KEY
} from '@/components/TransactionProcessor/scripts/transactionStorage';
import TransactionProcessorTransaction from '@/components/TransactionProcessor/Transaction';
import type {
	ActiveTransactionBatch,
	StartBatchResult,
	TransactionAction,
	TransactionProcessorState,
	TransactionRequest
} from '@/components/TransactionProcessor/types';
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';

export default function TransactionProcessorProvider({ children }: { children: ReactNode }) {
	const sessionState = useStakingSession();
	const { refreshChain } = useDashboardContractRefresh();
	const [state, setState] = useState<TransactionProcessorState>(initialTransactionState);
	const [refreshingTransactionIds, setRefreshingTransactionIds] = useState<ReadonlySet<string>>(
		new Set()
	);
	const stateRef = useRef(state);
	const activeBatchRef = useRef<ActiveTransactionBatch | null>(null);
	const inFlightBroadcastsRef = useRef(new Set<string>());
	const refreshedTransactionsRef = useRef(new Set<string>());
	const refreshPromisesRef = useRef(new Map<string, Promise<void>>());

	const refreshConfirmedRows = useCallback(
		(batch: ActiveTransactionBatch, previous?: ActiveTransactionBatch | null) => {
			const previouslyConfirmed = new Set(
				previous?.id === batch.id
					? previous.transactions.filter(({ phase }) => phase === 'confirmed').map(({ id }) => id)
					: []
			);
			for (const transaction of batch.transactions) {
				if (
					transaction.phase !== 'confirmed' ||
					previouslyConfirmed.has(transaction.id) ||
					refreshedTransactionsRef.current.has(transaction.id)
				)
					continue;
				refreshedTransactionsRef.current.add(transaction.id);
				setRefreshingTransactionIds((current) => new Set(current).add(transaction.id));
				const promise = refreshChain(batch.chainId)
					.catch(() => undefined)
					.then(() => undefined)
					.finally(() => {
						setRefreshingTransactionIds((current) => {
							const next = new Set(current);
							next.delete(transaction.id);
							return next;
						});
					});
				refreshPromisesRef.current.set(transaction.id, promise);
			}
		},
		[refreshChain]
	);

	const dispatch = useCallback(
		(action: TransactionAction) => {
			const previous = stateRef.current;
			const next = transactionReducer(previous, action);
			if (next === previous) return;
			stateRef.current = next;
			activeBatchRef.current = next.active;
			if (typeof window !== 'undefined') {
				try {
					if (next.active)
						sessionStorage.setItem(TRANSACTION_STORAGE_KEY, serializeStoredBatch(next.active));
					else sessionStorage.removeItem(TRANSACTION_STORAGE_KEY);
				} catch {
					// Transaction processing remains live when storage is unavailable.
				}
			}
			if (next.active) refreshConfirmedRows(next.active, previous.active);
			setState(next);
		},
		[refreshConfirmedRows]
	);

	useEffect(() => {
		let batch: ActiveTransactionBatch | null = null;
		try {
			const raw = sessionStorage.getItem(TRANSACTION_STORAGE_KEY);
			batch = raw ? parseStoredBatch(raw) : null;
			if (raw && !batch) sessionStorage.removeItem(TRANSACTION_STORAGE_KEY);
		} catch {
			batch = null;
		}
		dispatch({ type: 'rehydrated', batch });
	}, [dispatch]);

	const start = useCallback(
		(transactions: readonly TransactionRequest[]): StartBatchResult => {
			if (!stateRef.current.hydrated) return { ok: false, reason: 'rehydrating' };
			if (activeBatchRef.current) return { ok: false, reason: 'active_batch' };
			if (sessionState.status === 'disconnected') return { ok: false, reason: 'wallet_not_connected' };
			if (sessionState.status !== 'supported') return { ok: false, reason: 'unsupported_chain' };
			if (transactions.length === 0) return { ok: false, reason: 'empty_batch' };

			const batchId = crypto.randomUUID();
			const batch = createActiveTransactionBatch(
				batchId,
				sessionState.session.address,
				sessionState.session.chain.id,
				transactions
			);
			activeBatchRef.current = batch;
			dispatch({ type: 'batch_started', batch });
			return { ok: true, batchId };
		},
		[dispatch, sessionState]
	);

	const reserveBroadcast = useCallback((key: string) => {
		if (inFlightBroadcastsRef.current.has(key)) return false;
		inFlightBroadcastsRef.current.add(key);
		return true;
	}, []);

	const contextValue = useMemo(
		() => ({
			state,
			start,
			dispatch,
			refreshingTransactionIds,
			reserveBroadcast
		}),
		[dispatch, refreshingTransactionIds, reserveBroadcast, start, state]
	);

	return (
		<TransactionProcessorContextProvider value={contextValue}>
			{children}
			{state.active?.transactions.map((transaction) => (
				<TransactionProcessorTransaction
					key={`${transaction.id}:${transaction.confirmationAttempt}`}
					transaction={transaction}
				/>
			))}
			<TransactionProcessorModal />
		</TransactionProcessorContextProvider>
	);
}
