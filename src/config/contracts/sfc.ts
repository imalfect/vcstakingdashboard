export default [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'uint256',
				name: 'validatorID',
				type: 'uint256'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'status',
				type: 'uint256'
			}
		],
		name: 'ChangedValidatorStatus',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'delegator',
				type: 'address'
			},
			{
				indexed: true,
				internalType: 'uint256',
				name: 'toValidatorID',
				type: 'uint256'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'lockupExtraReward',
				type: 'uint256'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'lockupBaseReward',
				type: 'uint256'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'unlockedReward',
				type: 'uint256'
			}
		],
		name: 'ClaimedRewards',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'uint256',
				name: 'validatorID',
				type: 'uint256'
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'auth',
				type: 'address'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'createdEpoch',
				type: 'uint256'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'createdTime',
				type: 'uint256'
			}
		],
		name: 'CreatedValidator',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'uint256',
				name: 'validatorID',
				type: 'uint256'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'deactivatedEpoch',
				type: 'uint256'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'deactivatedTime',
				type: 'uint256'
			}
		],
		name: 'DeactivatedValidator',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'delegator',
				type: 'address'
			},
			{
				indexed: true,
				internalType: 'uint256',
				name: 'toValidatorID',
				type: 'uint256'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256'
			}
		],
		name: 'Delegated',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'delegator',
				type: 'address'
			},
			{
				indexed: true,
				internalType: 'uint256',
				name: 'validatorID',
				type: 'uint256'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'duration',
				type: 'uint256'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256'
			}
		],
		name: 'LockedUpStake',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'previousOwner',
				type: 'address'
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'newOwner',
				type: 'address'
			}
		],
		name: 'OwnershipTransferred',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'delegator',
				type: 'address'
			},
			{
				indexed: true,
				internalType: 'uint256',
				name: 'validatorID',
				type: 'uint256'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256'
			}
		],
		name: 'RefundedSlashedLegacyDelegation',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'delegator',
				type: 'address'
			},
			{
				indexed: true,
				internalType: 'uint256',
				name: 'toValidatorID',
				type: 'uint256'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'lockupExtraReward',
				type: 'uint256'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'lockupBaseReward',
				type: 'uint256'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'unlockedReward',
				type: 'uint256'
			}
		],
		name: 'RestakedRewards',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'delegator',
				type: 'address'
			},
			{
				indexed: true,
				internalType: 'uint256',
				name: 'toValidatorID',
				type: 'uint256'
			},
			{
				indexed: true,
				internalType: 'uint256',
				name: 'wrID',
				type: 'uint256'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256'
			}
		],
		name: 'Undelegated',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'delegator',
				type: 'address'
			},
			{
				indexed: true,
				internalType: 'uint256',
				name: 'validatorID',
				type: 'uint256'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'penalty',
				type: 'uint256'
			}
		],
		name: 'UnlockedStake',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: 'value',
				type: 'uint256'
			}
		],
		name: 'UpdatedBaseRewardPerSec',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: 'blocksNum',
				type: 'uint256'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'period',
				type: 'uint256'
			}
		],
		name: 'UpdatedOfflinePenaltyThreshold',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'uint256',
				name: 'validatorID',
				type: 'uint256'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'refundRatio',
				type: 'uint256'
			}
		],
		name: 'UpdatedSlashingRefundRatio',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'delegator',
				type: 'address'
			},
			{
				indexed: true,
				internalType: 'uint256',
				name: 'toValidatorID',
				type: 'uint256'
			},
			{
				indexed: true,
				internalType: 'uint256',
				name: 'wrID',
				type: 'uint256'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256'
			}
		],
		name: 'Withdrawn',
		type: 'event'
	},
	{
		constant: true,
		inputs: [],
		name: 'MIN_OFFLINE_PENALTY_THRESHOLD_BLOCKS_NUM',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'MIN_OFFLINE_PENALTY_THRESHOLD_TIME',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				internalType: 'uint256',
				name: 'validatorID',
				type: 'uint256'
			},
			{
				internalType: 'bool',
				name: 'syncPubkey',
				type: 'bool'
			}
		],
		name: '_syncValidator',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'baseRewardPerSecond',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				internalType: 'uint256',
				name: 'toValidatorID',
				type: 'uint256'
			}
		],
		name: 'claimRewards',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'contractCommission',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'pure',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				internalType: 'bytes',
				name: 'pubkey',
				type: 'bytes'
			}
		],
		name: 'createValidator',
		outputs: [],
		payable: true,
		stateMutability: 'payable',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'currentEpoch',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'currentSealedEpoch',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				internalType: 'uint256',
				name: 'validatorID',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'status',
				type: 'uint256'
			}
		],
		name: 'deactivateValidator',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				internalType: 'uint256',
				name: 'toValidatorID',
				type: 'uint256'
			}
		],
		name: 'delegate',
		outputs: [],
		payable: true,
		stateMutability: 'payable',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'genesisValidator',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [
			{
				internalType: 'uint256',
				name: 'epoch',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'validatorID',
				type: 'uint256'
			}
		],
		name: 'getEpochAccumulatedOriginatedTxsFee',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [
			{
				internalType: 'uint256',
				name: 'epoch',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'validatorID',
				type: 'uint256'
			}
		],
		name: 'getEpochAccumulatedRewardPerToken',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [
			{
				internalType: 'uint256',
				name: 'epoch',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'validatorID',
				type: 'uint256'
			}
		],
		name: 'getEpochAccumulatedUptime',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [
			{
				internalType: 'uint256',
				name: 'epoch',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'validatorID',
				type: 'uint256'
			}
		],
		name: 'getEpochOfflineBlocks',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [
			{
				internalType: 'uint256',
				name: 'epoch',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'validatorID',
				type: 'uint256'
			}
		],
		name: 'getEpochOfflineTime',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [
			{
				internalType: 'uint256',
				name: 'epoch',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'validatorID',
				type: 'uint256'
			}
		],
		name: 'getEpochReceivedStake',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		name: 'getEpochSnapshot',
		outputs: [
			{
				internalType: 'uint256',
				name: 'endTime',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'epochFee',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'totalBaseRewardWeight',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'totalTxRewardWeight',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'baseRewardPerSecond',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'totalStake',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'totalSupply',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [
			{
				internalType: 'uint256',
				name: 'epoch',
				type: 'uint256'
			}
		],
		name: 'getEpochValidatorIDs',
		outputs: [
			{
				internalType: 'uint256[]',
				name: '',
				type: 'uint256[]'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [
			{
				internalType: 'address',
				name: 'delegator',
				type: 'address'
			},
			{
				internalType: 'uint256',
				name: 'toValidatorID',
				type: 'uint256'
			}
		],
		name: 'getLockedStake',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address'
			},
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		name: 'getLockupInfo',
		outputs: [
			{
				internalType: 'uint256',
				name: 'lockedStake',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'fromEpoch',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'endTime',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'duration',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [
			{
				internalType: 'uint256',
				name: 'validatorID',
				type: 'uint256'
			}
		],
		name: 'getSelfStake',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address'
			},
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		name: 'getStake',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [
			{
				internalType: 'uint256',
				name: 'offset',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'limit',
				type: 'uint256'
			}
		],
		name: 'getStakes',
		outputs: [
			{
				components: [
					{
						internalType: 'address',
						name: 'delegator',
						type: 'address'
					},
					{
						internalType: 'uint96',
						name: 'timestamp',
						type: 'uint96'
					},
					{
						internalType: 'uint256',
						name: 'validatorId',
						type: 'uint256'
					},
					{
						internalType: 'uint256',
						name: 'amount',
						type: 'uint256'
					}
				],
				internalType: 'structSFC.Stake[]',
				name: '',
				type: 'tuple[]'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address'
			},
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		name: 'getStashedLockupRewards',
		outputs: [
			{
				internalType: 'uint256',
				name: 'lockupExtraReward',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'lockupBaseReward',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'unlockedReward',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [
			{
				internalType: 'address',
				name: 'delegator',
				type: 'address'
			},
			{
				internalType: 'uint256',
				name: 'toValidatorID',
				type: 'uint256'
			}
		],
		name: 'getUnlockedStake',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		name: 'getValidator',
		outputs: [
			{
				internalType: 'uint256',
				name: 'status',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'deactivatedTime',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'deactivatedEpoch',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'receivedStake',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'createdEpoch',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'createdTime',
				type: 'uint256'
			},
			{
				internalType: 'address',
				name: 'auth',
				type: 'address'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address'
			}
		],
		name: 'getValidatorID',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		name: 'getValidatorPubkey',
		outputs: [
			{
				internalType: 'bytes',
				name: '',
				type: 'bytes'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address'
			},
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		name: 'getWithdrawalRequest',
		outputs: [
			{
				internalType: 'uint256',
				name: 'epoch',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'time',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [
			{
				internalType: 'address',
				name: 'delegator',
				type: 'address'
			},
			{
				internalType: 'uint256',
				name: 'validatorID',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'offset',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'limit',
				type: 'uint256'
			}
		],
		name: 'getWrRequests',
		outputs: [
			{
				components: [
					{
						internalType: 'uint256',
						name: 'epoch',
						type: 'uint256'
					},
					{
						internalType: 'uint256',
						name: 'time',
						type: 'uint256'
					},
					{
						internalType: 'uint256',
						name: 'amount',
						type: 'uint256'
					}
				],
				internalType: 'structSFC.WithdrawalRequest[]',
				name: '',
				type: 'tuple[]'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				internalType: 'uint256',
				name: 'sealedEpoch',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: '_totalSupply',
				type: 'uint256'
			},
			{
				internalType: 'address',
				name: 'nodeDriver',
				type: 'address'
			},
			{
				internalType: 'address',
				name: 'owner',
				type: 'address'
			}
		],
		name: 'initialize',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: true,
		inputs: [
			{
				internalType: 'address',
				name: 'delegator',
				type: 'address'
			},
			{
				internalType: 'uint256',
				name: 'toValidatorID',
				type: 'uint256'
			}
		],
		name: 'isLockedUp',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'isOwner',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [
			{
				internalType: 'uint256',
				name: 'validatorID',
				type: 'uint256'
			}
		],
		name: 'isSlashed',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'lastValidatorID',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				internalType: 'uint256',
				name: 'toValidatorID',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'lockupDuration',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256'
			}
		],
		name: 'lockStake',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'maxDelegatedRatio',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'pure',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'maxLockupDuration',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'pure',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'minLockupDuration',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'pure',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'minSelfStake',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'pure',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'offlinePenaltyThreshold',
		outputs: [
			{
				internalType: 'uint256',
				name: 'blocksNum',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'time',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'owner',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [
			{
				internalType: 'address',
				name: 'delegator',
				type: 'address'
			},
			{
				internalType: 'uint256',
				name: 'toValidatorID',
				type: 'uint256'
			}
		],
		name: 'pendingRewards',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				internalType: 'uint256',
				name: 'toValidatorID',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'lockupDuration',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256'
			}
		],
		name: 'relockStake',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: false,
		inputs: [],
		name: 'renounceOwnership',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				internalType: 'uint256',
				name: 'toValidatorID',
				type: 'uint256'
			}
		],
		name: 'restakeRewards',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: true,
		inputs: [
			{
				internalType: 'address',
				name: 'delegator',
				type: 'address'
			},
			{
				internalType: 'uint256',
				name: 'validatorID',
				type: 'uint256'
			}
		],
		name: 'rewardsStash',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				internalType: 'uint256[]',
				name: 'offlineTime',
				type: 'uint256[]'
			},
			{
				internalType: 'uint256[]',
				name: 'offlineBlocks',
				type: 'uint256[]'
			},
			{
				internalType: 'uint256[]',
				name: 'uptimes',
				type: 'uint256[]'
			},
			{
				internalType: 'uint256[]',
				name: 'originatedTxsFee',
				type: 'uint256[]'
			}
		],
		name: 'sealEpoch',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				internalType: 'uint256[]',
				name: 'nextValidatorIDs',
				type: 'uint256[]'
			}
		],
		name: 'sealEpochValidators',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				internalType: 'address',
				name: 'delegator',
				type: 'address'
			},
			{
				internalType: 'uint256',
				name: 'toValidatorID',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'stake',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'lockedStake',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'lockupFromEpoch',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'lockupEndTime',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'lockupDuration',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'earlyUnlockPenalty',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'rewards',
				type: 'uint256'
			}
		],
		name: 'setGenesisDelegation',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				internalType: 'address',
				name: 'auth',
				type: 'address'
			},
			{
				internalType: 'uint256',
				name: 'validatorID',
				type: 'uint256'
			},
			{
				internalType: 'bytes',
				name: 'pubkey',
				type: 'bytes'
			},
			{
				internalType: 'uint256',
				name: 'status',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'createdEpoch',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'createdTime',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'deactivatedEpoch',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'deactivatedTime',
				type: 'uint256'
			}
		],
		name: 'setGenesisValidator',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: true,
		inputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		name: 'slashingRefundRatio',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				internalType: 'address',
				name: 'delegator',
				type: 'address'
			},
			{
				internalType: 'uint256',
				name: 'toValidatorID',
				type: 'uint256'
			}
		],
		name: 'stashRewards',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: true,
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address'
			},
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		name: 'stashedRewardsUntilEpoch',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'totalActiveStake',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'totalPenalty',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'totalSlashedStake',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'totalStake',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'totalSupply',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'view',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				internalType: 'address',
				name: 'newOwner',
				type: 'address'
			}
		],
		name: 'transferOwnership',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				internalType: 'uint256',
				name: 'toValidatorID',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256'
			}
		],
		name: 'undelegate',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				internalType: 'uint256',
				name: 'toValidatorID',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256'
			}
		],
		name: 'unlockStake',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'unlockedRewardRatio',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'pure',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				internalType: 'uint256',
				name: 'value',
				type: 'uint256'
			}
		],
		name: 'updateBaseRewardPerSecond',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				internalType: 'uint256',
				name: 'blocksNum',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'time',
				type: 'uint256'
			}
		],
		name: 'updateOfflinePenaltyThreshold',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				internalType: 'uint256',
				name: 'validatorID',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'refundRatio',
				type: 'uint256'
			}
		],
		name: 'updateSlashingRefundRatio',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'validatorCommission',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'pure',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'version',
		outputs: [
			{
				internalType: 'bytes3',
				name: '',
				type: 'bytes3'
			}
		],
		payable: false,
		stateMutability: 'pure',
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				internalType: 'uint256',
				name: 'toValidatorID',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'wrID',
				type: 'uint256'
			}
		],
		name: 'withdraw',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'withdrawalPeriodEpochs',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'pure',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'withdrawalPeriodEpochsValidator',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'pure',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'withdrawalPeriodTime',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'pure',
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'withdrawalPeriodTimeValidator',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		stateMutability: 'pure',
		type: 'function'
	}
];
