import {
	useTransactionProcessor,
	useTransactionProcessorDispatch
} from '@/components/TransactionProcessor/context';
import TransactionProcessorTransaction from '@/components/TransactionProcessor/Transaction';
import { TrackedTransaction } from '@/components/TransactionProcessor/types';
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
import { useMediaQuery } from '@/hooks/useMediaQuery';

export function TransactionProcessorModal(props: {
	open: boolean;
	onSuccess: () => void;
	onFail: (transactions: TrackedTransaction[]) => void;
}) {
	const isDesktop = useMediaQuery('(min-width: 768px)');
	const transactions = useTransactionProcessor();
	const dispatch = useTransactionProcessorDispatch();
	if (isDesktop) {
		return (
			<Dialog open={props.open}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Finalize Transaction</DialogTitle>
						<DialogDescription>
							Please review the transaction details before finalizing.
						</DialogDescription>
					</DialogHeader>
					{transactions.map((transaction) => (
						<TransactionProcessorTransaction id={transaction.id} key={transaction.id} />
					))}
					<DialogFooter className="pt-2">
						<Button
							variant="outline"
							disabled={
								transactions.some((transaction) => transaction.status === 'pending') ||
								transactions.every((transaction) => transaction.status === 'success')
							}
							onClick={() => {
								props.onFail(transactions);
							}}
						>
							Cancel
						</Button>
						{transactions.some((transaction) => transaction.status === 'error') &&
							transactions.some((transaction) => transaction.status !== 'pending') && (
								<Button
									variant="secondary"
									onClick={() => {
										dispatch({
											type: 'retry_failed_transactions'
										});
									}}
								>
									Retry
								</Button>
							)}
						<Button
							disabled={!transactions.every((transaction) => transaction.status === 'success')}
							onClick={() => {
								props.onSuccess();
							}}
						>
							Continue
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer open={props.open}>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Finalize Transaction</DrawerTitle>
					<DrawerDescription>Please review the transaction details before finalizing.</DrawerDescription>
				</DrawerHeader>
				<div className={'mx-auto flex flex-col items-start gap-3'}>
					{transactions.map((transaction: TrackedTransaction) => (
						<TransactionProcessorTransaction id={transaction.id} key={transaction.id} />
					))}
				</div>
				<DrawerFooter className="pt-2">
					<Button
						variant="outline"
						disabled={transactions.some((transaction) => transaction.status === 'pending')}
						onClick={() => {
							props.onFail(transactions);
						}}
					>
						Cancel
					</Button>
					{transactions.some((transaction) => transaction.status === 'error') &&
						transactions.some((transaction) => transaction.status !== 'pending') && (
							<Button
								variant="secondary"
								onClick={() => {
									dispatch({
										type: 'retry_failed_transactions'
									});
								}}
							>
								Retry
							</Button>
						)}
					<Button
						disabled={!transactions.every((transaction) => transaction.status === 'success')}
						onClick={() => {
							props.onSuccess();
						}}
					>
						Continue
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
