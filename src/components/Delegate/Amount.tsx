import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import humanify from '@/scripts/humanify';
import { useState } from 'react';
import { useAccount, useBalance } from 'wagmi';

export default function DelegateAmount(props: { onAmount: (amount: bigint) => void }) {
	const account = useAccount();
	const balance = useBalance({
		address: account.address
	});
	const [amount, setAmount] = useState<bigint>(0n);
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
						value={amount.toString()}
						onChange={(e) => {
							setAmount(BigInt(e.target.value));
						}}
					/>
					{balance.data && (
						<Button
							onClick={() => {
								setAmount(balance.data.value);
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
					props.onAmount(amount);
				}}
				disabled={amount === 0n || (balance.data && balance.data.value < amount) || amount < 0n}
				className={'px-12'}
			>
				Continue
			</Button>
		</div>
	);
}
