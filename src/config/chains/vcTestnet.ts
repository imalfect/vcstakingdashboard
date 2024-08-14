import { VinuChain } from '@/types/vinuChain';
import { Chain } from 'viem';

export default {
	id: 206,
	name: 'VinuChain Testnet',
	nativeCurrency: {
		decimals: 18,
		name: 'VinuChain',
		symbol: 'VC'
	},
	rpcUrls: {
		public: {
			http: ['https://vinufoundation-rpc.com/']
		},
		default: {
			http: ['https://vinufoundation-rpc.com/']
		}
	},
	blockExplorers: {
		etherscan: {
			name: 'VinuScan',
			url: 'https://testnet.vinuscan.com'
		},
		default: {
			name: 'VinuScan',
			url: 'https://testnet.vinuscan.com'
		}
	},
	contracts: {
		// Add your contracts here
		sfc: {
			address: '0xFC00FACE00000000000000000000000000000000'
		},
		stake: {
			address: '0x6b39bcd174DddF5A17d065822BDC43353eB6112A'
		},
		payback: {
			// TODO: Update this address
			address: '0x1c4269f'
		}
	}
} as const satisfies Chain & VinuChain;
