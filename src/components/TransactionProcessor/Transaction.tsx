import {
	useTransactionProcessor,
	useTransactionProcessorDispatch
} from '@/components/TransactionProcessor/context';
import { TrackedTransaction } from '@/components/TransactionProcessor/types';
import { WriteContractParameters } from '@wagmi/core';
import { LucideCheck, LucideLoader2, LucideX } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

export default function TransactionProcessorTransaction(props: { id: number }) {
	const { writeContractAsync } = useWriteContract();
	const account = useAccount();
	const transactions = useTransactionProcessor();
	const dispatch = useTransactionProcessorDispatch();
	const thisTransaction = useMemo(() => {
		return transactions.find((transaction) => transaction.id === props.id);
	}, [transactions, props.id]);

	const previousTransaction = useMemo(() => {
		return transactions.find((transaction: TrackedTransaction) => transaction.id === props.id - 1);
	}, [transactions, props.id]);

	const thisTransactionCompleted = useWaitForTransactionReceipt({
		hash: thisTransaction?.hash as `0x${string}` | undefined
	});
	useEffect(() => {
		if (
			(previousTransaction?.status === 'success' || !previousTransaction) &&
			thisTransaction?.status === 'pending' &&
			previousTransaction?.status !== 'pending'
		) {
			console.log(`Requesting signature of transaction ${thisTransaction.id}`);
			writeContractAsync(thisTransaction.wagmiTransaction as unknown as WriteContractParameters)
				.then((hash) => {
					dispatch({
						type: 'transaction_signed',
						payload: {
							id: props.id,
							hash
						}
					});
				})
				.catch((error) => {
					dispatch({
						type: 'transaction_failed',
						payload: {
							id: props.id,
							message: error.shortMessage
						}
					});
				});
		}
	}, [props.id, dispatch, writeContractAsync, transactions, thisTransaction, previousTransaction]);
	useEffect(() => {
		if (thisTransactionCompleted.status === 'success') {
			dispatch({
				type: 'transaction_succeeded',
				payload: {
					id: props.id
				}
			});
		} else if (thisTransactionCompleted.status === 'error') {
			dispatch({
				type: 'transaction_failed',
				payload: {
					id: props.id,
					message: thisTransactionCompleted.error.message
				}
			});
		}
	}, [thisTransactionCompleted.status, thisTransactionCompleted.error?.message, dispatch, props.id]);
	if (!thisTransaction) {
		return null;
	}
	return (
		<div className={'flex items-center gap-6'}>
			<div>
				{(thisTransaction.status === 'pending' || thisTransaction.status === 'signed') && (
					<LucideLoader2 className={'animate-spin'} />
				)}
				{thisTransaction.status === 'success' && <LucideCheck className={'text-green-500'} />}
				{thisTransaction.status === 'error' && <LucideX className={'text-red-500'} />}
			</div>
			<div className={'flex flex-col gap-1'}>
				<p className={'font-bold'}>{thisTransaction.name}</p>
				{thisTransaction.status === 'pending' && (
					<p className={'text-sm'}>{thisTransaction.message || 'Pending...'}</p>
				)}
				{thisTransaction.status === 'success' && (
					<p className={'text-sm'}>
						Success!{' '}
						<a
							href={`${account.chain?.blockExplorers!.default.url}/transactions/${thisTransaction.hash}`}
							className={'font-bold'}
						>
							View in explorer
						</a>
					</p>
				)}
				{thisTransaction.status === 'error' && (
					<p className={'text-sm'}>{thisTransaction.message || 'Transaction failed'}</p>
				)}
				{thisTransaction.status === 'signed' && (
					<p className={'text-sm'}>
						Waiting for confirmation{' '}
						<a
							href={`${account.chain?.blockExplorers!.default.url}/transactions/${thisTransaction.hash}`}
							className={'font-bold'}
						>
							View in explorer
						</a>
					</p>
				)}
			</div>
		</div>
	);
}
