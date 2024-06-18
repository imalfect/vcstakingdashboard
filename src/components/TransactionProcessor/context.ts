import { TrackedTransaction } from '@/components/TransactionProcessor/types';
import { createContext, useContext } from 'react';

export const TransactionProcessorContext = createContext(null as any);
export const TransactionProcessorDispatchContext = createContext(null as any);

export function useTransactionProcessor() {
	return useContext<TrackedTransaction[]>(TransactionProcessorContext);
}

export function useTransactionProcessorDispatch() {
	return useContext(TransactionProcessorDispatchContext);
}
