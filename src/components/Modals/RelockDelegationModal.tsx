import { useStakingSession } from '@/components/Contexts/StakingSession';
import RelockDelegationContent from '@/components/Modals/Contents/RelockDelegationContent';
import { useTransactionBatch } from '@/components/TransactionProcessor/context';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger
} from '@/components/ui/drawer';
import sfc from '@/config/contracts/sfc';
import relockValidatorDelegation from '@/generators/write/relockValidatorDelegation';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Delegation } from '@/types/delegation';
import Validator from '@/types/validator';
import dayjs from 'dayjs';
import * as React from 'react';
import { useState } from 'react';

export default function RelockDelegationModal(props: {
	delegation: Delegation;
	validator: Validator;
	children?: React.ReactNode;
}) {
	const state = useStakingSession();
	const session = state.status === 'supported' ? state.session : undefined;
	const sfcAddress = session?.chain.contracts.sfc.address;
	const [open, setOpen] = useState(false);
	const [newLockDate, setNewLockDate] = useState<Date | null>(null);
	const handleOpenChange = (nextOpen: boolean) => {
		setOpen(nextOpen);
		if (!nextOpen) setNewLockDate(null);
	};
	const transactionBatch = useTransactionBatch({ onCompleted: () => handleOpenChange(false) });
	const startRelock = () => {
		if (!newLockDate || !sfcAddress) return;
		transactionBatch.start([
			relockValidatorDelegation(
				sfc,
				sfcAddress,
				props.delegation.validatorId,
				props.delegation.unlockedAmount,
				dayjs(newLockDate).diff(dayjs(), 'seconds')
			)
		]);
	};
	const isDesktop = useMediaQuery('(min-width: 768px)');
	if (isDesktop) {
		return (
			<>
				<Dialog open={open} onOpenChange={handleOpenChange}>
					<DialogTrigger asChild>
						{props.children ? props.children : <Button variant={'secondary'}>Relock</Button>}
					</DialogTrigger>
					<DialogContent className="sm:max-w-[425px] ">
						<DialogHeader>
							<DialogTitle>Relock</DialogTitle>
							<DialogDescription>
								Lock your coins for a longer period to maximize your rewards.
							</DialogDescription>
						</DialogHeader>
						<RelockDelegationContent
							key={open.toString()}
							delegation={props.delegation}
							validator={props.validator}
							onNewLockDate={setNewLockDate}
							newLockDate={newLockDate}
						/>
						<DialogFooter>
							<Button variant="outline" onClick={() => handleOpenChange(false)}>
								Cancel
							</Button>
							<Button onClick={startRelock} disabled={!newLockDate || !sfcAddress}>
								Relock
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</>
		);
	}

	return (
		<>
			<Drawer open={open} onOpenChange={handleOpenChange}>
				<DrawerTrigger asChild>
					{props.children ? props.children : <Button variant={'secondary'}>Relock</Button>}
				</DrawerTrigger>
				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>Relock</DrawerTitle>
						<DrawerDescription>
							Lock your coins for a longer period to maximize your rewards.
						</DrawerDescription>
					</DrawerHeader>
					<RelockDelegationContent
						key={open.toString()}
						mobile
						delegation={props.delegation}
						validator={props.validator}
						onNewLockDate={setNewLockDate}
						newLockDate={newLockDate}
					/>
					<DrawerFooter className={'grid grid-flow-col grid-cols-2 gap-2'}>
						<Button variant="outline" onClick={() => handleOpenChange(false)}>
							Cancel
						</Button>
						<Button onClick={startRelock} disabled={!newLockDate || !sfcAddress}>
							Relock
						</Button>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</>
	);
}
