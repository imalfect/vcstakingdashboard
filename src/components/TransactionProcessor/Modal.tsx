import TransactionProcessorTransaction from '@/components/TransactionProcessor/Transaction';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle
} from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { TransactionStatus } from '@/types/transaction';

export function TransactionProcessorModal(props: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	transactions: TransactionStatus[];
}) {
	const isDesktop = useMediaQuery('(min-width: 768px)');

	if (isDesktop) {
		return (
			<Dialog open={props.open} onOpenChange={props.onOpenChange}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Finalize Transaction</DialogTitle>
						<DialogDescription>
							Please review the transaction details before finalizing.
						</DialogDescription>
					</DialogHeader>
					{props.transactions.map((transaction, index) => (
						<TransactionProcessorTransaction
							key={index}
							name={transaction.name}
							status={transaction.status}
							message={transaction.message}
						/>
					))}
					<DialogFooter className="pt-2">
						<DialogClose asChild>
							<Button variant="outline">Cancel</Button>
						</DialogClose>
						<Button variant="secondary">Retry</Button>
						<Button>Continue</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer open={props.open} onOpenChange={props.onOpenChange}>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Finalize Transaction</DrawerTitle>
					<DrawerDescription>Please review the transaction details before finalizing.</DrawerDescription>
				</DrawerHeader>
				<div className={'mx-auto flex flex-col items-start gap-3'}>
					{props.transactions.map((transaction, index) => (
						<TransactionProcessorTransaction
							key={index}
							name={transaction.name}
							status={transaction.status}
							message={transaction.message}
						/>
					))}
				</div>
				<DrawerFooter className="pt-2">
					<DrawerClose asChild>
						<Button variant="outline">Cancel</Button>
					</DrawerClose>
					<div className={'flex flex-grow gap-3'}>
						<Button variant="secondary">Retry</Button>
						<Button>Continue</Button>
					</div>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
