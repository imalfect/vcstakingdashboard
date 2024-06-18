import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { unixify } from '@/scripts/unixify';
import Validator from '@/types/validator';
import dayjs from 'dayjs';
import { useState } from 'react';

export default function DelegateDuration(props: {
	onDuration: (duration: number) => void;
	validator: Validator;
}) {
	const [duration, setDuration] = useState(0);
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
					fromDate={dayjs().add(14, 'days').toDate()}
					toDate={dayjs()
						.add(props.validator.remainingLockedStakeDays - 1, 'days')
						.toDate()}
				/>
			</div>

			<div className={'flex justify-center gap-6'}>
				<Button
					disabled={duration === 0}
					onClick={() => {
						props.onDuration(duration);
					}}
					className={'px-12'}
				>
					Continue
				</Button>
				<Button
					variant={'secondary'}
					onClick={() => {
						props.onDuration(0);
					}}
					className={'px-12'}
				>
					Don&apos;t lock
				</Button>
			</div>
		</div>
	);
}
