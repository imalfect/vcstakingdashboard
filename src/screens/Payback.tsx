'use client';
import WalletNotConnected from '@/components/Misc/WalletNotConnected';
import PaybackHome from '@/views/Payback/Home';
import PaybackStake from '@/views/Payback/Stake';
import PaybackUnstake from '@/views/Payback/Unstake';
import PaybackWithdrawRequests from '@/views/Payback/WithdrawRequests';
import { useState } from 'react';
import { useAccount } from 'wagmi';
export enum View {
	Home,
	Stake,
	Unstake,
	WithdrawRequests
}
export default function Payback() {
	const account = useAccount();
	const [view, setView] = useState<View>(View.WithdrawRequests);
	return (
		<div className={'flex min-h-screen flex-col items-center justify-center'}>
			{account.isConnected ? (
				<>
					{view === View.Home && <PaybackHome setView={setView} />}
					{view === View.Stake && (
						<PaybackStake
							onStake={() => {
								setView(View.Home);
							}}
						/>
					)}
					{view === View.Unstake && (
						<PaybackUnstake
							onUnstake={() => {
								setView(View.Unstake);
							}}
						/>
					)}
					{view === View.WithdrawRequests && <PaybackWithdrawRequests />}
				</>
			) : (
				<WalletNotConnected />
			)}
		</div>
	);
}
