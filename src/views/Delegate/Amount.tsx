import { useStakingSession } from '@/components/Contexts/StakingSession';
import PageHeader from '@/components/Misc/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import humanify from '@/scripts/humanify';
import { parseVcAmount } from '@/scripts/parseVcAmount';
import { useState } from 'react';
import { formatUnits } from 'viem';
import { useBalance } from 'wagmi';

export default function DelegateAmount(props: { onAmount: (amount: bigint) => void }) {
	const state = useStakingSession();
	const session = state.status === 'supported' ? state.session : undefined;
	const balance = useBalance({
		address: session?.address,
		chainId: session?.chain.id,
		scopeKey: session ? `dashboard:${session.chain.id}` : undefined,
		query: { enabled: Boolean(session?.address) }
	});
	const [amount, setAmount] = useState('');
	const parsedAmount = parseVcAmount(amount);
	const amountWei = parsedAmount.ok ? parsedAmount.amountWei : undefined;
	const canContinue =
		amountWei !== undefined &&
		amountWei > 0n &&
		balance.data !== undefined &&
		amountWei <= balance.data.value;

	return (
		<div className={'flex flex-col items-center justify-center gap-6'}>
			<PageHeader
				title={'Select the amount'}
				subtitle={"Using the box below, enter the amount of coins you'd like to delegate."}
			/>
			<div className={'flex flex-col items-center gap-1'}>
				<div className={'flex w-full max-w-sm items-center space-x-2'}>
					<Input
						type="text"
						inputMode="decimal"
						placeholder="10 VC"
						value={amount}
						onChange={(event) => setAmount(event.target.value)}
					/>
					{balance.data && (
						<Button onClick={() => setAmount(formatUnits(balance.data.value, 18))}>
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
					if (canContinue && amountWei !== undefined) props.onAmount(amountWei);
				}}
				disabled={!canContinue}
				className={'px-12'}
			>
				Continue
			</Button>
		</div>
	);
}
