import { DatePicker } from '@/components/ui/date-picker';
import humanify from '@/scripts/humanify';
import { Delegation } from '@/types/delegation';
import Validator from '@/types/validator';
import { clsx } from 'clsx';
import dayjs from 'dayjs';
import { LucideLockKeyhole, LucideLockOpen } from 'lucide-react';

export default function RelockDelegationContentModal(props: {
	mobile?: boolean;
	delegation: Delegation;
	validator: Validator | null;
	onNewLockDate: (date: Date) => void;
	newLockDate: Date | null;
}) {
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
				You can only relock your delegation for a longer time than your locked delegation.
			</p>
			<div className={'mt-3 flex justify-center'}>
				<DatePicker
					onDate={(date) => {
						props.onNewLockDate(date);
					}}
					fromDate={
						props.delegation
							? (() => {
									const validatorMinimumLockup = dayjs
										.unix(parseInt(props.delegation.lockedDelegation!.endTime.toString()))
										.add(1, 'day');
									const minimumLockup = dayjs().add(15, 'days');
									if (props.delegation.lockedDelegation!.lockedStake === 0n) return minimumLockup.toDate();
									return validatorMinimumLockup.isAfter(minimumLockup)
										? validatorMinimumLockup.toDate()
										: minimumLockup.toDate();
								})()
							: dayjs().add(14, 'days').toDate()
					}
					toDate={dayjs()
						.add(props.validator?.remainingLockedStakeDays! - 1, 'days')
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
