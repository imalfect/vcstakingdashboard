'use client';
import PageHeader from '@/components/Misc/PageHeader';
import sfc from '@/config/contracts/sfc';

import TransactionProcessor from '@/components/TransactionProcessor/Processor';
import { Button } from '@/components/ui/button';
import vcMainnet from '@/config/chains/vcMainnet';
import delegateToValidator from '@/generators/write/delegateToValidator';
import lockupValidatorDelegation from '@/generators/write/lockupValidatorDelegation';
import relockValidatorDelegation from '@/generators/write/relockValidatorDelegation';
import humanify from '@/scripts/humanify';
import { LockedDelegation } from '@/types/lockedDelegation';
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
	previousDelegation?: LockedDelegation;
}) {
	const [active, setActive] = useState(false);
	const account = useAccount();
	return (
		<div className={'flex flex-col items-center justify-center gap-6'}>
			<PageHeader
				title={'Finalize'}
				subtitle={"Review your delegation and confirm it. You won't be able to change it later."}
			/>
			<p className={'px-6 text-xl'}>
				You are delegating <span className={'font-bold'}>{humanify(props.amount)} VC</span> to{' '}
				<b>Validator {props.validator.id.toString()}.</b> This delegation{' '}
				<span>
					will{' '}
					{props.duration === 0 ? (
						<b>not be locked</b>
					) : (
						<>
							{props.previousDelegation === undefined ? (
								<b>be locked</b>
							) : (
								<>
									{' '}
									<b>be relocked</b> with{' '}
									<b>your previous {humanify(props.previousDelegation.lockedStake)} VC delegation</b>
								</>
							)}
							<span>
								{' '}
								for{' '}
								<b>
									{dayjs.unix(props.duration).diff(dayjs(), 'days')}{' '}
									{dayjs.unix(props.duration).diff(dayjs(), 'days') === 1 ? 'day' : 'days'}
								</b>
								.
							</span>
						</>
					)}
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
						!props.previousDelegation &&
						lockupValidatorDelegation(
							sfc,
							(account.chain as typeof vcMainnet).contracts.sfc.address,
							props.validator.id,
							props.amount,
							dayjs.unix(props.duration).diff(dayjs(), 'seconds')
						),
					props.duration !== 0 &&
						props.previousDelegation !== undefined &&
						relockValidatorDelegation(
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
