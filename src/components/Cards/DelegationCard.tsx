import { useStakingSession } from '@/components/Contexts/StakingSession';
import RelockDelegationModal from '@/components/Modals/RelockDelegationModal';
import UndelegateModal from '@/components/Modals/UndelegateModal';
import { useTransactionBatch } from '@/components/TransactionProcessor/context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { TooltipButton } from '@/components/ui/tooltip-button';
import sfc from '@/config/contracts/sfc';
import claimRewards from '@/generators/write/claimRewards';
import restakeRewards from '@/generators/write/restakeRewards';
import useApproximateDelegationRewards from '@/hooks/useApproximateDelegationRewards';
import humanify from '@/scripts/humanify';
import { Delegation } from '@/types/delegation';
import type { ValidatorSocialInfo } from '@/types/socialInfo';
import type Validator from '@/types/validator';
import dayjs from 'dayjs';
import {
	Banknote,
	LucideCalendarClock,
	LucideCandlestickChart,
	LucideCoins,
	LucideHandCoins,
	LucideLandmark
} from 'lucide-react';
export default function DelegationCard(props: {
	delegation: Delegation;
	validator: Validator | null;
	social?: ValidatorSocialInfo;
}) {
	const state = useStakingSession();
	const session = state.status === 'supported' ? state.session : undefined;
	const sfcAddress = session?.chain.contracts.sfc.address;
	const transactionBatch = useTransactionBatch();
	const remainingLockDays = props.delegation.lockedDelegation
		? Math.max(dayjs.unix(Number(props.delegation.lockedDelegation.endTime)).diff(dayjs(), 'days'), 0)
		: 0;
	const approximateLockedDelegationRewards = useApproximateDelegationRewards(
		props.delegation.lockedAmount,
		remainingLockDays
	);
	const approximateUnlockedDelegationRewards = useApproximateDelegationRewards(
		props.delegation.unlockedAmount,
		0
	);
	const claim = () => {
		if (!sfcAddress) return;
		transactionBatch.start([claimRewards(sfc, sfcAddress, props.delegation.validatorId)]);
	};
	const restake = () => {
		if (!sfcAddress) return;
		transactionBatch.start([restakeRewards(sfc, sfcAddress, props.delegation.validatorId)]);
	};
	if (!props.delegation) return null;
	return (
		<>
			<Card className={'w-[22rem]'}>
				<CardHeader>
					<CardTitle className={'flex items-center gap-3'}>
						<Avatar>
							<AvatarImage src={props.social?.logoUrl} />
							<AvatarFallback>{props.delegation.validatorId.toString()}</AvatarFallback>
						</Avatar>
						{props.social?.name || `Validator ${props.delegation.validatorId}`}
					</CardTitle>
				</CardHeader>
				<CardContent className={'flex flex-col gap-3'}>
					<p className={'flex items-center gap-3'}>
						<LucideCoins /> {humanify(props.delegation.totalAmount)} VC Total delegated
					</p>
					<p className={'flex items-center gap-3'}>
						<Banknote /> {humanify(props.delegation.lockedAmount)} VC Locked Delegation
					</p>
					<p className={'flex items-center gap-3'}>
						<LucideHandCoins /> {humanify(props.delegation.unlockedAmount)} VC Unlocked Delegation
					</p>
					<p className={'flex items-center gap-3'}>
						<LucideCalendarClock />
						{props.delegation.lockedDelegation
							? `Locked for ${remainingLockDays} days`
							: 'No locked delegation'}
					</p>
					{props.delegation.lockedDelegation && approximateLockedDelegationRewards?.apr && (
						<p className={'flex items-center gap-3'}>
							<LucideCandlestickChart /> {approximateLockedDelegationRewards?.apr}% locked APR
						</p>
					)}
					{props.delegation.unlockedAmount > 0n && (
						<p className={'flex items-center gap-3'}>
							<LucideCandlestickChart /> {approximateUnlockedDelegationRewards?.apr}% unlocked APR
						</p>
					)}
					<p className={'flex items-center gap-3'}>
						<LucideLandmark /> {humanify(props.delegation.claimableRewards, 3)} VC Claimable Rewards
					</p>
				</CardContent>
				<CardFooter>
					<div className={'flex gap-3'}>
						<UndelegateModal delegation={props.delegation} validator={props.validator}>
							<TooltipButton variant={'secondary'} message={'Withdraw staked tokens.'}>
								Undelegate
							</TooltipButton>
						</UndelegateModal>
						{props.validator ? (
							<RelockDelegationModal delegation={props.delegation} validator={props.validator}>
								<TooltipButton variant="secondary" message="Recommit tokens to staking.">
									Relock
								</TooltipButton>
							</RelockDelegationModal>
						) : null}
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								className={'ml-auto'}
								disabled={!sfcAddress || props.delegation.claimableRewards === 0n}
							>
								Claim
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem onClick={claim}>Claim to wallet</DropdownMenuItem>
							<DropdownMenuItem onClick={restake}>Restake</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</CardFooter>
			</Card>
		</>
	);
}
