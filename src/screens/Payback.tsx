'use client';
import {
	PaybackCapabilityGate,
	useLegacyPaybackContractAddress,
	usePaybackContractAddress
} from '@/components/Contexts/PaybackCapability';
import { StakingSessionGate, useStakingSession } from '@/components/Contexts/StakingSession';
import { Button } from '@/components/ui/button';
import useAddressPayback from '@/hooks/useAddressPayback';
import PaybackHome from '@/views/Payback/Home';
import PaybackMigration from '@/views/Payback/Migrate';
import PaybackStake from '@/views/Payback/Stake';
import PaybackUnstake from '@/views/Payback/Unstake';
import PaybackWithdrawRequests from '@/views/Payback/WithdrawRequests';
import { useState } from 'react';

export enum View {
	Home,
	Stake,
	Unstake,
	WithdrawRequests,
	Migrate
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
	const [legacy, setLegacy] = useState(false);
	const state = useStakingSession();
	const paybackAddress = usePaybackContractAddress();
	const legacyPaybackAddress = useLegacyPaybackContractAddress();

	if (state.status !== 'supported' || !paybackAddress) return null;

	return (
		<PaybackSessionData
			address={state.session.address}
			paybackAddress={paybackAddress}
			legacyPaybackAddress={legacyPaybackAddress}
			legacy={legacy}
			view={view}
			setView={setView}
			setLegacy={setLegacy}
		/>
	);
}

function PaybackSessionData(props: {
	address: `0x${string}`;
	paybackAddress: `0x${string}`;
	legacyPaybackAddress?: `0x${string}`;
	legacy: boolean;
	view: View;
	setView: (view: View) => void;
	setLegacy: (legacy: boolean) => void;
}) {
	const activePaybackAddress =
		props.legacy && props.legacyPaybackAddress ? props.legacyPaybackAddress : props.paybackAddress;
	const payback = useAddressPayback(props.address, activePaybackAddress, !props.legacy);

	if (payback.isLoading) {
		return <p>Loading payback stake…</p>;
	}

	if (payback.error) {
		return (
			<div className="flex flex-col items-center gap-3">
				<p>Unable to load your payback stake.</p>
				<Button onClick={() => void payback.refetch()}>Retry</Button>
				{props.legacy && (
					<Button
						variant="outline"
						onClick={() => {
							props.setLegacy(false);
							props.setView(View.Home);
						}}
					>
						Back to V2
					</Button>
				)}
			</div>
		);
	}

	return (
		<>
			{props.view === View.Home && (
				<PaybackHome
					stake={payback.stake}
					ownedStake={payback.ownedStake}
					legacy={props.legacy}
					hasLegacy={Boolean(props.legacyPaybackAddress)}
					setView={props.setView}
					onToggleLegacy={() => {
						props.setLegacy(!props.legacy);
						props.setView(View.Home);
					}}
				/>
			)}
			{props.view === View.Stake && (
				<PaybackStake
					address={props.address}
					paybackAddress={props.paybackAddress}
					onStake={() => props.setView(View.Home)}
				/>
			)}
			{props.view === View.Unstake && (
				<PaybackUnstake
					address={props.address}
					paybackAddress={activePaybackAddress}
					stake={payback.ownedStake}
					legacy={props.legacy}
					onUnstake={() => props.setView(View.WithdrawRequests)}
				/>
			)}
			{props.view === View.WithdrawRequests && (
				<PaybackWithdrawRequests
					address={props.address}
					paybackAddress={activePaybackAddress}
					legacy={props.legacy}
				/>
			)}
			{props.view === View.Migrate && props.legacyPaybackAddress && (
				<PaybackMigration
					address={props.address}
					legacyPaybackAddress={props.legacyPaybackAddress}
					paybackAddress={props.paybackAddress}
					legacyStake={payback.ownedStake}
				/>
			)}
		</>
	);
}
