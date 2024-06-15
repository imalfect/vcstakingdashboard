// pain get started.
import { TransactionProcessorModal } from '@/components/TransactionProcessor/Modal';
import { Transaction, TransactionStatus } from '@/types/transaction';
import { WriteContractErrorType, writeContract } from '@wagmi/core';
import { useEffect, useState } from 'react';
import { useConfig } from 'wagmi';
export default function TransactionProcessor(props: { transactions: Transaction[] }) {
	const config = useConfig();
	const [modalOpen, setModalOpen] = useState(true);
	const [transactions, setTransactions] = useState<Transaction[]>(props.transactions);
	const [transactionStatuses, setTransactionStatuses] = useState<TransactionStatus[]>(
		props.transactions.map((transaction) => ({ status: 'pending', name: transaction.name })) || []
	);
	const processTransaction = async (transaction: Transaction) => {
		// @ts-ignore
		const result = await writeContract(config, transaction).catch((e: WriteContractErrorType) => {
			// Update the transaction status to error

			setTransactions((transactions) => transactions.slice(1));
			setTransactionStatuses((transactionStatuses) => {
				const thisTransaction = transactionStatuses.find((t) => t.name === transaction.name);
				thisTransaction!.status = 'error';
				thisTransaction!.message = e.message;
				return [...transactionStatuses];
			});
			failRemainingTransactions();
			return null;
		});
		if (result) {
			// Update the transaction status to success
			setTransactionStatuses((transactionStatuses) => {
				const thisTransaction = transactionStatuses.find((t) => t.name === transaction.name);
				thisTransaction!.status = 'success';
				thisTransaction!.hash = result;
				return [...transactionStatuses];
			});
			setTransactions((transactions) => transactions.slice(1));
		}
		return result;
	};
	useEffect(() => {
		if (
			transactions.length > 0 ||
			transactionStatuses[transactionStatuses.length - 1].status !== 'error'
		) {
			processTransaction(transactions[0]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const failRemainingTransactions = () => {
		setTransactionStatuses((transactionStatuses) => {
			transactionStatuses.forEach((transaction) => {
				if (transaction.status === 'pending') {
					transaction.status = 'error';
					transaction.message = 'Previous transaction failed';
				}
			});
			return [...transactionStatuses];
		});
	};
	return (
		<TransactionProcessorModal
			open={modalOpen}
			onOpenChange={setModalOpen}
			transactions={transactionStatuses}
		/>
	);
}
