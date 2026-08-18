'use client';

import { SupportedChainId } from '@/config/wagmiShared';
import { useQueryClient } from '@tanstack/react-query';
import { createContext, ReactNode, useCallback, useContext, useMemo } from 'react';

type DashboardContractRefresh = {
	refreshChain(chainId: SupportedChainId): Promise<void>;
};

const DashboardContractRefreshContext = createContext<DashboardContractRefresh | null>(null);

export function DashboardContractRefreshProvider({ children }: { children: ReactNode }) {
	const queryClient = useQueryClient();
	const refreshChain = useCallback(
		async (chainId: SupportedChainId) => {
			const scopeKey = `dashboard:${chainId}`;
			await queryClient.invalidateQueries({
				predicate: ({ queryKey }) => {
					const options = queryKey[1];
					return (
						typeof options === 'object' &&
						options !== null &&
						'scopeKey' in options &&
						options.scopeKey === scopeKey
					);
				}
			});
		},
		[queryClient]
	);
	const value = useMemo(() => ({ refreshChain }), [refreshChain]);

	return (
		<DashboardContractRefreshContext.Provider value={value}>
			{children}
		</DashboardContractRefreshContext.Provider>
	);
}

export function useDashboardContractRefresh(): DashboardContractRefresh {
	const value = useContext(DashboardContractRefreshContext);
	if (!value) {
		throw new Error(
			'useDashboardContractRefresh must be used within DashboardContractRefreshProvider'
		);
	}
	return value;
}
