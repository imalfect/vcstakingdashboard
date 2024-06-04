import { Address } from 'viem';

// All stake values are in wei
export default interface Validator {
	status: bigint; // 0 = active, 1 = offline, 8 = slashed
	deactivated: boolean; // Whether the validator is deactivated
	deactivatedTime?: bigint; // Time when the validator was deactivated
	deactivatedEpoch?: bigint; // Epoch when the validator was deactivated
	receivedStake: bigint; // Delegated + Self-stake
	createdEpoch: bigint; // Epoch when the validator was created
	createdTime: bigint; // Time when the validator was created
	auth: Address; // Address of the validator
	// Custom Fields
	selfStake: bigint; // Self-stake
	delegatedStake: bigint; // Delegated stake,
	lockedSelfStake: bigint; // Locked self-stake
	socialInfoUrl?: string; // URL to the social info
}
/*
struct Validator {
        uint256 status;
        uint256 deactivatedTime;
        uint256 deactivatedEpoch;
        uint256 receivedStake;
        uint256 createdEpoch;
        uint256 createdTime;
        address auth;
    }
 */
