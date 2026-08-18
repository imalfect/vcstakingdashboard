'use client';

import { useStakingSession } from '@/components/Contexts/StakingSession';
import { ReactNode } from 'react';
import { Address, isAddress } from 'viem';

export function usePaybackContractAddress(): Address | undefined {
	const state = useStakingSession();
	if (state.status !== 'supported') return undefined;

	const address =
		'payback' in state.session.chain.contracts
			? state.session.chain.contracts.payback.address
			: undefined;
	return address && isAddress(address) ? address : undefined;
}

export function PaybackCapabilityGate({ children }: { children: ReactNode }) {
	const state = useStakingSession();
	const paybackAddress = usePaybackContractAddress();

	if (state.status === 'supported' && !paybackAddress) {
		return <p>Payback is unavailable on VinuChain Testnet.</p>;
	}

	return children;
}
