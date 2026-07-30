import { chains, storage, transports } from '@/config/wagmiShared';
import { createConfig, injected } from 'wagmi';

export const config = createConfig({
	chains,
	connectors: [injected()],
	ssr: true,
	storage,
	transports
});
