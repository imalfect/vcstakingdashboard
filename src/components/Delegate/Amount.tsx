import PageHeader from '@/components/Misc/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import humanify from '@/scripts/humanify';
import BigNumber from 'bignumber.js';
import { useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_DOWN });
export default function DelegateAmount(props: { onAmount: (amount: bigint) => void }) {
	const account = useAccount();
	const balance = useBalance({
		address: account.address
	});
	const [amount, setAmount] = useState('');
	return (
		<div className={'flex flex-col items-center justify-center gap-6'}>
			<PageHeader
				title={'Select the amount'}
				subtitle={"Using the box below, enter the amount of coins you'd like to delegate."}
			/>
			<div className={'flex flex-col items-center gap-1'}>
				<div className={'flex w-full max-w-sm items-center space-x-2'}>
					<Input
						type="number"
						placeholder="10 VC"
						value={amount}
						onChange={(e) => {
							setAmount(e.target.value);
						}}
					/>
					{balance.data && (
						<Button
							onClick={() => {
								setAmount(new BigNumber(balance.data.value.toString()).shiftedBy(-18).toFixed(1));
							}}
						>
							Available Balance
						</Button>
					)}
				</div>
				{balance.data && (
					<span className={'text-gray-700 dark:text-gray-300'}>
						{humanify(balance.data.value)} VC Available
					</span>
				)}
			</div>
			<Button
				onClick={() => {
					props.onAmount(BigInt(new BigNumber(amount).shiftedBy(18).toFixed(0)));
				}}
				disabled={
					amount === '' ||
					amount === '0' ||
					(balance.data &&
						balance.data.value < BigInt(new BigNumber(amount).shiftedBy(18).toFixed(0))) ||
					parseFloat(amount) <= 0
				}
				className={'px-12'}
			>
				Continue
			</Button>
		</div>
	);
}
