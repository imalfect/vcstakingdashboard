// This is for the transaction processor

import { WriteContractParameters } from '@wagmi/core';

export type Transaction = WriteContractParameters & {
	name: string;
};
export type TransactionStatus = {
	status: 'pending' | 'success' | 'error';
	message?: string;
	hash?: string;
	name: string;
};
