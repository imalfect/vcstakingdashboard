export interface DelegationWithdrawRequest {
	id: bigint;
	validatorId: bigint;
	epoch: bigint;
	time: bigint;
	amount: bigint;
}
