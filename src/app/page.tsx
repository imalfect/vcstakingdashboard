'use client';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { LucideCoins, LucideInfo, LucideReceiptText } from 'lucide-react';

export default function Home() {
	return (
		<main className={'flex min-h-screen flex-col items-center justify-center'}>
			<PageHeader
				title={'VinuChain Staking Dashboard'}
				subtitle={'Delegate your coins to validators with ease.'}
			/>
			<div className={'mt-3 flex flex-wrap gap-3'}>
				<Button size={'lg'} className={'gap-3'}>
					<LucideCoins /> Delegate
				</Button>
				<Button size={'lg'} className={'gap-3'}>
					<LucideReceiptText /> Check delegations
				</Button>
				<Button size={'lg'} className={'gap-3'}>
					<LucideInfo />
					About
				</Button>
			</div>
		</main>
	);
}
