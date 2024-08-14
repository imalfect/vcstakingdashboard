export interface PaybackWithdrawRequest {
	id: bigint;
	time: bigint;
	amount: bigint;
	unlockTime: bigint;
	completed: boolean;
}
