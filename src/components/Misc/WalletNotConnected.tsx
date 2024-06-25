import { LucideWallet } from 'lucide-react';

export default function WalletNotConnected() {
	return (
		<div className={'flex flex-col items-center gap-3 text-center'}>
			<div>
				<h2 className={'flex items-center gap-3 text-4xl font-bold'}>
					<LucideWallet className={'text-red-500'} size={32} /> Wallet not connected
				</h2>
				<p className={'text-lg'}>Please connect your wallet to continue.</p>
			</div>
			<w3m-button />
		</div>
	);
}
