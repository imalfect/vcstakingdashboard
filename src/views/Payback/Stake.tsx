import PageHeader from '@/components/Misc/PageHeader';
import TransactionProcessor from '@/components/TransactionProcessor/Processor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import paybackABI from '@/config/contracts/payback';
import stakeForPayback from '@/generators/write/stakeForPayback';
import useApproximateTransactionsFromPayback from '@/hooks/useApproximateTransactionsFromPayback';
import usePaybackPerEpoch from '@/hooks/usePaybackPerEpoch';
import humanify from '@/scripts/humanify';
import { VinuChain } from '@/types/vinuChain';
import BigNumber from 'bignumber.js';
import { clsx } from 'clsx';
import { useState } from 'react';
import { Chain } from 'viem';
import { useAccount, useBalance } from 'wagmi';
export default function PaybackStake(props: { onStake: () => void }) {
	const [value, setValue] = useState<number>(0);
	const [processorActive, setProcessorActive] = useState(false);
	const estimatedPayback = usePaybackPerEpoch(BigInt(new BigNumber(value).shiftedBy(18).toFixed()));
	console.log('estimated payback is ', estimatedPayback);
	const estimatedFeelessTransactions = useApproximateTransactionsFromPayback(
		estimatedPayback,
		21000n
	);
	const account = useAccount();
	const balance = useBalance({
		address: account.address
	});
	return (
		<div className={'flex flex-col items-center gap-3'}>
			<PageHeader
				title={'Stake for payback'}
				subtitle={"Choose the amount you'd like to stake. (min. 10 VC)"}
			/>
			<div className={'flex flex-col items-center gap-1'}>
				<div className={'flex w-full max-w-sm items-center space-x-2'}>
					<Input
						min={0}
						type="number"
						placeholder="10 VC"
						value={value}
						onChange={(e) => {
							setValue(Number(e.target.value));
						}}
					/>

					<Button>Available Balance</Button>
				</div>
				<span className={clsx(value >= 10 && 'hidden', 'text-red-500')}>
					You need to stake at least 10 VC
				</span>
				<span className={'text-gray-700 dark:text-gray-300'}>
					{humanify(balance.data?.value || 0n)} VC Available
				</span>
			</div>
			<p className={'text-center text-lg'}>
				By staking <b>{value} VC</b> you will be able to do approximately{' '}
				<b>{Math.floor(estimatedFeelessTransactions)}</b> feeless transactions per epoch.
			</p>
			<Button
				className={'px-12'}
				onClick={() => {
					setProcessorActive(true);
				}}
				disabled={
					value < 10 ||
					value > new BigNumber((balance.data?.value || 0n).toString()).shiftedBy(-18).toNumber()
				}
			>
				Stake
			</Button>
			<TransactionProcessor
				transactions={[
					stakeForPayback(
						paybackABI,
						(account.chain as Chain & VinuChain).contracts.payback.address,
						BigInt(new BigNumber(value).shiftedBy(18).toFixed())
					)
				]}
				onSuccess={() => {
					props.onStake();
					setProcessorActive(false);
				}}
				onFail={() => {
					props.onStake();
					setProcessorActive(false);
				}}
				active={processorActive}
			/>
		</div>
	);
}
