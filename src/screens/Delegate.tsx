'use client';
import DelegateAmount from '@/components/Delegate/Amount';
import DelegateDuration from '@/components/Delegate/Duration';
import DelegateFinalize from '@/components/Delegate/Finalize';
import DelegateFinish from '@/components/Delegate/Finish';
import DelegateValidators from '@/components/Delegate/Validators';
import DelegateWarning from '@/components/Delegate/Warning';
import PageHeader from '@/components/Misc/PageHeader';
import WalletNotConnected from '@/components/Misc/WalletNotConnected';
import { LockedDelegation } from '@/types/lockedDelegation';
import Validator from '@/types/validator';
import { useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { useAccount } from 'wagmi';
enum Screen {
	Warning,
	Validators,
	Amount,
	Duration,
	Finalize,
	Finish
}
export default function Delegate() {
	const [validator, setValidator] = useState<Validator | null>();
	const [amount, setAmount] = useState(0n);
	const [duration, setDuration] = useState(0);
	const [previousLockedDelegation, setPreviousLockedDelegation] = useState<LockedDelegation>();
	const [success, setSuccess] = useState(false);
	const [didAcknowledgeWarning, setdidAcknowledgeWarning] = useLocalStorage(
		'delegate-warning-acknowledged',
		false
	);
	const [screen, setScreen] = useState<Screen>(
		didAcknowledgeWarning ? Screen.Validators : Screen.Warning
	);
	const account = useAccount();
	return (
		<main className={'flex min-h-screen flex-col items-center justify-center px-6'}>
			<PageHeader
				hidden
				title={'Delegate'}
				subtitle={"It's time to choose the validator you'd like to support."}
			/>
			{account.isConnected ? (
				<>
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
							amount={amount}
							onDuration={(
								duration: number,
								relock: boolean,
								previousLockedDelegation?: LockedDelegation | null
							) => {
								setDuration(duration);
								setScreen(Screen.Finalize);
								if (relock && previousLockedDelegation) {
									setPreviousLockedDelegation(previousLockedDelegation as LockedDelegation);
								}
							}}
						/>
					)}
					{screen === Screen.Finalize && (
						<DelegateFinalize
							amount={amount}
							duration={duration}
							validator={validator!}
							previousDelegation={previousLockedDelegation}
							onFail={() => {
								setSuccess(false);
								setScreen(Screen.Finish);
							}}
							onSuccess={() => {
								setSuccess(true);
								setScreen(Screen.Finish);
							}}
							onRestart={() => {
								setValidator(null);
								setAmount(0n);
								setDuration(0);
								setScreen(Screen.Warning);
							}}
						/>
					)}
					{screen === Screen.Finish && <DelegateFinish success={success} />}
				</>
			) : (
				<WalletNotConnected />
			)}
		</main>
	);
}
