import DocumentModal from '@/components/Modals/DocumentModal';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerFooter } from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useEffect, useState } from 'react';

export default function RelockNoticeModal(props: {
	open: boolean;
	onOpenChange: (newState: boolean) => void;
}) {
	const isDesktop = useMediaQuery('(min-width: 768px)');
	const [remainingTimeSeconds, setRemainingTimeSeconds] = useState(6);
	const [documentOpen, setDocumentOpen] = useState(false);
	const interval = setInterval(() => {
		setRemainingTimeSeconds((time) => time - 1);
	}, 1000);
	useEffect(() => {
		if (remainingTimeSeconds === 0) {
			clearInterval(interval);
		}
		return () => {
			clearInterval(interval);
		};
	}, [interval, remainingTimeSeconds]);
	if (isDesktop) {
		return (
			<>
				<Dialog open={props.open}>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Locked delegation already exists</DialogTitle>
						</DialogHeader>
						<p>
							You already have a locked delegation to this validators. If you lock this one, your previous
							delegations to this validator will be locked to that date as well.
						</p>
						<DialogFooter>
							<Button
								variant={'secondary'}
								onClick={() => {
									setDocumentOpen(true);
								}}
							>
								What is relocking
							</Button>
							<Button
								disabled={remainingTimeSeconds !== 0}
								onClick={() => {
									props.onOpenChange(false);
								}}
							>
								Acknowledge {remainingTimeSeconds === 0 ? '' : `(${remainingTimeSeconds}s)`}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
				<DocumentModal id={'relock'} open={documentOpen} onOpenChange={setDocumentOpen} />
			</>
		);
	}

	return (
		<>
			<Drawer open={props.open} dismissible={false}>
				<DrawerContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle className={'mt-3'}>Locked delegation already exists</DialogTitle>
					</DialogHeader>
					<p className={'mt-3 px-6'}>
						You already have a locked delegation to this validators. If you lock this one, your previous
						delegations to this validator will be locked to that date as well.
					</p>
					<DrawerFooter>
						<Button
							variant={'secondary'}
							onClick={() => {
								setDocumentOpen(true);
							}}
						>
							What is relocking
						</Button>
						<Button
							disabled={remainingTimeSeconds > 0}
							onClick={() => {
								props.onOpenChange(false);
							}}
						>
							Acknowledge {remainingTimeSeconds <= 0 ? '' : `(${remainingTimeSeconds}s)`}
						</Button>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
			<DocumentModal id={'relock'} open={documentOpen} onOpenChange={setDocumentOpen} />
		</>
	);
}
