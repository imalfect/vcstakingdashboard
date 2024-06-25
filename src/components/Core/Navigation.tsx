'use client';
import { Button } from '@/components/ui/button';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import {
	LucideCoins,
	LucideHome,
	LucideInfo,
	LucideMailbox,
	LucideReceiptText,
	LucideWallet
} from 'lucide-react';
import { useRouter } from 'next/navigation';
export default function Navigation() {
	const router = useRouter();
	const { open } = useWeb3Modal();
	return (
		<div className={'flex items-end justify-center gap-3'}>
			<Button
				size={'icon'}
				onClick={() => {
					router.push('/');
				}}
			>
				<LucideHome />
			</Button>
			<Button
				size={'icon'}
				onClick={() => {
					router.push('/delegate');
				}}
			>
				<LucideCoins />
			</Button>
			<Button
				size={'icon'}
				onClick={() => {
					router.push('/delegations');
				}}
			>
				<LucideReceiptText />
			</Button>
			<Button
				size={'icon'}
				onClick={() => {
					router.push('/withdraw-requests');
				}}
			>
				<LucideMailbox />
			</Button>

			<Button
				size={'icon'}
				onClick={() => {
					router.push('/about');
				}}
			>
				<LucideInfo />
			</Button>
			<Button
				size={'icon'}
				onClick={() => {
					open();
				}}
			>
				<LucideWallet />
			</Button>
		</div>
	);
}
