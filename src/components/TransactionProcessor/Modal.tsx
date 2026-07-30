'use client';

import { useTransactionProcessorContext } from '@/components/TransactionProcessor/context';
import type { TrackedTransaction } from '@/components/TransactionProcessor/types';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog';
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle
} from '@/components/ui/drawer';
import { chains } from '@/config/wagmiShared';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { LucideCheck, LucideLoader2, LucidePause, LucideX } from 'lucide-react';
import type { ReactNode } from 'react';

const terminalFailurePhases = new Set([
	'broadcast_outcome_unknown',
	'reverted',
	'replacement_failed',
	'stopped'
]);

function TransactionRow({
	transaction,
	explorerUrl
}: {
	transaction: TrackedTransaction;
	explorerUrl?: string;
}) {
	const busy = ['queued', 'awaiting_wallet', 'confirming'].includes(transaction.phase);
	const failed = [
		'broadcast_failed',
		'broadcast_outcome_unknown',
		'confirmation_failed',
		'reverted',
		'replacement_failed',
		'stopped',
		'skipped'
	].includes(transaction.phase);
	return (
		<div className="flex items-center gap-4">
			<div>
				{busy && <LucideLoader2 className="animate-spin" />}
				{transaction.phase === 'paused_wallet_mismatch' && <LucidePause className="text-amber-500" />}
				{transaction.phase === 'confirmed' && <LucideCheck className="text-green-500" />}
				{failed && <LucideX className="text-red-500" />}
			</div>
			<div className="flex flex-col gap-1">
				<p className="font-bold">{transaction.request.name}</p>
				<p className="text-sm">
					{transaction.message ??
						(transaction.phase === 'confirmed'
							? 'Confirmed.'
							: transaction.phase === 'confirming'
								? 'Waiting for confirmation.'
								: transaction.phase === 'queued'
									? 'Queued.'
									: transaction.phase.replaceAll('_', ' '))}
					{transaction.hash && explorerUrl && (
						<>
							{' '}
							<a
								className="font-bold"
								href={`${explorerUrl}/transactions/${transaction.hash}`}
								rel="noreferrer"
								target="_blank"
							>
								View in explorer
							</a>
						</>
					)}
				</p>
			</div>
		</div>
	);
}

function Actions() {
	const { state, dispatch, refreshingTransactionIds } = useTransactionProcessorContext();
	const batch = state.active;
	if (!batch) return null;
	const allConfirmed = batch.transactions.every(({ phase }) => phase === 'confirmed');
	const hasTerminalFailure = batch.transactions.some(({ phase }) =>
		terminalFailurePhases.has(phase)
	);
	const retryable = batch.transactions.find(
		({ phase }) => phase === 'broadcast_failed' || phase === 'confirmation_failed'
	);
	const retryIndex = retryable ? batch.transactions.findIndex(({ id }) => id === retryable.id) : -1;
	const predecessorsConfirmed =
		retryIndex >= 0 &&
		batch.transactions.slice(0, retryIndex).every(({ phase }) => phase === 'confirmed');
	const canStop =
		retryable?.phase === 'broadcast_failed' && !retryable.hash && predecessorsConfirmed;
	const canCancel = !batch.transactions.some(
		({ hash, phase }) => hash || phase === 'awaiting_wallet'
	);
	const refreshing = batch.transactions.some(
		({ id, phase }) => phase === 'confirmed' && refreshingTransactionIds.has(id)
	);

	return (
		<>
			{canCancel && !allConfirmed && !hasTerminalFailure && (
				<Button variant="outline" onClick={() => dispatch({ type: 'cancel_batch', batchId: batch.id })}>
					Cancel
				</Button>
			)}
			{retryable && predecessorsConfirmed && (
				<Button
					variant="secondary"
					onClick={() =>
						dispatch({ type: 'retry_transaction', batchId: batch.id, transactionId: retryable.id })
					}
				>
					Retry
				</Button>
			)}
			{canStop && (
				<Button
					variant="destructive"
					onClick={() =>
						dispatch({ type: 'stop_remaining', batchId: batch.id, transactionId: retryable.id })
					}
				>
					Stop remaining
				</Button>
			)}
			{allConfirmed && (
				<Button
					disabled={refreshing}
					onClick={() => dispatch({ type: 'acknowledge_completed', batchId: batch.id })}
				>
					{refreshing ? 'Refreshing dashboard…' : 'Continue'}
				</Button>
			)}
			{hasTerminalFailure && (
				<Button onClick={() => dispatch({ type: 'acknowledge_failed', batchId: batch.id })}>
					Close failed
				</Button>
			)}
		</>
	);
}

function Body({ header, footer }: { header: ReactNode; footer: ReactNode }) {
	const { state } = useTransactionProcessorContext();
	const batch = state.active;
	if (!batch) return null;
	const explorerUrl = chains.find(({ id }) => id === batch.chainId)?.blockExplorers.default.url;
	return (
		<>
			{header}
			<div className="flex flex-col gap-3">
				{batch.transactions.map((transaction) => (
					<TransactionRow key={transaction.id} transaction={transaction} explorerUrl={explorerUrl} />
				))}
			</div>
			{footer}
		</>
	);
}

export function TransactionProcessorModal() {
	const { state } = useTransactionProcessorContext();
	const isDesktop = useMediaQuery('(min-width: 768px)');
	const open = state.active !== null;
	if (isDesktop) {
		return (
			<Dialog open={open}>
				<DialogContent
					className="sm:max-w-[425px]"
					showCloseButton={false}
					onEscapeKeyDown={(event) => event.preventDefault()}
					onPointerDownOutside={(event) => event.preventDefault()}
					onInteractOutside={(event) => event.preventDefault()}
				>
					<Body
						header={
							<DialogHeader>
								<DialogTitle>Finalize Transaction</DialogTitle>
								<DialogDescription>Complete each transaction in order.</DialogDescription>
							</DialogHeader>
						}
						footer={
							<DialogFooter className="pt-2">
								<Actions />
							</DialogFooter>
						}
					/>
				</DialogContent>
			</Dialog>
		);
	}
	return (
		<Drawer open={open} dismissible={false}>
			<DrawerContent>
				<Body
					header={
						<DrawerHeader>
							<DrawerTitle>Finalize Transaction</DrawerTitle>
							<DrawerDescription>Complete each transaction in order.</DrawerDescription>
						</DrawerHeader>
					}
					footer={
						<DrawerFooter className="pt-2">
							<Actions />
						</DrawerFooter>
					}
				/>
			</DrawerContent>
		</Drawer>
	);
}
