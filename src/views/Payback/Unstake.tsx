import PageHeader from '@/components/Misc/PageHeader';
import TransactionProcessor from '@/components/TransactionProcessor/Processor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import paybackABI from '@/config/contracts/payback';
import unstakePayback from '@/generators/write/unstakePayback';
import useAddressPayback from '@/hooks/useAddressPayback';
import humanify from '@/scripts/humanify';
import { VinuChain } from '@/types/vinuChain';
import BigNumber from 'bignumber.js';
import { useState } from 'react';
import { Chain } from 'viem';
import { useAccount } from 'wagmi';
export default function PaybackUnstake(props: { onUnstake: () => void }) {
	const [value, setValue] = useState<number>(0);
	const [processorActive, setProcessorActive] = useState(false);
	const account = useAccount();
	const addressPayback = useAddressPayback(account.address!);

	return (
		<div className={'flex flex-col items-center gap-3'}>
			<PageHeader
				title={'Unstake payback'}
				subtitle={'Start the payback unstaking process to get your coins back.'}
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

					<Button>Available Payback</Button>
				</div>
				<span className={'text-gray-700 dark:text-gray-300'}>
					{humanify(addressPayback || 0n)} VC staked for payback
				</span>
			</div>
			<p className={'text-center text-lg'}>
				After starting the unstaking process, you will have to wait for 24 hours to retrieve your coins.
			</p>
			<Button
				className={'px-12'}
				onClick={() => {
					setProcessorActive(true);
				}}
				disabled={value > new BigNumber(addressPayback.toString()).shiftedBy(-18).toNumber()}
			>
				Unstake
			</Button>
			<TransactionProcessor
				transactions={[
					unstakePayback(
						paybackABI,
						(account.chain as Chain & VinuChain).contracts.payback.address,
						BigInt(new BigNumber(value).shiftedBy(18).toFixed())
					)
				]}
				onSuccess={() => {
					props.onUnstake();
					setProcessorActive(false);
				}}
				onFail={() => {
					props.onUnstake();
					setProcessorActive(false);
				}}
				active={processorActive}
			/>
		</div>
	);
}
