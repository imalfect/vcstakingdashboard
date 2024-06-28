import { UpdateContext } from '@/components/Contexts/UpdateContext';
import TransactionProcessor from '@/components/TransactionProcessor/Processor';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import sfc from '@/config/contracts/sfc';
import withdrawDelegation from '@/generators/write/withdrawDelegation';
import useValidator from '@/hooks/useValidator';
import useValidatorSocial from '@/hooks/useValidatorSocial';
import humanify from '@/scripts/humanify';
import { VinuChain } from '@/types/vinuChain';
import { WithdrawRequest } from '@/types/withdrawRequest';
import dayjs from 'dayjs';
import { LucideClock, LucideCoins, LucideCuboid, LucideFileDigit } from 'lucide-react';
import { useContext, useState } from 'react';
import { Chain } from 'viem';
import { useClient } from 'wagmi';
export default function WithdrawRequestCard(props: {
	withdrawRequest: WithdrawRequest;
	withdrawalPeriods: { time: bigint; epochs: bigint };
	currentEpoch: bigint;
}) {
	const update = useContext(UpdateContext);
	const client = useClient();
	const typedChain = client?.chain as (Chain & VinuChain) | undefined;
	const validatorData = useValidator(props.withdrawRequest.validatorId);
	const validatorSocial = useValidatorSocial(validatorData?.socialInfoUrl || '');
	const [processorActive, setProcessorActive] = useState(false);
	console.log(dd(props.withdrawRequest.time, props.withdrawalPeriods.time, 'seconds'));
	return (
		<>
			<Card className={'w-72'}>
				<CardHeader>
					<CardTitle className={'flex items-center gap-3'}>
						<Avatar>
							<AvatarImage src={validatorSocial?.logoUrl} />
							<AvatarFallback>{props.withdrawRequest.validatorId.toString()}</AvatarFallback>
						</Avatar>
						{validatorSocial?.name || `Validator ${props.withdrawRequest.validatorId}`}
					</CardTitle>
				</CardHeader>
				<CardContent className={'flex flex-col gap-3'}>
					<p className={'flex items-center gap-3'}>
						<LucideFileDigit /> Withdrawal Request {props.withdrawRequest.id.toString()}
					</p>
					<p className={'flex items-center gap-3'}>
						<LucideCoins /> {humanify(props.withdrawRequest.amount)} VC to be withdrawn
					</p>
					<p className={'flex items-center gap-3'}>
						<LucideClock />
						{dd(props.withdrawRequest.time, props.withdrawalPeriods.time, 'seconds') > 0
							? dd(props.withdrawRequest.time, props.withdrawalPeriods.time, 'seconds') > 3600
								? dd(props.withdrawRequest.time, props.withdrawalPeriods.time, 'hours') + ' hours'
								: dd(props.withdrawRequest.time, props.withdrawalPeriods.time, 'minutes') + ' minutes'
							: 'Withdrawal period time expired'}
					</p>
					<p className={'flex items-center gap-3'}>
						<LucideCuboid />
						{props.currentEpoch > props.withdrawRequest.epoch + props.withdrawalPeriods.epochs
							? 'Withdrawal period epochs expired'
							: `${props.withdrawRequest.epoch + props.withdrawalPeriods.epochs - props.currentEpoch} epochs remaining`}
					</p>
				</CardContent>
				<CardFooter>
					<Button
						className={'ml-auto'}
						disabled={
							dd(props.withdrawRequest.time, props.withdrawalPeriods.time, 'seconds') > 0 ||
							props.currentEpoch < props.withdrawRequest.epoch + props.withdrawalPeriods.epochs
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
					withdrawDelegation(
						sfc,
						typedChain?.contracts.sfc.address!,
						props.withdrawRequest.validatorId,
						props.withdrawRequest.id
					)
				]}
				onSuccess={() => {
					setProcessorActive(false);
					update();
				}}
				onFail={() => {
					setProcessorActive(false);
					update();
				}}
				active={processorActive}
			/>
		</>
	);
}

function dd(startTime: bigint, period: bigint, type: 'seconds' | 'hours' | 'minutes') {
	return dayjs.unix(Number(startTime)).add(Number(period), 'seconds').diff(dayjs(), type);
}
