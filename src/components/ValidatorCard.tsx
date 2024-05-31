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
import { Banknote, LucideCoins, LucideHandCoins } from 'lucide-react';

export default function ValidatorCard() {
	return (
		<Card>
			<CardHeader>
				<CardTitle className={'flex items-center gap-3'}>
					<Avatar>
						<AvatarImage src={'https://i.imgur.com/F11UmhP.png'} />
						<AvatarFallback>VU</AvatarFallback>
					</Avatar>
					v9000Node
				</CardTitle>
				<CardDescription>0xbf011b ... 900d68</CardDescription>
			</CardHeader>
			<CardContent className={'flex flex-col gap-3'}>
				<p className={'flex items-center gap-3'}>
					<LucideCoins /> 9,000 VC Self-stake
				</p>
				<p className={'flex items-center gap-3'}>
					<LucideHandCoins /> 20,000 VC Delegated
				</p>
				<p className={'flex items-center gap-3'}>
					<Banknote /> 29,000 VC Total stake
				</p>
			</CardContent>
			<CardFooter>
				<Button>Delegate to this validator</Button>
			</CardFooter>
		</Card>
	);
}
