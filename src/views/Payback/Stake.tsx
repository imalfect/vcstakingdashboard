import { useStakingSession } from '@/components/Contexts/StakingSession';
import PageHeader from '@/components/Misc/PageHeader';
import { useTransactionBatch } from '@/components/TransactionProcessor/context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import paybackABI from '@/config/contracts/payback';
import stakeForPayback from '@/generators/write/stakeForPayback';
import useApproximateTransactionsFromPayback from '@/hooks/useApproximateTransactionsFromPayback';
import usePaybackMinimumStake from '@/hooks/usePaybackMinimumStake';
import usePaybackPerEpoch from '@/hooks/usePaybackPerEpoch';
import { parseVcAmount, VC_DECIMALS } from '@/scripts/parseVcAmount';
import { useState } from 'react';
import { Address, formatUnits } from 'viem';
import { useBalance } from 'wagmi';

export default function PaybackStake(props: { paybackAddress: Address; onStake: () => void }) {
	const [value, setValue] = useState('');
	const state = useStakingSession();
	const session = state.status === 'supported' ? state.session : undefined;
	const transactionBatch = useTransactionBatch({ onCompleted: props.onStake });
	const parsedAmount = parseVcAmount(value);
	const amountWei = parsedAmount.ok ? parsedAmount.amountWei : undefined;
	const estimatedPayback = usePaybackPerEpoch(amountWei ?? 0n);
	const estimatedFeelessTransactions = useApproximateTransactionsFromPayback(
		estimatedPayback.data ?? 0n,
		21000n
	);
	const balance = useBalance({
		address: session?.address,
		chainId: session?.chain.id,
		scopeKey: session ? `dashboard:${session.chain.id}` : undefined,
		query: { enabled: Boolean(session?.address) }
	});
	const minimumStake = usePaybackMinimumStake(props.paybackAddress);
	const canStake =
		!minimumStake.isLoading &&
		!minimumStake.isFetching &&
		!minimumStake.error &&
		!balance.isLoading &&
		!balance.isFetching &&
		!balance.error &&
		amountWei !== undefined &&
		amountWei > 0n &&
		minimumStake.minimumStake !== null &&
		amountWei >= minimumStake.minimumStake &&
		balance.data !== undefined &&
		amountWei <= balance.data.value;

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
		} else if (
			minimumStake.minimumStake !== null &&
			parsedAmount.amountWei < minimumStake.minimumStake
		) {
			amountError = `Minimum stake is ${formatUnits(minimumStake.minimumStake, VC_DECIMALS)} VC.`;
		} else if (balance.data && parsedAmount.amountWei > balance.data.value) {
			amountError = 'Amount exceeds your available balance.';
		}
	}

	return (
		<div className={'flex flex-col items-center gap-3'}>
			<PageHeader title={'Stake for payback'} subtitle={"Choose the amount you'd like to stake."} />
			<div className={'flex flex-col items-center gap-1'}>
				<div className={'flex w-full max-w-sm items-center space-x-2'}>
					<Input
						type="text"
						inputMode="decimal"
						placeholder="0 VC"
						value={value}
						onChange={(event) => setValue(event.target.value)}
					/>
					<Button
						disabled={!balance.data}
						onClick={() => balance.data && setValue(formatUnits(balance.data.value, VC_DECIMALS))}
					>
						Available Balance
					</Button>
				</div>
				{amountError && <span className={'text-red-500'}>{amountError}</span>}
				{minimumStake.isLoading && (
					<span className={'text-gray-700 dark:text-gray-300'}>Loading minimum stake…</span>
				)}
				{minimumStake.error && (
					<div className="flex items-center gap-2 text-red-500">
						<span>Unable to load the minimum stake.</span>
						<Button size="sm" variant="outline" onClick={() => void minimumStake.refetch()}>
							Retry
						</Button>
					</div>
				)}
				{balance.error && (
					<div className="flex items-center gap-2 text-red-500">
						<span>Unable to load your available balance.</span>
						<Button size="sm" variant="outline" onClick={() => void balance.refetch()}>
							Retry
						</Button>
					</div>
				)}
				<span className={'text-gray-700 dark:text-gray-300'}>
					{balance.data ? formatUnits(balance.data.value, VC_DECIMALS) : 'Unavailable'} VC Available
				</span>
				{estimatedPayback.isLoading && (
					<span className={'text-gray-700 dark:text-gray-300'}>Loading reward estimate…</span>
				)}
				{estimatedPayback.error && (
					<div className="flex items-center gap-2 text-red-500">
						<span>Unable to load the reward estimate.</span>
						<Button size="sm" variant="outline" onClick={() => void estimatedPayback.refetch()}>
							Retry
						</Button>
					</div>
				)}
			</div>
			<p className={'text-center text-lg'}>
				By staking <b>{value || '0'} VC</b>{' '}
				{estimatedPayback.data === null ? (
					<>the feeless transaction estimate is unavailable.</>
				) : (
					<>
						you will be able to do approximately <b>{estimatedFeelessTransactions.toString()}</b> feeless
						transactions per epoch.
					</>
				)}
			</p>
			<Button
				className={'px-12'}
				onClick={() => {
					if (!canStake || amountWei === undefined) return;
					transactionBatch.start([stakeForPayback(paybackABI, props.paybackAddress, amountWei)]);
				}}
				disabled={!canStake}
			>
				Stake
			</Button>
		</div>
	);
}
