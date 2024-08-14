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
import useValidator from '@/hooks/useValidator';
import useValidatorSocial from '@/hooks/useValidatorSocial';
import humanify from '@/scripts/humanify';
import Validator from '@/types/validator';
import {
	LucideBanknote,
	LucideCandlestickChart,
	LucideClock,
	LucideCoins,
	LucideHandCoins,
	LucideLoader2
} from 'lucide-react';

export default function ValidatorCard(props: {
	id: bigint;
	onSelected?: (validator: Validator) => void;
}) {
	const validatorData = useValidator(props.id);
	const validatorSocial = useValidatorSocial(validatorData?.socialInfoUrl || '');
	const approximateDelegationRewards = useApproximateDelegationRewards(
		10000000000000000n,
		(validatorData?.remainingLockedStakeDays || 0)
	);
	return validatorData ? (
		<Card>
			<CardHeader>
				<CardTitle className={'flex items-center gap-3'}>
					<Avatar>
						<AvatarImage src={validatorSocial?.logoUrl} />
						<AvatarFallback>{props.id.toString()}</AvatarFallback>
					</Avatar>
					{validatorSocial?.name || `Validator ${props.id}`}
				</CardTitle>
				<CardDescription>
					{validatorData.auth.substring(0, 6) +
						'...' +
						validatorData.auth.substring(validatorData.auth.length - 6)}
				</CardDescription>
			</CardHeader>
			<CardContent className={'flex flex-col gap-3'}>
				<p className={'flex items-center gap-3'}>
					<LucideCoins /> {humanify(validatorData.selfStake)} VC Self-stake
				</p>
				<p className={'flex items-center gap-3'}>
					<LucideHandCoins /> {humanify(validatorData.delegatedStake)} VC Delegated
				</p>
				<p className={'flex items-center gap-3'}>
					<LucideBanknote /> {humanify(validatorData.receivedStake)} VC Total stake
				</p>
				<p className={'flex items-center gap-3'}>
					<LucideClock /> {validatorData.remainingLockedStakeDays} locked days left
				</p>
				<p className={'flex items-center gap-3'}>
					<LucideCandlestickChart /> {approximateDelegationRewards?.apr}% Max APR
				</p>
			</CardContent>
			{props.onSelected && (
				<CardFooter>
					{/* Not sure why this is throwing a TypeScript error, as it's being checked for existence */}
					<Button size={'sm'} onClick={() => props.onSelected!(validatorData)}>
						Delegate
					</Button>
				</CardFooter>
			)}
		</Card>
	) : (
		<LucideLoader2 className={'mx-auto animate-spin'} size={48} />
	);
}
