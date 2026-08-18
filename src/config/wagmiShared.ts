import vcMainnet from '@/config/chains/vcMainnet';
import vcTestnet from '@/config/chains/vcTestnet';
import { http } from 'viem';
import { cookieStorage, createStorage } from 'wagmi';

export const chains = [vcMainnet, vcTestnet] as const;

export type SupportedChainId = (typeof chains)[number]['id'];

export function getVinuChain(chainId?: number): (typeof chains)[number] | undefined {
	return chains.find((chain) => chain.id === chainId);
}

export const storage = createStorage({
	storage: cookieStorage
});

export const transports = {
	[chains[0].id]: http(chains[0].rpcUrls.default.http[0], {
		batch: true
	}),
	[chains[1].id]: http(chains[1].rpcUrls.default.http[0], {
		batch: true
	})
};
