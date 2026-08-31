import { useTransactionBatch } from '@/components/TransactionProcessor/context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import payback from '@/config/contracts/payback';
import withdrawPayback from '@/generators/write/withdrawPayback';
import humanify from '@/scripts/humanify';
import { PaybackWithdrawRequest } from '@/types/paybackWithdrawRequest';
import { LucideClock, LucideFileDigit } from 'lucide-react';
import { Address, isAddressEqual } from 'viem';
export default function PaybackWithdrawRequestCard(props: {
	withdrawRequest: PaybackWithdrawRequest;
	nowSeconds: bigint;
	paybackAddress: Address;
	stakerAddress: Address;
	legacy?: boolean;
}) {
	const transactionBatch = useTransactionBatch();
	const remainingSeconds =
		props.withdrawRequest.unlockTime > props.nowSeconds
			? props.withdrawRequest.unlockTime - props.nowSeconds
			: 0n;
	const remainingTime =
		remainingSeconds === 0n
			? 'Withdrawal period time expired'
			: remainingSeconds >= 3600n
				? `${((remainingSeconds + 3599n) / 3600n).toString()} hours`
				: `${((remainingSeconds + 59n) / 60n).toString()} minutes`;

	return (
		<Card className={'w-72'}>
			<CardHeader>
				<CardTitle className={'flex items-center gap-3'}>
					{`${humanify(props.withdrawRequest.amount)} VC`}
				</CardTitle>
			</CardHeader>
			<CardContent className={'flex flex-col gap-3'}>
				<p className={'flex items-center gap-3'}>
					<LucideFileDigit /> Withdrawal Request {props.withdrawRequest.id.toString()}
				</p>
				{props.withdrawRequest.delegator &&
					!isAddressEqual(props.withdrawRequest.delegator, props.stakerAddress) && (
						<p className={'break-all text-sm'}>
							Beneficiary: {props.withdrawRequest.delegator}
						</p>
					)}
				<p className={'flex items-center gap-3'}>
					<LucideClock />
					{remainingTime}
				</p>
			</CardContent>
			<CardFooter>
				<Button
					className={'ml-auto'}
					disabled={remainingSeconds > 0n}
					onClick={() => {
						if (remainingSeconds > 0n) return;
						transactionBatch.start([
							withdrawPayback(
								payback,
								props.paybackAddress,
								props.withdrawRequest.id,
								props.legacy ? 'paybackLegacy' : 'payback'
							)
						]);
					}}
				>
					Withdraw
				</Button>
			</CardFooter>
		</Card>
	);
}
