import { Chain } from 'viem';

export default {
	id: 207,
	name: 'VinuChain',
	nativeCurrency: {
		decimals: 18,
		name: 'VinuChain',
		symbol: 'VC'
	},
	rpcUrls: {
		public: {
			http: ['https://vinuchain-rpc.com']
		},
		default: {
			http: ['https://vinuchain-rpc.com']
		}
	},
	blockExplorers: {
		etherscan: {
			name: 'VinuScan',
			url: 'https://vinuscan.com'
		},
		default: {
			name: 'VinuScan',
			url: 'https://vinuscan.com'
		}
	},
	contracts: {
		// Add your contracts here
		sfc: {
			address: '0xFC00FACE00000000000000000000000000000000'
		},
		stake: {
			address: '0xb914a0b16111BaB228ae6214e6E1FD4a5EaE877C'
		}
	}
} as const satisfies Chain;