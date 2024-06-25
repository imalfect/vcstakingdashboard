import AuthorCard from '@/components/Cards/AuthorCard';
import PageHeader from '@/components/Misc/PageHeader';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious
} from '@/components/ui/carousel';
import type { Metadata } from 'next';
export const metadata: Metadata = {
	title: 'VinuChain Staking Station - About',
	description: 'Learn more about the geniuses behind this masterpiece.'
};
// TODO: images in public instead of an external source
export default function Home() {
	return (
		<main className={'flex min-h-screen flex-col items-center justify-center'}>
			<PageHeader
				title={'About VinuChain Staking Station'}
				subtitle={'Learn more about the geniuses behind this masterpiece.'}
			/>
			<Carousel className={'mt-6 w-[16rem] lg:w-[33rem]'}>
				<CarouselContent>
					<CarouselItem className={'lg:basis-1/2'}>
						<AuthorCard
							avatar={
								'https://cdn.discordapp.com/avatars/852640730093453372/2ffd696ed69cb1469ce0a565bd4b458a.webp?size=128'
							}
							name={'iMalFect'}
							description={'lead dev of this masterpiece, pure genius'}
							discord={'https://discord.com/users/852640730093453372'}
							twitter={'https://twitter.com/imaldev'}
							telegram={'https://t.me/imaldev'}
						/>
					</CarouselItem>
					<CarouselItem className={'lg:basis-1/2 xl:basis-1/3'}>
						<AuthorCard
							avatar={
								'https://cdn.discordapp.com/avatars/104674706061275136/a_0731f927bd903475911ae4b3e94c5af5.webp?size=128'
							}
							name={'v9000'}
							description={'just a guy who doesnt like web dev but forced to learn stuff'}
							discord={'https://discord.com/users/104674706061275136'}
							twitter={'https://twitter.com/v9000x'}
							telegram={'https://t.me/MattVT'}
						/>
					</CarouselItem>
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
			</Carousel>
		</main>
	);
}
