'use client';
import PageHeader from '@/components/Misc/PageHeader';
import WalletNotConnected from '@/components/Misc/WalletNotConnected';
import { LockedDelegation } from '@/types/lockedDelegation';
import Validator from '@/types/validator';
import DelegateAmount from '@/views/Delegate/Amount';
import DelegateDuration from '@/views/Delegate/Duration';
import DelegateFinalize from '@/views/Delegate/Finalize';
import DelegateFinish from '@/views/Delegate/Finish';
import DelegateValidators from '@/views/Delegate/Validators';
import DelegateWarning from '@/views/Delegate/Warning';
import { useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { useAccount } from 'wagmi';
enum View {
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
	const [didAcknowledgeWarning] = useLocalStorage('delegate-warning-acknowledged', false);
	const [view, setView] = useState<View>(didAcknowledgeWarning ? View.Validators : View.Warning);
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
					{view === View.Warning && (
						<DelegateWarning
							onAccepted={() => {
								setView(View.Validators);
							}}
						/>
					)}
					{view === View.Validators && (
						<DelegateValidators
							onValidator={(validator: Validator) => {
								setValidator(validator);
								setView(View.Amount);
							}}
						/>
					)}
					{view === View.Amount && (
						<DelegateAmount
							onAmount={(amount: bigint) => {
								setAmount(amount);
								setView(View.Duration);
							}}
						/>
					)}
					{view === View.Duration && (
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
								setView(View.Finalize);
								if (relock && previousLockedDelegation) {
									setPreviousLockedDelegation(previousLockedDelegation as LockedDelegation);
								}
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
							onRestart={() => {
								setValidator(null);
								setAmount(0n);
								setDuration(0);
								setView(View.Warning);
							}}
						/>
					)}
					{view === View.Finish && <DelegateFinish success={success} />}
				</>
			) : (
				<WalletNotConnected />
			)}
		</main>
	);
}
