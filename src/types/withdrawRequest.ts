export interface WithdrawRequest {
	id: bigint;
	validatorId: bigint;
	epoch: bigint;
	time: bigint;
	amount: bigint;
}
