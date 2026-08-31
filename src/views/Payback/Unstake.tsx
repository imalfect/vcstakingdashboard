import PageHeader from '@/components/Misc/PageHeader';
import { useTransactionBatch } from '@/components/TransactionProcessor/context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import paybackABI from '@/config/contracts/payback';
import unstakePayback from '@/generators/write/unstakePayback';
import useFundedPayback from '@/hooks/useFundedPayback';
import { parseVcAmount, VC_DECIMALS } from '@/scripts/parseVcAmount';
import { useState } from 'react';
import { Address, formatUnits, isAddress, isAddressEqual } from 'viem';

export default function PaybackUnstake(props: {
	paybackAddress: Address;
	address: Address;
	stake: bigint;
	legacy?: boolean;
	onUnstake: () => void;
}) {
	const [value, setValue] = useState('');
	const [beneficiary, setBeneficiary] = useState('');
	const transactionBatch = useTransactionBatch({ onCompleted: props.onUnstake });
	const beneficiaryValue = beneficiary.trim();
	const beneficiaryAddress =
		beneficiaryValue === ''
			? props.address
			: isAddress(beneficiaryValue)
				? beneficiaryValue
				: undefined;
	const isSponsoredUnstake =
		!props.legacy &&
		beneficiaryAddress !== undefined &&
		!isAddressEqual(beneficiaryAddress, props.address);
	const fundedPayback = useFundedPayback(
		props.paybackAddress,
		props.address,
		beneficiaryAddress ?? props.address,
		isSponsoredUnstake
	);
	const availableStake = isSponsoredUnstake ? fundedPayback.stake : props.stake;
	const parsedAmount = parseVcAmount(value);
	const amountWei = parsedAmount.ok ? parsedAmount.amountWei : undefined;
	const canUnstake =
		beneficiaryAddress !== undefined &&
		!fundedPayback.isLoading &&
		!fundedPayback.isFetching &&
		!fundedPayback.error &&
		amountWei !== undefined &&
		amountWei > 0n &&
		amountWei <= availableStake;

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
		} else if (parsedAmount.amountWei > availableStake) {
			amountError = 'Amount exceeds your available payback.';
		}
	}

	return (
		<div className={'flex flex-col items-center gap-3'}>
			<PageHeader
				title={props.legacy ? 'Unstake legacy payback' : 'Unstake payback'}
				subtitle={
					props.legacy
						? 'Recover stake held in the legacy V1 contract.'
						: 'Unstake self-funded or sponsored payback.'
				}
			/>
			{!props.legacy && (
				<div className={'w-full max-w-sm'}>
					<label className={'mb-1 block text-sm font-medium'} htmlFor="unstake-beneficiary">
						Beneficiary wallet (optional)
					</label>
					<Input
						id="unstake-beneficiary"
						placeholder={props.address}
						value={beneficiary}
						onChange={(event) => {
							setBeneficiary(event.target.value);
							setValue('');
						}}
					/>
					{beneficiaryValue !== '' && !beneficiaryAddress && (
						<span className={'text-sm text-red-500'}>Enter a valid wallet address.</span>
					)}
					{fundedPayback.error && (
						<span className={'text-sm text-red-500'}>Unable to load sponsored stake.</span>
					)}
				</div>
			)}
			<div className={'flex flex-col items-center gap-1'}>
				<div className={'flex w-full max-w-sm items-center space-x-2'}>
					<Input
						type="text"
						inputMode="decimal"
						placeholder="0 VC"
						value={value}
						onChange={(event) => setValue(event.target.value)}
					/>
					<Button onClick={() => setValue(formatUnits(availableStake, VC_DECIMALS))}>
						Available Payback
					</Button>
				</div>
				{amountError && <span className={'text-red-500'}>{amountError}</span>}
				<span className={'text-gray-700 dark:text-gray-300'}>
					{formatUnits(availableStake, VC_DECIMALS)} VC owned for this beneficiary
				</span>
			</div>
			<p className={'text-center text-lg'}>
				After starting the unstaking process, you will have to wait for 24 hours to retrieve your coins.
			</p>
			<Button
				className={'px-12'}
				onClick={() => {
					if (!canUnstake || amountWei === undefined) return;
					transactionBatch.start([
						unstakePayback(
							paybackABI,
							props.paybackAddress,
							amountWei,
							isSponsoredUnstake ? beneficiaryAddress : undefined,
							props.legacy ? 'paybackLegacy' : 'payback'
						)
					]);
				}}
				disabled={!canUnstake}
			>
				Unstake
			</Button>
		</div>
	);
}
