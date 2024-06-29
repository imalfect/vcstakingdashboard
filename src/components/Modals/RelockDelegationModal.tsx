import { UpdateContext } from '@/components/Contexts/UpdateContext';
import RelockDelegationContent from '@/components/Modals/Contents/RelockDelegationContent';
import TransactionProcessor from '@/components/TransactionProcessor/Processor';
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
import { VinuChain } from '@/types/vinuChain';
import dayjs from 'dayjs';
import * as React from 'react';
import { useContext, useState } from 'react';
import { Chain } from 'viem';
import { useClient } from 'wagmi';

export default function RelockDelegationModal(props: {
	delegation: Delegation;
	validator: Validator | null;
	children?: React.ReactNode;
}) {
	const update = useContext(UpdateContext);
	const client = useClient();
	const typedChain = client?.chain as (Chain & VinuChain) | undefined;
	const [open, setOpen] = useState(false);
	const [newLockDate, setNewLockDate] = useState<Date | null>(null);
	const [processorActive, setProcessorActive] = useState(false);
	const isDesktop = useMediaQuery('(min-width: 768px)');
	if (isDesktop) {
		return (
			<>
				<Dialog open={open} onOpenChange={setOpen}>
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
							delegation={props.delegation}
							validator={props.validator}
							onNewLockDate={setNewLockDate}
							newLockDate={newLockDate}
						/>
						<DialogFooter>
							<Button variant="outline" onClick={() => setOpen(false)}>
								Cancel
							</Button>
							<Button onClick={() => setProcessorActive(true)} disabled={!newLockDate}>
								Relock
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
				<TransactionProcessor
					transactions={[
						relockValidatorDelegation(
							sfc,
							typedChain?.contracts.sfc.address!,
							props.delegation.validatorId,
							props.delegation.unlockedAmount,
							dayjs(newLockDate).diff(dayjs(), 'seconds')
						)
					]}
					onSuccess={() => {
						setProcessorActive(false);
						setOpen(false);
						update();
					}}
					onFail={() => {
						setProcessorActive(false);
						setOpen(false);
					}}
					active={processorActive}
				/>
			</>
		);
	}

	return (
		<>
			<Drawer open={open} onOpenChange={setOpen}>
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
						mobile
						delegation={props.delegation}
						validator={props.validator}
						onNewLockDate={setNewLockDate}
						newLockDate={newLockDate}
					/>
					<DrawerFooter className={'grid grid-flow-col grid-cols-2 gap-2'}>
						<Button variant="outline" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button onClick={() => setProcessorActive(true)} disabled={!newLockDate}>
							Relock
						</Button>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
			<TransactionProcessor
				transactions={[
					relockValidatorDelegation(
						sfc,
						typedChain?.contracts.sfc.address!,
						props.delegation.validatorId,
						props.delegation.unlockedAmount,
						dayjs(newLockDate).diff(dayjs(), 'seconds')
					)
				]}
				onSuccess={() => {
					setProcessorActive(false);
					setOpen(false);
				}}
				onFail={() => {
					setProcessorActive(false);
					setOpen(false);
				}}
				active={processorActive}
			/>
		</>
	);
}
