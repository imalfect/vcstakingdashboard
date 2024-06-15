'use client';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import useValidator from '@/hooks/useValidator';
import { LucideCoins, LucideInfo, LucideReceiptText } from 'lucide-react';
export default function Home() {
	const validator = useValidator(15n);
	return (
		<main className={'flex min-h-screen flex-col items-center justify-center'}>
			<PageHeader
				title={'VinuChain Staking Dashboard'}
				subtitle={'Delegate your coins to validators with ease.'}
			/>
			<div className={'mt-3 flex flex-wrap justify-center gap-3'}>
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
				{/*<TransactionProcessor
					transactions={[
						{
							abi: sfc,
							address: '0x6b175474e89094c44da98b954eedeac495271d0f',
							functionName: 'claimRewards',
							args: [12n],
							name: 'Claim rewards'
						},
						{
							abi: sfc,
							address: '0x6b175474e89094c44da98b954eedeac495271d0f',
							functionName: 'claimRewards',
							args: [12n],
							name: 'Claim rewards'
						},
						{
							abi: sfc,
							address: '0x6b175474e89094c44da98b954eedeac495271d0f',
							functionName: 'claimRewards',
							args: [12n],
							name: 'Claim rewards'
						}
					]}
				/>*/}
			</div>
		</main>
	);
}
