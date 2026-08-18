import PageHeader from '@/components/Misc/PageHeader';
import { useTransactionBatch } from '@/components/TransactionProcessor/context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import paybackABI from '@/config/contracts/payback';
import unstakePayback from '@/generators/write/unstakePayback';
import { parseVcAmount, VC_DECIMALS } from '@/scripts/parseVcAmount';
import { useState } from 'react';
import { Address, formatUnits } from 'viem';

export default function PaybackUnstake(props: {
	paybackAddress: Address;
	stake: bigint;
	onUnstake: () => void;
}) {
	const [value, setValue] = useState('');
	const transactionBatch = useTransactionBatch({ onCompleted: props.onUnstake });
	const parsedAmount = parseVcAmount(value);
	const amountWei = parsedAmount.ok ? parsedAmount.amountWei : undefined;
	const canUnstake = amountWei !== undefined && amountWei > 0n && amountWei <= props.stake;

	let amountError: string | null = null;
	if (value !== '') {
		if (!parsedAmount.ok) {
			amountError =
				parsedAmount.error === 'precision'
					? 'Use no more than 18 decimal places.'
					: parsedAmount.error === 'overflow'
						? 'Amount is too large.'
						: 'Enter a valid unsigned decimal amount.';
		} else if (parsedAmount.amountWei === 0n) {
			amountError = 'Amount must be greater than zero.';
		} else if (parsedAmount.amountWei > props.stake) {
			amountError = 'Amount exceeds your available payback.';
		}
	}

	return (
		<div className={'flex flex-col items-center gap-3'}>
			<PageHeader
				title={'Unstake payback'}
				subtitle={'Start the payback unstaking process to get your coins back.'}
			/>
			<div className={'flex flex-col items-center gap-1'}>
				<div className={'flex w-full max-w-sm items-center space-x-2'}>
					<Input
						type="text"
						inputMode="decimal"
						placeholder="0 VC"
						value={value}
						onChange={(event) => setValue(event.target.value)}
					/>
					<Button onClick={() => setValue(formatUnits(props.stake, VC_DECIMALS))}>
						Available Payback
					</Button>
				</div>
				{amountError && <span className={'text-red-500'}>{amountError}</span>}
				<span className={'text-gray-700 dark:text-gray-300'}>
					{formatUnits(props.stake, VC_DECIMALS)} VC staked for payback
				</span>
			</div>
			<p className={'text-center text-lg'}>
				After starting the unstaking process, you will have to wait for 24 hours to retrieve your coins.
			</p>
			<Button
				className={'px-12'}
				onClick={() => {
					if (!canUnstake || amountWei === undefined) return;
					transactionBatch.start([unstakePayback(paybackABI, props.paybackAddress, amountWei)]);
				}}
				disabled={!canUnstake}
			>
				Unstake
			</Button>
		</div>
	);
}
