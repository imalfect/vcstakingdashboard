// pain get started.
import { TransactionProcessorModal } from '@/components/TransactionProcessor/Modal';
import {
	TransactionProcessorContext,
	TransactionProcessorDispatchContext
} from '@/components/TransactionProcessor/context';
import createTrackedTransactions from '@/components/TransactionProcessor/scripts/createTrackedTransactions';
import reducer from '@/components/TransactionProcessor/scripts/transactionReducer';
import { TrackedTransaction, TransactionProp } from '@/components/TransactionProcessor/types';
import { useEffect, useReducer, useState } from 'react';
import { useAccount } from 'wagmi';

export default function TransactionProcessor(props: {
	transactions: TransactionProp[];
	onSuccess: () => void;
	onFail: (transactions: TrackedTransaction[]) => void;
	active: boolean;
}) {
	const account = useAccount();
	const [trackedTransactions, dispatchTransactionChange] = useReducer(
		reducer,
		createTrackedTransactions(props.transactions)
	);
	const [open, setOpen] = useState(true);
	useEffect(() => {
		if (account.status === 'connected' && props.active) {
			setOpen(true);
		}
	}, [props.active, account.status]);
	// update the tracked transactions when the transactions prop changes
	useEffect(() => {
		dispatchTransactionChange({
			type: 'newTransactions',
			payload: props.transactions
		});
	}, [props.transactions]);
	return (
		<TransactionProcessorContext.Provider value={trackedTransactions}>
			<TransactionProcessorDispatchContext.Provider value={dispatchTransactionChange}>
				{account.status === 'connected' && props.active && (
					<TransactionProcessorModal
						open={open}
						onSuccess={() => {
							props.onSuccess();
							setOpen(false);
						}}
						onFail={(transactions) => {
							props.onFail(transactions);
							setOpen(false);
						}}
					/>
				)}
			</TransactionProcessorDispatchContext.Provider>
		</TransactionProcessorContext.Provider>
	);
}
