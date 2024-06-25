import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { faDiscord, faTelegram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';

export default function AuthorCard(props: {
	avatar: string;
	name: string;
	description: string;
	discord?: string;
	twitter?: string;
	telegram?: string;
}) {
	return (
		<Card className={'flex w-64 flex-col justify-between'}>
			<CardContent className={'flex flex-col items-center p-6 text-center'}>
				<Image
					src={props.avatar}
					alt={props.name + ' avatar'}
					width={100}
					height={100}
					className={'mb-3 aspect-square rounded-xl object-cover'}
				/>
				<CardTitle>{props.name}</CardTitle>
				<div className={'mt-3'}>{props.description}</div>
			</CardContent>
			<CardFooter className={'flex justify-center gap-1'}>
				{props.discord && (
					<Link href={props.discord} target={'_blank'}>
						<FontAwesomeIcon icon={faDiscord} width={24} height={24} />
					</Link>
				)}
				{props.twitter && (
					<Link href={props.twitter} target={'_blank'}>
						<FontAwesomeIcon icon={faTwitter} width={24} height={24} />
					</Link>
				)}
				{props.telegram && (
					<Link href={props.telegram} target={'_blank'}>
						<FontAwesomeIcon icon={faTelegram} width={24} height={24} />
					</Link>
				)}
			</CardFooter>
		</Card>
	);
}
