import UndelegateContent from '@/components/Modals/Contents/UndelegateContent';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger
} from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Delegation } from '@/types/delegation';
import Validator from '@/types/validator';
import { VinuChain } from '@/types/vinuChain';
import * as React from 'react';
import { useState } from 'react';
import { Chain } from 'viem';
import { useClient } from 'wagmi';

export default function UndelegateModal(props: {
	delegation: Delegation;
	validator: Validator | null;
	children?: React.ReactNode;
}) {
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
						{props.children ? props.children : <Button variant={'secondary'}>Undelegate</Button>}
					</DialogTrigger>
					<DialogContent className="sm:max-w-[500px] ">
						<DialogHeader>
							<DialogTitle>Undelegate</DialogTitle>
							<DialogDescription>Withdraw your delegation and unlock your coins.</DialogDescription>
						</DialogHeader>
						<UndelegateContent delegation={props.delegation} />
					</DialogContent>
				</Dialog>
			</>
		);
	}

	return (
		<>
			<Drawer open={open} onOpenChange={setOpen}>
				<DrawerTrigger asChild>
					{props.children ? props.children : <Button variant={'secondary'}>Undelegate</Button>}
				</DrawerTrigger>
				<DrawerContent className={'px-3'}>
					<DrawerHeader>
						<DrawerTitle>Undelegate</DrawerTitle>
						<DrawerDescription>Withdraw your delegation and unlock your coins.</DrawerDescription>
					</DrawerHeader>
					<UndelegateContent delegation={props.delegation} mobile />
				</DrawerContent>
			</Drawer>
		</>
	);
}
