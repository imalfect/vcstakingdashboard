import { LockedDelegation } from '@/types/lockedDelegation';

export interface Delegation {
	validatorId: bigint;
	unlockedAmount: bigint;
	lockedAmount: bigint;
	totalAmount: bigint;
	lockedDelegation: LockedDelegation | null;
	claimableRewards: bigint;
}

///*
//     struct LockedDelegation {
//         uint256 lockedStake;
//         uint256 fromEpoch;
//         uint256 endTime;
//         uint256 duration;
//     }
//  */
