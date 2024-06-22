export interface LockedDelegation {
	lockedStake: bigint;
	fromEpoch: bigint;
	endTime: bigint;
	duration: bigint;
}

/*
    struct LockedDelegation {
        uint256 lockedStake;
        uint256 fromEpoch;
        uint256 endTime;
        uint256 duration;
    }
 */
