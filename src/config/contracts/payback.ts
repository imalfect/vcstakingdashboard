export default [
	{
		inputs: [],
		stateMutability: 'nonpayable',
		type: 'constructor'
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
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256'
			}
		],
		name: 'Delegate',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'uint16',
				name: 'newFeeRefundBlockCount',
				type: 'uint16'
			}
		],
		name: 'FeeRefundBlockCountUpdated',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'uint256',
				name: 'newHoldTime',
				type: 'uint256'
			}
		],
		name: 'HoldTimeUpdated',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint8',
				name: 'version',
				type: 'uint8'
			}
		],
		name: 'Initialized',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'uint256',
				name: 'newMinStake',
				type: 'uint256'
			}
		],
		name: 'MinStakeUpdated',
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
				internalType: 'uint256',
				name: 'newQuotaFactor',
				type: 'uint256'
			}
		],
		name: 'QuotaFactorUpdated',
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
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256'
			},
			{
				indexed: true,
				internalType: 'uint256',
				name: 'wrID',
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
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256'
			},
			{
				indexed: true,
				internalType: 'uint256',
				name: 'wrID',
				type: 'uint256'
			}
		],
		name: 'Withdrawn',
		type: 'event'
	},
	{
		inputs: [],
		name: 'MAX_FEE_REFUND_BLOCK_COUNT',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'MAX_HOLD_TIME',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'MAX_MIN_STAKE',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'MAX_QUOTA_FACTOR',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'MIN_FEE_REFUND_BLOCK_COUNT',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'MIN_HOLD_TIME',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'MIN_MIN_STAKE',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'MIN_QUOTA_FACTOR',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
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
		name: 'completedWithdrawalRequestIDs',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'feeRefundBlockCount',
		outputs: [
			{
				internalType: 'uint16',
				name: '',
				type: 'uint16'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'delegator',
				type: 'address'
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
		name: 'getActiveWithdrawalRequestIDs',
		outputs: [
			{
				internalType: 'uint256[]',
				name: '',
				type: 'uint256[]'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'delegator',
				type: 'address'
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
		name: 'getActiveWrRequests',
		outputs: [
			{
				components: [
					{
						internalType: 'uint256',
						name: 'id',
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
					},
					{
						internalType: 'uint256',
						name: 'unlockTime',
						type: 'uint256'
					},
					{
						internalType: 'bool',
						name: 'completed',
						type: 'bool'
					}
				],
				internalType: 'struct QuotaContract.WithdrawalRequest[]',
				name: '',
				type: 'tuple[]'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'delegator',
				type: 'address'
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
		name: 'getCompletedWrRequests',
		outputs: [
			{
				components: [
					{
						internalType: 'uint256',
						name: 'id',
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
					},
					{
						internalType: 'uint256',
						name: 'unlockTime',
						type: 'uint256'
					},
					{
						internalType: 'bool',
						name: 'completed',
						type: 'bool'
					}
				],
				internalType: 'struct QuotaContract.WithdrawalRequest[]',
				name: '',
				type: 'tuple[]'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'delegator',
				type: 'address'
			}
		],
		name: 'getNumberOfActiveWithdrawalRequestIDs',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'delegator',
				type: 'address'
			}
		],
		name: 'getNumberOfCompletedWithdrawalRequestIDs',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address'
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
		stateMutability: 'view',
		type: 'function'
	},
	{
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
		name: 'getWithdrawalRequest',
		outputs: [
			{
				internalType: 'uint256',
				name: 'id',
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
			},
			{
				internalType: 'uint256',
				name: 'unlockTime',
				type: 'uint256'
			},
			{
				internalType: 'bool',
				name: 'completed',
				type: 'bool'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'delegator',
				type: 'address'
			},
			{
				internalType: 'uint256',
				name: 'wrID',
				type: 'uint256'
			}
		],
		name: 'hasActiveWithdrawalRequestId',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'holdTime',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'owner',
				type: 'address'
			},
			{
				internalType: 'uint16',
				name: '_feeRefundBlockCount',
				type: 'uint16'
			},
			{
				internalType: 'uint256',
				name: '_minStake',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: '_quotaFactor',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: '_holdTime',
				type: 'uint256'
			}
		],
		name: 'initialize',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [],
		name: 'minStake',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'owner',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'quotaFactor',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'renounceOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'uint16',
				name: 'feeRefundBlockCount_',
				type: 'uint16'
			}
		],
		name: 'setFeeRefundBlockCount',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '_holdTime',
				type: 'uint256'
			}
		],
		name: 'setHoldTime',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '_minStake',
				type: 'uint256'
			}
		],
		name: 'setMinStake',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '_quotaFactor',
				type: 'uint256'
			}
		],
		name: 'setQuotaFactor',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [],
		name: 'stake',
		outputs: [],
		stateMutability: 'payable',
		type: 'function'
	},
	{
		inputs: [],
		name: 'totalStake',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'newOwner',
				type: 'address'
			}
		],
		name: 'transferOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256'
			}
		],
		name: 'unstake',
		outputs: [
			{
				internalType: 'uint256',
				name: 'wrID',
				type: 'uint256'
			}
		],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'wrID',
				type: 'uint256'
			}
		],
		name: 'withdrawStake',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [],
		name: 'withdrawalRequestIdCounter',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		stateMutability: 'view',
		type: 'function'
	}
] as const;
