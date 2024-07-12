'use client';
import PageHeader from '@/components/Misc/PageHeader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { LucideAlertTriangle, LucideCoins, LucideInfo, LucideReceiptText } from 'lucide-react';
import { useRouter } from 'next/navigation';
export default function Home() {
	const router = useRouter();
	return (
		<main className={'flex min-h-screen flex-col items-center justify-center'}>
			<PageHeader
				title={'VinuChain Staking Station'}
				subtitle={'Delegate your coins to validators with ease.'}
			/>
			<div className={'mt-3 flex flex-wrap justify-center gap-3'}>
				<Button
					size={'lg'}
					className={'gap-3'}
					onClick={() => {
						router.push('/delegate');
					}}
				>
					<LucideCoins /> Delegate
				</Button>
				<Button
					size={'lg'}
					className={'gap-3'}
					onClick={() => {
						router.push('/delegations');
					}}
				>
					<LucideReceiptText /> Check delegations
				</Button>
				<Button
					size={'lg'}
					className={'gap-3'}
					onClick={() => {
						router.push('/about');
					}}
				>
					<LucideInfo />
					About
				</Button>
			</div>
			<Alert className={'mt-3 w-96'}>
				<LucideAlertTriangle color={'#ff0000'} />
				<AlertTitle>Beta software</AlertTitle>
				<AlertDescription>
					This product is in beta. Loss of funds may occur. Use at your own risk.
				</AlertDescription>
			</Alert>
		</main>
	);
}
