import vcMainnet from '@/config/chains/vcMainnet';
import vcTestnet from '@/config/chains/vcTestnet';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { http } from 'viem';
import { cookieStorage, createStorage } from 'wagmi';

// Get projectId at https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error('Project ID is not defined');

const metadata = {
	name: 'VinuChain Staking Dashboard',
	description:
		'VinuChain Staking Dashboard allows you to delegate your tokens to validators and earn rewards with ease.',
	url: 'https://stake.vinu.cash', // origin must match your domain & subdomain
	icons: ['https://avatars.githubusercontent.com/u/37784886']
};

// Create wagmiConfig
const chains = [vcMainnet, vcTestnet] as const;
export const config = defaultWagmiConfig({
	chains,
	projectId,
	metadata,
	ssr: true,
	transports: {
		[chains[0].id]: http(chains[0].rpcUrls.default.http[0], {
			batch: true
		}),
		[chains[1].id]: http(chains[1].rpcUrls.default.http[0], {
			batch: true
		})
	},
	storage: createStorage({
		storage: cookieStorage
	})
});
