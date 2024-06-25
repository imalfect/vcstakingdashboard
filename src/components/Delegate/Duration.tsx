import PageHeader from '@/components/Misc/PageHeader';
import RelockNoticeModal from '@/components/Modals/RelockNoticeModal';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import useLockedDelegation from '@/hooks/useLockedDelegation';
import { unixify } from '@/scripts/unixify';
import { LockedDelegation } from '@/types/lockedDelegation';
import Validator from '@/types/validator';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

export default function DelegateDuration(props: {
	onDuration: (
		duration: number,
		relock: boolean,
		previousLockedDelegation?: LockedDelegation | null
	) => void;
	validator: Validator;
}) {
	const [duration, setDuration] = useState(0);
	const account = useAccount();
	const previousLockedDelegation = useLockedDelegation(account.address || null, props.validator.id);
	console.log(previousLockedDelegation);
	const [relockNoticeOpen, setRelockNoticeOpen] = useState(previousLockedDelegation !== null);
	const [relockNoticeOpened, setRelockNoticeOpened] = useState(false);
	useEffect(() => {
		if (previousLockedDelegation !== null && !relockNoticeOpened) {
			setRelockNoticeOpen(true);
		} else {
			setRelockNoticeOpen(false);
		}
	}, [previousLockedDelegation, relockNoticeOpened]);
	return (
		<div className={'flex flex-col items-center justify-center gap-6'}>
			<PageHeader
				title={'Choose the duration'}
				subtitle={
					"Select for how long you'd like to lock your coins. The longer, the better the rewards!"
				}
			/>
			<div className={'flex flex-col items-center gap-1'}>
				<DatePicker
					onDate={(date) => {
						setDuration(unixify(date));
					}}
					fromDate={
						previousLockedDelegation
							? (() => {
									const validatorMinimumLockup = dayjs
										.unix(parseInt(previousLockedDelegation.endTime.toString()))
										.add(1, 'day');
									const minimumLockup = dayjs().add(14, 'days');
									return validatorMinimumLockup.isAfter(minimumLockup)
										? validatorMinimumLockup.toDate()
										: minimumLockup.toDate();
								})()
							: dayjs().add(14, 'days').toDate()
					}
					toDate={dayjs()
						.add(props.validator.remainingLockedStakeDays - 1, 'days')
						.toDate()}
				/>
			</div>

			<div className={'flex justify-center gap-6'}>
				<Button
					disabled={duration === 0}
					onClick={() => {
						props.onDuration(duration, previousLockedDelegation !== null, previousLockedDelegation);
					}}
					className={'px-12'}
				>
					Continue {previousLockedDelegation ? 'with relock' : ''}
				</Button>
				<Button
					variant={'secondary'}
					onClick={() => {
						props.onDuration(0, false);
					}}
					className={'px-12'}
				>
					Don&apos;t lock
				</Button>
			</div>
			<RelockNoticeModal
				open={relockNoticeOpen}
				onOpenChange={(newState) => {
					setRelockNoticeOpen(newState);
					setRelockNoticeOpened(true);
				}}
			/>
		</div>
	);
}
