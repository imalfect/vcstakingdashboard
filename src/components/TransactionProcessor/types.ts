import type { SupportedChainId } from '@/config/wagmiShared';
import type { WriteContractParameters } from '@wagmi/core';
import type { Address, Hash } from 'viem';

export type TransactionContractKey = 'sfc' | 'payback';

export type TransactionRequest = Omit<WriteContractParameters, 'account' | 'chainId'> & {
	readonly name: string;
	readonly contractKey: TransactionContractKey;
};

export type TransactionPhase =
	| 'queued'
	| 'paused_wallet_mismatch'
	| 'awaiting_wallet'
	| 'broadcast_failed'
	| 'broadcast_outcome_unknown'
	| 'confirming'
	| 'confirmation_failed'
	| 'confirmed'
	| 'reverted'
	| 'replacement_failed'
	| 'stopped'
	| 'skipped';

export interface TrackedTransaction {
	readonly id: string;
	readonly request: TransactionRequest;
	readonly broadcastAttempt: number;
	readonly confirmationAttempt: number;
	readonly phase: TransactionPhase;
	readonly hash?: Hash;
	readonly message?: string;
}

export interface ActiveTransactionBatch {
	readonly id: string;
	readonly account: Address;
	readonly chainId: SupportedChainId;
	readonly transactions: readonly TrackedTransaction[];
}

export type TransactionSettlement =
	| { readonly kind: 'completed'; readonly batch: ActiveTransactionBatch }
	| { readonly kind: 'cancelled'; readonly batch: ActiveTransactionBatch }
	| { readonly kind: 'failed'; readonly batch: ActiveTransactionBatch };

export interface TransactionProcessorState {
	readonly hydrated: boolean;
	readonly active: ActiveTransactionBatch | null;
	readonly settlement: TransactionSettlement | null;
}

export interface TransactionBatchCallbacks {
	onCompleted?: (batch: ActiveTransactionBatch) => void;
	onCancelled?: (batch: ActiveTransactionBatch) => void;
	onFailed?: (batch: ActiveTransactionBatch) => void;
}

export type StartBatchResult =
	| { readonly ok: true; readonly batchId: string }
	| {
			readonly ok: false;
			readonly reason:
				| 'rehydrating'
				| 'active_batch'
				| 'wallet_not_connected'
				| 'unsupported_chain'
				| 'empty_batch';
	  };

export type TransactionAction =
	| { readonly type: 'rehydrated'; readonly batch: ActiveTransactionBatch | null }
	| { readonly type: 'batch_started'; readonly batch: ActiveTransactionBatch }
	| TransactionTargetAction;

export type TransactionTargetAction =
	| {
			readonly type: 'wallet_mismatch';
			readonly batchId: string;
			readonly transactionId: string;
			readonly broadcastAttempt: number;
	  }
	| {
			readonly type: 'wallet_resumed';
			readonly batchId: string;
			readonly transactionId: string;
			readonly broadcastAttempt: number;
	  }
	| {
			readonly type: 'broadcast_started';
			readonly batchId: string;
			readonly transactionId: string;
			readonly broadcastAttempt: number;
	  }
	| {
			readonly type: 'broadcast_succeeded';
			readonly batchId: string;
			readonly transactionId: string;
			readonly broadcastAttempt: number;
			readonly hash: Hash;
	  }
	| {
			readonly type: 'broadcast_failed';
			readonly batchId: string;
			readonly transactionId: string;
			readonly broadcastAttempt: number;
			readonly message: string;
	  }
	| {
			readonly type: 'broadcast_outcome_unknown';
			readonly batchId: string;
			readonly transactionId: string;
			readonly broadcastAttempt: number;
			readonly message: string;
	  }
	| {
			readonly type: 'receipt_confirmed';
			readonly batchId: string;
			readonly transactionId: string;
			readonly confirmationAttempt: number;
			readonly hash: Hash;
	  }
	| {
			readonly type: 'receipt_reverted';
			readonly batchId: string;
			readonly transactionId: string;
			readonly confirmationAttempt: number;
			readonly hash: Hash;
			readonly message: string;
	  }
	| {
			readonly type: 'receipt_wait_failed';
			readonly batchId: string;
			readonly transactionId: string;
			readonly confirmationAttempt: number;
			readonly hash: Hash;
			readonly message: string;
	  }
	| {
			readonly type: 'receipt_replaced';
			readonly batchId: string;
			readonly transactionId: string;
			readonly confirmationAttempt: number;
			readonly hash: Hash;
			readonly replacementHash: Hash;
			readonly reason: 'repriced' | 'cancelled' | 'replaced';
			readonly receiptStatus?: 'success' | 'reverted';
	  }
	| { readonly type: 'retry_transaction'; readonly batchId: string; readonly transactionId: string }
	| { readonly type: 'cancel_batch'; readonly batchId: string }
	| { readonly type: 'stop_remaining'; readonly batchId: string; readonly transactionId: string }
	| { readonly type: 'acknowledge_completed'; readonly batchId: string }
	| { readonly type: 'acknowledge_failed'; readonly batchId: string }
	| { readonly type: 'settlement_consumed'; readonly batchId: string };
