import RelockDelegationModal from '@/components/Modals/RelockDelegationModal';
import UndelegateModal from '@/components/Modals/UndelegateModal';
import TransactionProcessor from '@/components/TransactionProcessor/Processor';
import { TransactionProp } from '@/components/TransactionProcessor/types';
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
import useValidator from '@/hooks/useValidator';
import useValidatorSocial from '@/hooks/useValidatorSocial';
import humanify from '@/scripts/humanify';
import { Delegation } from '@/types/delegation';
import { VinuChain } from '@/types/vinuChain';
import dayjs from 'dayjs';
import {
	Banknote,
	LucideCalendarClock,
	LucideCandlestickChart,
	LucideCoins,
	LucideHandCoins,
	LucideLandmark
} from 'lucide-react';
import { useState } from 'react';
import { Chain } from 'viem';
import { useClient } from 'wagmi';
enum DelegationCardTransactionType {
	Claim,
	Restake
}
export default function DelegationCard(props: { delegation: Delegation }) {
	const client = useClient();
	const typedChain = client?.chain as (Chain & VinuChain) | undefined;
	const validatorData = useValidator(props.delegation?.validatorId);
	const validatorSocial = useValidatorSocial(validatorData?.socialInfoUrl || '');
	const [transactions, setTransactions] = useState<TransactionProp[]>([]);
	const [processorActive, setProcessorActive] = useState(false);
	const approximateLockedDelegationRewards = useApproximateDelegationRewards(
		props.delegation.lockedAmount,
		props.delegation.lockedDelegation
			? dayjs().diff(dayjs.unix(Number(props.delegation.lockedDelegation?.endTime) || 0), 'seconds')
			: 0
	);
	const approximateUnlockedDelegationRewards = useApproximateDelegationRewards(
		props.delegation.unlockedAmount
	);
	const executeTransaction = (type: DelegationCardTransactionType) => {
		switch (type) {
			case DelegationCardTransactionType.Claim:
				setTransactions([
					claimRewards(sfc, typedChain!.contracts.sfc.address, props.delegation.validatorId)
				]);
				setProcessorActive(true);
				break;
			case DelegationCardTransactionType.Restake:
				setTransactions([
					restakeRewards(sfc, typedChain!.contracts.sfc.address, props.delegation.validatorId)
				]);
				setProcessorActive(true);
				break;
		}
	};
	if (!props.delegation) return null;
	return (
		<>
			<Card className={'w-[22rem]'}>
				<CardHeader>
					<CardTitle className={'flex items-center gap-3'}>
						<Avatar>
							<AvatarImage src={validatorSocial?.logoUrl} />
							<AvatarFallback>{props.delegation.validatorId.toString()}</AvatarFallback>
						</Avatar>
						{validatorSocial?.name || `Validator ${props.delegation.validatorId}`}
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
						{props.delegation.lockedDelegation?.endTime
							? `Locked for ${dayjs.unix(Number(props.delegation.lockedDelegation?.endTime)).diff(dayjs(), 'days')} days`
							: 'No locked delegation'}
					</p>
					<p className={'flex items-center gap-3'}>
						<LucideCandlestickChart />{' '}
						{(
							((!isNaN(Number(approximateLockedDelegationRewards?.apr))
								? parseFloat(approximateLockedDelegationRewards?.apr || '0')
								: 0) +
								(!isNaN(Number(approximateUnlockedDelegationRewards?.apr))
									? parseFloat(approximateUnlockedDelegationRewards?.apr || '0')
									: 0)) /
							(approximateLockedDelegationRewards?.apr && approximateUnlockedDelegationRewards?.apr
								? 2
								: 1)
						).toFixed(2)}
						% approx. APR
					</p>
					<p className={'flex items-center gap-3'}>
						<LucideLandmark /> {humanify(props.delegation.claimableRewards, 3)} VC Claimable Rewards
					</p>
				</CardContent>
				<CardFooter>
					<div className={'flex gap-3'}>
						<UndelegateModal delegation={props.delegation} validator={validatorData}>
							<TooltipButton variant={'secondary'} message={'Withdraw staked tokens.'}>
								Undelegate
							</TooltipButton>
						</UndelegateModal>
						<RelockDelegationModal delegation={props.delegation} validator={validatorData}>
							<TooltipButton variant={'secondary'} message={'Recommit tokens to staking.'}>
								Relock
							</TooltipButton>
						</RelockDelegationModal>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button className={'ml-auto'} disabled={props.delegation.claimableRewards === 0n}>
								Claim
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem
								onClick={() => {
									executeTransaction(DelegationCardTransactionType.Claim);
								}}
							>
								Claim to wallet
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => {
									executeTransaction(DelegationCardTransactionType.Restake);
								}}
							>
								Restake
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</CardFooter>
			</Card>
			<TransactionProcessor
				transactions={transactions}
				onSuccess={() => {
					setProcessorActive(false);
				}}
				onFail={() => {
					setProcessorActive(false);
				}}
				active={processorActive}
			/>
		</>
	);
}
