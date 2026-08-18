'use client';

import type {
	StartBatchResult,
	TransactionAction,
	TransactionBatchCallbacks,
	TransactionProcessorState,
	TransactionRequest
} from '@/components/TransactionProcessor/types';
import {
	createContext,
	createElement,
	type Dispatch,
	type ReactNode,
	useContext,
	useEffect,
	useMemo,
	useRef
} from 'react';

type TransactionProcessorContextValue = {
	readonly state: TransactionProcessorState;
	readonly start: (transactions: readonly TransactionRequest[]) => StartBatchResult;
	readonly dispatch: Dispatch<TransactionAction>;
	readonly refreshingTransactionIds: ReadonlySet<string>;
	readonly reserveBroadcast: (key: string) => boolean;
};

const TransactionProcessorContext = createContext<TransactionProcessorContextValue | null>(null);

export function TransactionProcessorContextProvider({
	value,
	children
}: {
	value: TransactionProcessorContextValue;
	children: ReactNode;
}) {
	return createElement(TransactionProcessorContext.Provider, { value }, children);
}

export function useTransactionProcessorContext(): TransactionProcessorContextValue {
	const value = useContext(TransactionProcessorContext);
	if (!value)
		throw new Error(
			'useTransactionProcessorContext must be used within TransactionProcessorProvider'
		);
	return value;
}

export function useTransactionBatch(callbacks: TransactionBatchCallbacks = {}): {
	start(transactions: readonly TransactionRequest[]): StartBatchResult;
	isActive: boolean;
} {
	const context = useTransactionProcessorContext();
	const callbacksRef = useRef(callbacks);
	const acceptedBatchIdRef = useRef<string | null>(null);
	const invokedBatchIdRef = useRef<string | null>(null);
	callbacksRef.current = callbacks;

	useEffect(() => {
		const settlement = context.state.settlement;
		if (
			!settlement ||
			settlement.batch.id !== acceptedBatchIdRef.current ||
			invokedBatchIdRef.current === settlement.batch.id
		)
			return;
		invokedBatchIdRef.current = settlement.batch.id;
		context.dispatch({ type: 'settlement_consumed', batchId: settlement.batch.id });
		if (settlement.kind === 'completed') callbacksRef.current.onCompleted?.(settlement.batch);
		else if (settlement.kind === 'cancelled') callbacksRef.current.onCancelled?.(settlement.batch);
		else callbacksRef.current.onFailed?.(settlement.batch);
	}, [context, context.state.settlement]);

	return useMemo(
		() => ({
			start(transactions: readonly TransactionRequest[]) {
				const result = context.start(transactions);
				if (result.ok) acceptedBatchIdRef.current = result.batchId;
				return result;
			},
			isActive: context.state.active !== null
		}),
		[context]
	);
}
