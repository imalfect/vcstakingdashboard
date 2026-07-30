'use client';
import { StakingSessionGate } from '@/components/Contexts/StakingSession';
import PageHeader from '@/components/Misc/PageHeader';
import { LockedDelegation } from '@/types/lockedDelegation';
import Validator from '@/types/validator';
import DelegateAmount from '@/views/Delegate/Amount';
import DelegateDuration from '@/views/Delegate/Duration';
import DelegateFinalize from '@/views/Delegate/Finalize';
import DelegateFinish from '@/views/Delegate/Finish';
import DelegateValidators from '@/views/Delegate/Validators';
import DelegateWarning from '@/views/Delegate/Warning';
import { useEffect, useRef, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';

enum View {
	Warning,
	Validators,
	Amount,
	Duration,
	Finalize,
	Finish
}

export default function Delegate() {
	return (
		<main className={'flex min-h-screen flex-col items-center justify-center px-6'}>
			<PageHeader
				hidden
				title={'Delegate'}
				subtitle={"It's time to choose the validator you'd like to support."}
			/>
			<StakingSessionGate>
				<DelegateSession />
			</StakingSessionGate>
		</main>
	);
}

function DelegateSession() {
	const [validator, setValidator] = useState<Validator>();
	const [amount, setAmount] = useState(0n);
	const [duration, setDuration] = useState(0);
	const [previousLockedDelegation, setPreviousLockedDelegation] = useState<LockedDelegation>();
	const [success, setSuccess] = useState(false);
	const [didAcknowledgeWarning] = useLocalStorage('delegate-warning-acknowledged', false, {
		initializeWithValue: false
	});
	const initialView = didAcknowledgeWarning ? View.Validators : View.Warning;
	const [view, setView] = useState<View>(initialView);
	const warningAcknowledgementApplied = useRef(false);

	useEffect(() => {
		if (!didAcknowledgeWarning || warningAcknowledgementApplied.current) return;
		warningAcknowledgementApplied.current = true;
		setView((currentView) => (currentView === View.Warning ? View.Validators : currentView));
	}, [didAcknowledgeWarning]);


	const resetWizard = () => {
		setValidator(undefined);
		setAmount(0n);
		setDuration(0);
		setPreviousLockedDelegation(undefined);
		setSuccess(false);
		setView(initialView);
	};

	return (
		<>
			{view === View.Warning && <DelegateWarning onAccepted={() => setView(View.Validators)} />}
			{view === View.Validators && (
				<DelegateValidators
					onValidator={(selectedValidator: Validator) => {
						setValidator(selectedValidator);
						setView(View.Amount);
					}}
				/>
			)}
			{view === View.Amount && (
				<DelegateAmount
					onAmount={(selectedAmount: bigint) => {
						setAmount(selectedAmount);
						setView(View.Duration);
					}}
				/>
			)}
			{view === View.Duration && (
				<DelegateDuration
					validator={validator!}
					amount={amount}
					onDuration={(selectedDuration, relock, lockedDelegation) => {
						setDuration(selectedDuration);
						setView(View.Finalize);
						setPreviousLockedDelegation(relock && lockedDelegation ? lockedDelegation : undefined);
					}}
				/>
			)}
			{view === View.Finalize && (
				<DelegateFinalize
					amount={amount}
					duration={duration}
					validator={validator!}
					previousDelegation={previousLockedDelegation}
					onFail={() => {
						setSuccess(false);
						setView(View.Finish);
					}}
					onSuccess={() => {
						setSuccess(true);
						setView(View.Finish);
					}}
					onRestart={resetWizard}
				/>
			)}
			{view === View.Finish && <DelegateFinish success={success} />}
		</>
	);
}
