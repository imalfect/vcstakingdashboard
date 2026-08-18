'use client';
import { useStakingSession } from '@/components/Contexts/StakingSession';
import PageHeader from '@/components/Misc/PageHeader';
import sfc from '@/config/contracts/sfc';

import { useTransactionBatch } from '@/components/TransactionProcessor/context';
import { TransactionRequest } from '@/components/TransactionProcessor/types';
import { Button } from '@/components/ui/button';
import delegateToValidator from '@/generators/write/delegateToValidator';
import lockupValidatorDelegation from '@/generators/write/lockupValidatorDelegation';
import relockValidatorDelegation from '@/generators/write/relockValidatorDelegation';
import humanify from '@/scripts/humanify';
import { LockedDelegation } from '@/types/lockedDelegation';
import Validator from '@/types/validator';
import dayjs from 'dayjs';

export default function DelegateFinalize(props: {
	onSuccess: () => void;
	onFail: () => void;
	onRestart: () => void;
	amount: bigint;
	duration: number;
	validator: Validator;
	previousDelegation?: LockedDelegation;
}) {
	const transactionBatch = useTransactionBatch({
		onCompleted: props.onSuccess,
		onCancelled: props.onFail,
		onFailed: props.onFail
	});
	const state = useStakingSession();
	const session = state.status === 'supported' ? state.session : undefined;
	const sfcAddress = session?.chain.contracts.sfc.address;
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
					disabled={!sfcAddress}
					onClick={() => {
						if (!sfcAddress) return;
						const transactions: TransactionRequest[] = [
							delegateToValidator(sfc, sfcAddress, props.validator.id, props.amount)
						];
						if (props.duration !== 0) {
							const duration = dayjs.unix(props.duration).diff(dayjs(), 'seconds');
							transactions.push(
								props.previousDelegation === undefined
									? lockupValidatorDelegation(sfc, sfcAddress, props.validator.id, props.amount, duration)
									: relockValidatorDelegation(sfc, sfcAddress, props.validator.id, props.amount, duration)
							);
						}
						transactionBatch.start(transactions);
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

/*

 */
