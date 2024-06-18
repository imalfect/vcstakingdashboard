'use client';
import PageHeader from '@/components/PageHeader';
import sfc from '@/config/contracts/sfc';

import TransactionProcessor from '@/components/TransactionProcessor/Processor';
import { Button } from '@/components/ui/button';
import vcMainnet from '@/config/chains/vcMainnet';
import delegateToValidator from '@/generators/delegateToValidator';
import lockupValidatorDelegation from '@/generators/lockupValidatorDelegation';
import humanify from '@/scripts/humanify';
import Validator from '@/types/validator';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export default function DelegateFinalize(props: {
	onSuccess: () => void;
	onFail: () => void;
	onRestart: () => void;
	amount: bigint;
	duration: number;
	validator: Validator;
}) {
	const [active, setActive] = useState(false);
	const account = useAccount();
	console.log(dayjs.unix(props.duration).diff(dayjs(), 'seconds'));
	// @ts-ignore
	// @ts-ignore
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
						: `be locked for ${dayjs.unix(props.duration).diff(dayjs(), 'days')} ${dayjs.unix(props.duration).diff(dayjs(), 'days') === 1 ? 'day' : 'days'}`}
				</span>
			</p>
			<div className={'flex justify-center gap-6'}>
				<Button
					onClick={() => {
						setActive(true);
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
			<TransactionProcessor
				//	@ts-ignore
				transactions={[
					delegateToValidator(
						sfc,
						(account.chain as typeof vcMainnet).contracts.sfc.address,
						props.validator.id,
						props.amount
					),
					props.duration !== 0 &&
						lockupValidatorDelegation(
							sfc,
							(account.chain as typeof vcMainnet).contracts.sfc.address,
							props.validator.id,
							props.amount,
							dayjs.unix(props.duration).diff(dayjs(), 'seconds')
						)
				].filter(Boolean)}
				onSuccess={props.onSuccess}
				onFail={props.onFail}
				active={active}
			/>
		</div>
	);
}

/*

 */
