import PageHeader from '@/components/Misc/PageHeader';
import WalletNotConnected from '@/components/Misc/WalletNotConnected';
import { useAccount } from 'wagmi';

export default function StakePayback() {
	const account = useAccount();
	return (
		<div className={'flex min-h-screen flex-col items-center justify-center'}>
			{account.isConnected ? (
				<>
					<PageHeader
						title={'Stake for payback'}
						subtitle={'Stake your coins to make feeless transactions.'}
					/>
				</>
			) : (
				<WalletNotConnected />
			)}
		</div>
	);
}
