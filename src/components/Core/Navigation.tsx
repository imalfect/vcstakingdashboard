'use client';
import { TooltipButton } from '@/components/ui/tooltip-button';
import { ConnectButton } from '@rainbow-me/rainbowkit/components';
import {
	LucideCoins,
	LucideHandCoins,
	LucideHome,
	LucideInfo,
	LucideMailbox,
	LucideNetwork,
	LucideReceiptText,
	LucideWallet
} from 'lucide-react';
import { useRouter } from 'next/navigation';
export default function Navigation() {
	const router = useRouter();
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
			<ConnectButton.Custom>
				{({ account, chain, mounted, openAccountModal, openChainModal, openConnectModal }) => (
					<div
						className={'flex gap-3'}
						aria-hidden={!mounted}
						style={{
							opacity: mounted ? 1 : 0,
							pointerEvents: mounted ? 'auto' : 'none'
						}}
					>
						{account && chain && (
							<TooltipButton
								aria-label={'Network'}
								message={'Switch network'}
								size={'icon'}
								onClick={openChainModal}
							>
								<LucideNetwork />
							</TooltipButton>
						)}
						<TooltipButton
							aria-label={'Wallet'}
							message={'Wallet'}
							size={'icon'}
							disabled={!mounted}
							onClick={() => {
								if (!account || !chain) {
									openConnectModal();
								} else if (chain.unsupported) {
									openChainModal();
								} else {
									openAccountModal();
								}
							}}
						>
							<LucideWallet />
						</TooltipButton>
					</div>
				)}
			</ConnectButton.Custom>
		</div>
	);
}
