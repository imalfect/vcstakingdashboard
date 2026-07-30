'use client';

import { useTransactionProcessorContext } from '@/components/TransactionProcessor/context';
import type { TrackedTransaction } from '@/components/TransactionProcessor/types';
import type { WriteContractParameters } from '@wagmi/core';
import { useEffect, useMemo, useRef } from 'react';
import { BaseError, isAddressEqual, UserRejectedRequestError } from 'viem';
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

function errorMessage(error: unknown): string {
	if (typeof error === 'object' && error !== null) {
		if ('shortMessage' in error && typeof error.shortMessage === 'string') return error.shortMessage;
		if ('message' in error && typeof error.message === 'string') return error.message;
	}
	return 'Transaction request failed.';
}

function isKnownUserRejection(error: unknown): boolean {
	if (error instanceof UserRejectedRequestError) return true;
	return (
		error instanceof BaseError &&
		error.walk((cause) => cause instanceof UserRejectedRequestError) !== null
	);
}

export default function TransactionProcessorTransaction({
	transaction
}: {
	transaction: TrackedTransaction;
}) {
	const { state, dispatch, reserveBroadcast } = useTransactionProcessorContext();
	const batch = state.active;
	const account = useAccount();
	const { writeContractAsync } = useWriteContract();
	const receiptRetryStartedRef = useRef(false);
	const transactionIndex = batch?.transactions.findIndex(({ id }) => id === transaction.id) ?? -1;
	const predecessorsConfirmed = useMemo(
		() =>
			Boolean(
				batch &&
					transactionIndex >= 0 &&
					batch.transactions.slice(0, transactionIndex).every(({ phase }) => phase === 'confirmed')
			),
		[batch, transactionIndex]
	);
	const walletMatches = Boolean(
		batch &&
			account.address &&
			account.chainId === batch.chainId &&
			isAddressEqual(account.address, batch.account)
	);

	useEffect(() => {
		if (
			!batch ||
			!predecessorsConfirmed ||
			transaction.id !== batch.transactions[transactionIndex]?.id
		)
			return;
		if (transaction.phase === 'paused_wallet_mismatch') {
			if (walletMatches) {
				dispatch({
					type: 'wallet_resumed',
					batchId: batch.id,
					transactionId: transaction.id,
					broadcastAttempt: transaction.broadcastAttempt
				});
			}
			return;
		}
		if (transaction.phase !== 'queued') return;
		if (!walletMatches) {
			dispatch({
				type: 'wallet_mismatch',
				batchId: batch.id,
				transactionId: transaction.id,
				broadcastAttempt: transaction.broadcastAttempt
			});
			return;
		}

		const inFlightKey = `${batch.id}:${transaction.id}:${transaction.broadcastAttempt}`;
		if (!reserveBroadcast(inFlightKey)) return;
		dispatch({
			type: 'broadcast_started',
			batchId: batch.id,
			transactionId: transaction.id,
			broadcastAttempt: transaction.broadcastAttempt
		});
		const { name: _name, contractKey: _contractKey, ...request } = transaction.request;
		void writeContractAsync({
			...request,
			account: batch.account,
			chainId: batch.chainId
		} as WriteContractParameters)
			.then((hash) => {
				dispatch({
					type: 'broadcast_succeeded',
					batchId: batch.id,
					transactionId: transaction.id,
					broadcastAttempt: transaction.broadcastAttempt,
					hash
				});
			})
			.catch((error: unknown) => {
				const knownRejection = isKnownUserRejection(error);
				dispatch({
					type: knownRejection ? 'broadcast_failed' : 'broadcast_outcome_unknown',
					batchId: batch.id,
					transactionId: transaction.id,
					broadcastAttempt: transaction.broadcastAttempt,
					message: knownRejection
						? errorMessage(error)
						: 'The transaction request outcome is unknown. Inspect wallet and account activity before starting a new action.'
				});
			});
	}, [
		batch,
		dispatch,
		predecessorsConfirmed,
		reserveBroadcast,
		transaction,
		transactionIndex,
		walletMatches,
		writeContractAsync
	]);

	const receipt = useWaitForTransactionReceipt({
		chainId: batch?.chainId,
		hash: transaction.hash,
		scopeKey: batch
			? `transaction-confirmation:${batch.id}:${transaction.id}:${transaction.confirmationAttempt}`
			: 'transaction-confirmation:inactive',
		onReplaced(replacement) {
			if (!batch || !transaction.hash) return;
			dispatch({
				type: 'receipt_replaced',
				batchId: batch.id,
				transactionId: transaction.id,
				confirmationAttempt: transaction.confirmationAttempt,
				hash: transaction.hash,
				replacementHash: replacement.transaction.hash,
				reason: replacement.reason,
				receiptStatus: replacement.transactionReceipt.status
			});
		},
		query: {
			enabled: Boolean(batch && transaction.hash && transaction.phase === 'confirming'),
			retry: false
		}
	});

	useEffect(() => {
		if (
			transaction.confirmationAttempt === 0 ||
			transaction.phase !== 'confirming' ||
			receiptRetryStartedRef.current
		)
			return;
		receiptRetryStartedRef.current = true;
		void receipt.refetch();
	}, [receipt, transaction.confirmationAttempt, transaction.phase]);

	useEffect(() => {
		if (!batch || !transaction.hash || transaction.phase !== 'confirming') return;
		if (receipt.status === 'success') {
			if (receipt.data.status === 'success') {
				dispatch({
					type: 'receipt_confirmed',
					batchId: batch.id,
					transactionId: transaction.id,
					confirmationAttempt: transaction.confirmationAttempt,
					hash: transaction.hash
				});
			} else {
				dispatch({
					type: 'receipt_reverted',
					batchId: batch.id,
					transactionId: transaction.id,
					confirmationAttempt: transaction.confirmationAttempt,
					hash: transaction.hash,
					message: 'Transaction reverted.'
				});
			}
		} else if (receipt.status === 'error') {
			dispatch({
				type: 'receipt_wait_failed',
				batchId: batch.id,
				transactionId: transaction.id,
				confirmationAttempt: transaction.confirmationAttempt,
				hash: transaction.hash,
				message: errorMessage(receipt.error)
			});
		}
	}, [batch, dispatch, receipt.data, receipt.error, receipt.status, transaction]);

	return null;
}
