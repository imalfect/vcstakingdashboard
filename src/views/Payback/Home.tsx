import PageHeader from '@/components/Misc/PageHeader';
import { Button } from '@/components/ui/button';
import useAddressPayback from '@/hooks/useAddressPayback';
import { View } from '@/screens/Payback';
import humanify from '@/scripts/humanify';
import { LucideCoins, LucideHandCoins } from 'lucide-react';
import { useAccount } from 'wagmi';

export default function PaybackHome(props: { setView: (view: View) => void }) {
	const account = useAccount();
	const addressPayback = useAddressPayback(account.address!);
	return (
		<div>
			<PageHeader title={'Payback'} subtitle={'Stake your coins to make feeless transactions.'} />
			<div className={'mt-3 flex flex-col gap-3'}>
				<div className={'flex flex-col items-center text-center'}>
					<span className={'text-4xl font-bold'}>{humanify(addressPayback)} VC</span>
					<span>Staked</span>
				</div>
				<div className={'flex justify-center gap-6'}>
					<Button
						size={'lg'}
						className={'gap-3'}
						onClick={() => {
							props.setView(View.Stake);
						}}
					>
						<LucideCoins /> Stake
					</Button>
					<Button
						size={'lg'}
						className={'gap-3'}
						onClick={() => {
							props.setView(View.Unstake);
						}}
					>
						<LucideHandCoins /> Unstake
					</Button>
				</div>
			</div>
		</div>
	);
}
