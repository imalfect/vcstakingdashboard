'use client';
import { TooltipButton } from '@/components/ui/tooltip-button';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import {
	LucideCoins,
	LucideHandCoins,
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
			<TooltipButton message={'Home'} size={'icon'} onClick={() => router.push('/')}>
				<LucideHome />
			</TooltipButton>
			<TooltipButton message={'Delegate'} size={'icon'} onClick={() => router.push('/delegate')}>
				<LucideCoins />
			</TooltipButton>
			<TooltipButton message={'Delegations'} size={'icon'} onClick={() => router.push('/delegations')}>
				<LucideReceiptText />
			</TooltipButton>
			<TooltipButton
				message={'Withdraw Requests'}
				size={'icon'}
				onClick={() => router.push('/withdraw-requests')}
			>
				<LucideMailbox />
			</TooltipButton>
			<TooltipButton message={'Payback Staking'} size={'icon'} onClick={() => router.push('/payback')}>
				<LucideHandCoins />
			</TooltipButton>
			<TooltipButton message={'About'} size={'icon'} onClick={() => router.push('/about')}>
				<LucideInfo />
			</TooltipButton>
			<TooltipButton
				message={'Wallet'}
				size={'icon'}
				onClick={() => {
					open();
				}}
			>
				<LucideWallet />
			</TooltipButton>
		</div>
	);
}
