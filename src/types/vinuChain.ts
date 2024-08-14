import { Address } from 'viem';

export interface VinuChain {
	contracts: {
		// Add your contracts here
		sfc: {
			address: Address;
		};
		stake: {
			address: Address;
		};
		payback: {
			address: Address;
		};
	};
}
