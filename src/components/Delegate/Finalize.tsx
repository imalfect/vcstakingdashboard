'use client';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import humanify from '@/scripts/humanify';
import Validator from '@/types/validator';
import dayjs from 'dayjs';

export default function DelegateFinalize(props: {
	onSuccess: () => void;
	onFail: () => void;
	onRestart: () => void;
	amount: bigint;
	duration: number;
	validator: Validator;
}) {
	return (
		<div className={'flex flex-col items-center justify-center gap-6'}>
			<PageHeader
				title={'Finalize'}
				subtitle={"Review your delegation and confirm it. You won't be able to change it later."}
			/>
			<p className={'text-xl'}>
				You are delegating <span className={'font-bold'}>{humanify(props.amount)} VC</span> to{' '}
				<span className={'font-bold'}>Validator {props.validator.id.toString()}.</span> This delegation{' '}
				<span className={'font-bold'}>
					will{' '}
					{props.duration === 0
						? 'not be locked'
						: `be locked for ${dayjs(props.duration).format('DD')} ${parseInt(dayjs(props.duration).format('DD')) === 1 ? 'day' : 'days'}`}
				</span>
			</p>
			<div className={'flex justify-center gap-6'}>
				<Button
					onClick={() => {
						props.onSuccess();
					}}
					className={'px-12'}
				>
					Delegate
				</Button>
				<Button
					variant={'secondary'}
					onClick={() => {
						props.onRestart();
					}}
					className={'px-12'}
				>
					Restart
				</Button>
			</div>
		</div>
	);
}
