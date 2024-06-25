import { WriteContractParameters } from '@wagmi/core';

export interface ReducerPayload {
	id: number;
	hash?: string;
	message?: string;
}

export interface TransactionAction {
	type: string;
	payload: ReducerPayload | TransactionProp[];
}

export type TransactionProp = WriteContractParameters & { name: string };

export interface TrackedTransaction {
	wagmiTransaction: WriteContractParameters;
	hash?: string;
	status: 'pending' | 'success' | 'error' | 'signed';
	message?: string;
	name: string; // This will be passed here
	id: number; // This will be passed here
}
