'use client';
import DelegateAmount from '@/components/Delegate/Amount';
import DelegateDuration from '@/components/Delegate/Duration';
import DelegateFinalize from '@/components/Delegate/Finalize';
import DelegateValidators from '@/components/Delegate/Validators';
import DelegateWarning from '@/components/Delegate/Warning';
import PageHeader from '@/components/PageHeader';
import Validator from '@/types/validator';
import { useState } from 'react';
enum Screen {
	Warning,
	Validators,
	Amount,
	Duration,
	Finalize,
	Success,
	Failure
}
export default function Delegate() {
	const [screen, setScreen] = useState<Screen>(Screen.Amount);
	const [validator, setValidator] = useState<Validator | null>({
		id: 1n,
		auth: '0xbF011bB43D12909b4F56bC46dfb1Bf8B2f900d68',
		createdEpoch: 1025n,
		createdTime: 1709980041n,
		deactivated: false,
		deactivatedEpoch: undefined,
		deactivatedTime: undefined,
		delegatedStake: 242521800000000000000000n,
		lockedSelfStake: 200000000000000000000000n,
		receivedStake: 442521800000000000000000n,
		remainingLockedStakeDays: 12,
		selfStake: 200000000000000000000000n,
		socialInfoUrl: 'https://v9000.dev/v9000.json',
		status: 0n
	});
	const [amount, setAmount] = useState(0n);
	const [duration, setDuration] = useState(0);
	return (
		<main className={'flex min-h-screen flex-col items-center justify-center'}>
			<PageHeader
				hidden
				title={'Delegate'}
				subtitle={"It's time to choose the validator you'd like to support."}
			/>
			{/*<span className={'text-sm'}>
				TIP: Click on a validator&apos;s name to learn more about them!
			</span>
			<div className={'mt-3 flex gap-3'}>
				<ValidatorCard />
				<ValidatorCard />
			</div>*/}
			{screen === Screen.Warning && (
				<DelegateWarning
					onAccepted={() => {
						setScreen(Screen.Validators);
					}}
				/>
			)}
			{screen === Screen.Validators && (
				<DelegateValidators
					onValidator={(validator: Validator) => {
						setValidator(validator);
						setScreen(Screen.Amount);
					}}
				/>
			)}
			{screen === Screen.Amount && (
				<DelegateAmount
					onAmount={(amount: bigint) => {
						setAmount(amount);
						setScreen(Screen.Duration);
					}}
				/>
			)}
			{screen === Screen.Duration && (
				<DelegateDuration
					/* Validator is already chosen here by a previous step */
					validator={validator!}
					onDuration={(duration: number) => {
						setDuration(duration);
						setScreen(Screen.Finalize);
					}}
				/>
			)}
			{screen === Screen.Finalize && (
				<DelegateFinalize
					amount={amount}
					duration={duration}
					validator={validator!}
					onFail={() => {}}
					onSuccess={() => {}}
					onRestart={() => {
						setScreen(Screen.Warning);
					}}
				/>
			)}
			{/*{screen === Screen.Success && <DelegateSuccess />}*/}
		</main>
	);
}
