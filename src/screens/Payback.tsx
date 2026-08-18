'use client';
import {
	PaybackCapabilityGate,
	usePaybackContractAddress
} from '@/components/Contexts/PaybackCapability';
import { StakingSessionGate, useStakingSession } from '@/components/Contexts/StakingSession';
import { Button } from '@/components/ui/button';
import useAddressPayback from '@/hooks/useAddressPayback';
import PaybackHome from '@/views/Payback/Home';
import PaybackStake from '@/views/Payback/Stake';
import PaybackUnstake from '@/views/Payback/Unstake';
import PaybackWithdrawRequests from '@/views/Payback/WithdrawRequests';
import { useState } from 'react';

export enum View {
	Home,
	Stake,
	Unstake,
	WithdrawRequests
}

export default function Payback() {
	return (
		<div className={'flex min-h-screen flex-col items-center justify-center'}>
			<StakingSessionGate>
				<PaybackCapabilityGate>
					<PaybackSession />
				</PaybackCapabilityGate>
			</StakingSessionGate>
		</div>
	);
}

function PaybackSession() {
	const [view, setView] = useState<View>(View.Home);
	const state = useStakingSession();
	const paybackAddress = usePaybackContractAddress();

	if (state.status !== 'supported' || !paybackAddress) return null;

	return (
		<PaybackSessionData
			address={state.session.address}
			paybackAddress={paybackAddress}
			view={view}
			setView={setView}
		/>
	);
}

function PaybackSessionData(props: {
	address: `0x${string}`;
	paybackAddress: `0x${string}`;
	view: View;
	setView: (view: View) => void;
}) {
	const payback = useAddressPayback(props.address);

	if (payback.isLoading) {
		return <p>Loading payback stake…</p>;
	}

	if (payback.error) {
		return (
			<div className="flex flex-col items-center gap-3">
				<p>Unable to load your payback stake.</p>
				<Button onClick={() => void payback.refetch()}>Retry</Button>
			</div>
		);
	}

	return (
		<>
			{props.view === View.Home && <PaybackHome stake={payback.stake} setView={props.setView} />}
			{props.view === View.Stake && (
				<PaybackStake paybackAddress={props.paybackAddress} onStake={() => props.setView(View.Home)} />
			)}
			{props.view === View.Unstake && (
				<PaybackUnstake
					paybackAddress={props.paybackAddress}
					stake={payback.stake}
					onUnstake={() => props.setView(View.WithdrawRequests)}
				/>
			)}
			{props.view === View.WithdrawRequests && (
				<PaybackWithdrawRequests address={props.address} paybackAddress={props.paybackAddress} />
			)}
		</>
	);
}
