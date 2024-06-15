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
import useValidator from '@/hooks/useValidator';
import useValidatorSocial from '@/hooks/useValidatorSocial';
import humanify from '@/scripts/humanify';
import { Banknote, LucideCoins, LucideHandCoins } from 'lucide-react';

export default function ValidatorCard(props: { id: bigint; onDelegate?: (id: bigint) => void }) {
	const validatorData = useValidator(props.id);
	const validatorSocial = useValidatorSocial(validatorData?.socialInfoUrl || '');
	console.log(validatorData);
	return (
		validatorData && (
			<Card>
				<CardHeader>
					<CardTitle className={'flex items-center gap-3'}>
						<Avatar>
							<AvatarImage src={validatorSocial?.logo} />
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
						<Banknote /> {humanify(validatorData.receivedStake)} VC Total stake
					</p>
				</CardContent>
				{props.onDelegate && (
					<CardFooter>
						{/* Not sure why this is throwing a TypeScript error, as it's being checked for existence */}
						<Button size={'sm'} onClick={() => props.onDelegate!(props.id)}>
							Delegate
						</Button>
					</CardFooter>
				)}
			</Card>
		)
	);
}
