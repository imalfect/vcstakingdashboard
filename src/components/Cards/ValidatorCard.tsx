import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import useApproximateDelegationRewards from '@/hooks/useApproximateDelegationRewards';
import humanify from '@/scripts/humanify';
import type { ValidatorSocialInfo } from '@/types/socialInfo';
import Validator from '@/types/validator';
import {
	LucideBanknote,
	LucideCandlestickChart,
	LucideClock,
	LucideCoins,
	LucideHandCoins
} from 'lucide-react';

export default function ValidatorCard(props: {
	id: bigint;
	validator: Validator | null;
	social?: ValidatorSocialInfo;
	onSelected?: (validator: Validator) => void;
}) {
	const approximateDelegationRewards = useApproximateDelegationRewards(
		props.validator?.receivedStake || 0n,
		props.validator?.remainingLockedStakeDays || 0
	);
	return (
		<Card>
			<CardHeader>
				<CardTitle className={'flex items-center gap-3'}>
					<Avatar>
						<AvatarImage referrerPolicy={'no-referrer'} src={props.social?.logoUrl} />
						<AvatarFallback>{props.id.toString()}</AvatarFallback>
					</Avatar>
					{props.social?.name || `Validator ${props.id}`}
				</CardTitle>
				<CardDescription>
					{props.validator
						? `${props.validator.auth.substring(0, 6)}...${props.validator.auth.substring(props.validator.auth.length - 6)}`
						: 'Validator details unavailable'}
				</CardDescription>
			</CardHeader>
			{props.validator && (
				<CardContent className={'flex flex-col gap-3'}>
					<p className={'flex items-center gap-3'}>
						<LucideCoins /> {humanify(props.validator.selfStake)} VC Self-stake
					</p>
					<p className={'flex items-center gap-3'}>
						<LucideHandCoins /> {humanify(props.validator.delegatedStake)} VC Delegated
					</p>
					<p className={'flex items-center gap-3'}>
						<LucideBanknote /> {humanify(props.validator.receivedStake)} VC Total stake
					</p>
					<p className={'flex items-center gap-3'}>
						<LucideClock /> {props.validator.remainingLockedStakeDays} locked days left
					</p>
					<p className={'flex items-center gap-3'}>
						<LucideCandlestickChart /> {approximateDelegationRewards?.apr}% Max APR
					</p>
				</CardContent>
			)}
			{props.onSelected && (
				<CardFooter>
					<Button
						size={'sm'}
						disabled={!props.validator}
						onClick={() => {
							if (props.validator) props.onSelected?.(props.validator);
						}}
					>
						Delegate
					</Button>
				</CardFooter>
			)}
		</Card>
	);
}
