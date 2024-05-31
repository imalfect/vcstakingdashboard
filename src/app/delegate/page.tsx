'use client';
import DelegateAmount from '@/components/Delegate/Amount';
import DelegateDuration from '@/components/Delegate/Duration';
import DelegateValidators from '@/components/Delegate/Validators';
import DelegateWarning from '@/components/Delegate/Warning';
import PageHeader from '@/components/PageHeader';
import { useState } from 'react';
enum Screen {
	Warning,
	Validators,
	Amount,
	Duration,
	Review,
	Success
}
export default function Delegate() {
	const [screen, setScreen] = useState<Screen>(Screen.Amount);
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
					onContinue={() => {
						setScreen(Screen.Amount);
					}}
				/>
			)}
			{screen === Screen.Amount && (
				<DelegateAmount
					onAmount={() => {
						setScreen(Screen.Duration);
					}}
				/>
			)}
			{screen === Screen.Duration && (
				<DelegateDuration
					onDuration={() => {
						setScreen(Screen.Review);
					}}
				/>
			)}
			{/*{screen === Screen.Review && (
				<DelegateReview
					onReview={() => {
						setScreen(Screen.Success);
					}}
				/>
			)}*/}
			{/*{screen === Screen.Success && <DelegateSuccess />}*/}
		</main>
	);
}
