'use client';

import { DashboardContractRefreshProvider } from '@/components/Contexts/DashboardContractRefresh';
import { StakingSessionProvider } from '@/components/Contexts/StakingSession';
import TransactionProcessorProvider from '@/components/TransactionProcessor/Provider';
import { config } from '@/config';
import { ReactNode } from 'react';

import { RainbowKitProvider as RainbowKitUIProvider } from '@rainbow-me/rainbowkit/components';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { State, WagmiProvider } from 'wagmi';

// Setup queryClient
const queryClient = new QueryClient();

export default function RainbowKitProvider({
	children,
	initialState
}: {
	children: ReactNode;
	initialState?: State;
}) {
	return (
		<WagmiProvider config={config} initialState={initialState}>
			<QueryClientProvider client={queryClient}>
				<RainbowKitUIProvider appInfo={{ appName: 'VinuChain Staking Dashboard' }}>
					<StakingSessionProvider>
						<DashboardContractRefreshProvider>
							<TransactionProcessorProvider>{children}</TransactionProcessorProvider>
						</DashboardContractRefreshProvider>
					</StakingSessionProvider>
				</RainbowKitUIProvider>
			</QueryClientProvider>
		</WagmiProvider>
	);
}
