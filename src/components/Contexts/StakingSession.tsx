'use client';

import WalletNotConnected from '@/components/Misc/WalletNotConnected';
import { Button } from '@/components/ui/button';
import { chains, getVinuChain } from '@/config/wagmiShared';
import { ConnectButton } from '@rainbow-me/rainbowkit/components';
import { createContext, Fragment, ReactNode, useContext, useMemo } from 'react';
import { Address } from 'viem';
import { useAccount } from 'wagmi';

export type SupportedStakingSession = {
	address: Address;
	chain: (typeof chains)[number];
	key: `${number}:${Address}`;
};

export type StakingSessionState =
	| { status: 'disconnected' }
	| { status: 'unsupported'; address?: Address; chainId?: number }
	| { status: 'supported'; session: SupportedStakingSession };

const StakingSessionContext = createContext<StakingSessionState>({ status: 'disconnected' });

export function StakingSessionProvider({ children }: { children: ReactNode }) {
	const account = useAccount();
	const state = useMemo<StakingSessionState>(() => {
		if (!account.isConnected || !account.address) {
			return { status: 'disconnected' };
		}

		const chain = getVinuChain(account.chainId);
		if (!chain) {
			return {
				status: 'unsupported',
				address: account.address,
				chainId: account.chainId
			};
		}

		return {
			status: 'supported',
			session: {
				address: account.address,
				chain,
				key: `${chain.id}:${account.address}`
			}
		};
	}, [account.address, account.chainId, account.isConnected]);

	return <StakingSessionContext.Provider value={state}>{children}</StakingSessionContext.Provider>;
}

export function useStakingSession(): StakingSessionState {
	return useContext(StakingSessionContext);
}

export function StakingSessionGate({ children }: { children: ReactNode }) {
	const state = useStakingSession();

	if (state.status === 'disconnected') {
		return <WalletNotConnected />;
	}

	if (state.status === 'unsupported') {
		return (
			<ConnectButton.Custom>
				{({ openChainModal }) => (
					<div className={'flex flex-col items-center gap-3'}>
						<p>Unsupported network.</p>
						<Button onClick={openChainModal}>Switch network</Button>
					</div>
				)}
			</ConnectButton.Custom>
		);
	}

	return <Fragment key={state.session.key}>{children}</Fragment>;
}
