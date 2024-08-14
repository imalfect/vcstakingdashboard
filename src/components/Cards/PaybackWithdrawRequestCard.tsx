import TransactionProcessor from '@/components/TransactionProcessor/Processor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import payback from '@/config/contracts/payback';
import withdrawPayback from '@/generators/write/withdrawPayback';
import humanify from '@/scripts/humanify';
import { PaybackWithdrawRequest } from '@/types/paybackWithdrawRequest';
import { VinuChain } from '@/types/vinuChain';
import dayjs from 'dayjs';
import { LucideClock, LucideFileDigit } from 'lucide-react';
import { useState } from 'react';
import { Chain } from 'viem';
import { useClient } from 'wagmi';
export default function PaybackWithdrawRequestCard(props: {
	withdrawRequest: PaybackWithdrawRequest;
	onWithdraw: () => void;
}) {
	const client = useClient();
	const typedChain = client?.chain as (Chain & VinuChain) | undefined;
	const [processorActive, setProcessorActive] = useState(false);
	// @ts-ignore
	return (
		<>
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
					<p className={'flex items-center gap-3'}>
						<LucideClock />
						{timediff(props.withdrawRequest.time, props.withdrawRequest.unlockTime, 'seconds') > 0
							? timediff(props.withdrawRequest.time, props.withdrawRequest.unlockTime, 'seconds') > 3600
								? timediff(props.withdrawRequest.time, props.withdrawRequest.unlockTime, 'hours') + ' hours'
								: timediff(props.withdrawRequest.time, props.withdrawRequest.unlockTime, 'minutes') +
									' minutes'
							: 'Withdrawal period time expired'}
					</p>
				</CardContent>
				<CardFooter>
					<Button
						className={'ml-auto'}
						disabled={
							timediff(props.withdrawRequest.time, props.withdrawRequest.unlockTime, 'seconds') > 0
						}
						onClick={() => {
							setProcessorActive(true);
						}}
					>
						Withdraw
					</Button>
				</CardFooter>
			</Card>
			<TransactionProcessor
				transactions={[
					withdrawPayback(
						payback,
						// @ts-ignore
						typedChain!.contracts.payback!.address || '0x0',
						props.withdrawRequest.id
					)
				]}
				onSuccess={() => {
					setProcessorActive(false);
					props.onWithdraw();
				}}
				onFail={() => {
					setProcessorActive(false);
					props.onWithdraw();
				}}
				active={processorActive}
			/>
		</>
	);
}

function timediff(startTime: bigint, endTime: bigint, type: 'seconds' | 'hours' | 'minutes') {
	return dayjs.unix(Number(endTime)).diff(dayjs.unix(Number(startTime)), type);
}
