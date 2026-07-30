import { useStakingSession } from '@/components/Contexts/StakingSession';
import { useTransactionBatch } from '@/components/TransactionProcessor/context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import sfc from '@/config/contracts/sfc';
import withdrawDelegation from '@/generators/write/withdrawDelegation';
import humanify from '@/scripts/humanify';
import { DelegationWithdrawRequest } from '@/types/delegationWithdrawRequest';
import type { ValidatorSocialInfo } from '@/types/socialInfo';
import dayjs from 'dayjs';
import { LucideClock, LucideCoins, LucideCuboid, LucideFileDigit } from 'lucide-react';
export default function DelegationWithdrawRequestCard(props: {
	withdrawRequest: DelegationWithdrawRequest;
	withdrawalPeriods: { time: bigint; epochs: bigint };
	currentEpoch: bigint;
	social?: ValidatorSocialInfo;
}) {
	const state = useStakingSession();
	const session = state.status === 'supported' ? state.session : undefined;
	const sfcAddress = session?.chain.contracts.sfc.address;
	const transactionBatch = useTransactionBatch();
	return (
		<>
			<Card className={'w-72'}>
				<CardHeader>
					<CardTitle className={'flex items-center gap-3'}>
						<Avatar>
							<AvatarImage src={props.social?.logoUrl} />
							<AvatarFallback>{props.withdrawRequest.validatorId.toString()}</AvatarFallback>
						</Avatar>
						{props.social?.name || `Validator ${props.withdrawRequest.validatorId}`}
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
							!sfcAddress ||
							dd(props.withdrawRequest.time, props.withdrawalPeriods.time, 'seconds') > 0 ||
							props.currentEpoch < props.withdrawRequest.epoch + props.withdrawalPeriods.epochs
						}
						onClick={() => {
							if (!sfcAddress) return;
							transactionBatch.start([
								withdrawDelegation(
									sfc,
									sfcAddress,
									props.withdrawRequest.validatorId,
									props.withdrawRequest.id
								)
							]);
						}}
					>
						Withdraw
					</Button>
				</CardFooter>
			</Card>
		</>
	);
}

function dd(startTime: bigint, period: bigint, type: 'seconds' | 'hours' | 'minutes') {
	return dayjs.unix(Number(startTime)).add(Number(period), 'seconds').diff(dayjs(), type);
}
