import { MAX_LOCK_DAYS } from '@/config/constants';
import { DatePicker } from '@/components/ui/date-picker';
import humanify from '@/scripts/humanify';
import { Delegation } from '@/types/delegation';
import Validator from '@/types/validator';
import { clsx } from 'clsx';
import dayjs from 'dayjs';
import { LucideLockKeyhole, LucideLockOpen } from 'lucide-react';

export default function RelockDelegationContent(props: {
	mobile?: boolean;
	delegation: Delegation;
	validator: Validator;
	onNewLockDate: (date: Date) => void;
	newLockDate: Date | null;
}) {
	const lockedDelegation = props.delegation.lockedDelegation;
	const minimumLockup = dayjs().add(15, 'days');
	const validatorMinimumLockup =
		lockedDelegation && lockedDelegation.lockedStake !== 0n
			? dayjs.unix(Number(lockedDelegation.endTime)).add(1, 'day')
			: null;
	const fromDate = validatorMinimumLockup?.isAfter(minimumLockup)
		? validatorMinimumLockup.toDate()
		: minimumLockup.toDate();
	return (
		<>
			<div
				className={clsx(
					'flex w-full px-3',
					props.mobile ? 'justify-center gap-12' : 'justify-between gap-6'
				)}
			>
				<div className={'flex flex-col text-center'}>
					<p className={'flex items-center gap-3 text-2xl font-bold'}>
						<LucideLockKeyhole />
						{humanify(props.delegation.lockedAmount)} VC
					</p>
					<span className={'text-sm text-muted-foreground'}>
						{props.delegation.lockedDelegation && props.delegation.lockedAmount !== 0n
							? dayjs.unix(Number(props.delegation.lockedDelegation.endTime)).diff(dayjs(), 'days') +
								' days'
							: 'No locked delegation'}
					</span>
				</div>
				<div className={'flex flex-col text-center'}>
					<p className={'flex items-center gap-3 text-2xl font-bold'}>
						<LucideLockOpen />
						{humanify(props.delegation.unlockedAmount)} VC
					</p>
					<span className={'text-sm text-muted-foreground'}>Unlocked</span>
				</div>
			</div>
			<p className={'mt-2 text-center text-sm'}>
				{lockedDelegation && lockedDelegation.lockedStake !== 0n
					? 'You can only relock your delegation for a longer time than your locked delegation.'
					: 'Choose how long you want to lock your unlocked delegation.'}
			</p>
			<div className={'mt-3 flex justify-center'}>
				<DatePicker
					onDate={(date) => {
						props.onNewLockDate(date);
					}}
					fromDate={fromDate}
					toDate={dayjs()
						.add(Math.min(props.validator.remainingLockedStakeDays - 1, MAX_LOCK_DAYS), 'days')
						.toDate()}
					placeholder={'Choose a new lock date'}
				/>
			</div>
			<div className={'mt-3 flex flex-col text-center'}>
				<p className={'flex items-center justify-center gap-3 text-2xl font-bold'}>
					<LucideLockKeyhole />
					{humanify(props.delegation.totalAmount)} VC
				</p>
				<span className={'text-sm text-muted-foreground'}>
					{props.newLockDate ? (
						<>Locked for {dayjs(props.newLockDate).diff(dayjs(), 'days')} days</>
					) : (
						'Choose a date'
					)}
				</span>
			</div>
		</>
	);
}
