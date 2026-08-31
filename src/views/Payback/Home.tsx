import PageHeader from '@/components/Misc/PageHeader';
import { Button } from '@/components/ui/button';
import { View } from '@/screens/Payback';
import humanify from '@/scripts/humanify';
import { LucideArrowRightLeft, LucideCoins, LucideHandCoins, LucideMailbox } from 'lucide-react';

export default function PaybackHome(props: {
	stake: bigint;
	ownedStake: bigint;
	legacy: boolean;
	hasLegacy: boolean;
	setView: (view: View) => void;
	onToggleLegacy: () => void;
}) {
	return (
		<div className={'flex flex-col items-center'}>
			<PageHeader
				title={props.legacy ? 'Legacy Payback V1' : 'Payback V2'}
				subtitle={
					props.legacy
						? 'Recover or migrate stake from the retired contract.'
						: 'Stake your coins to make feeless transactions.'
				}
			/>
			{props.hasLegacy && (
				<Button className={'mt-2'} size="sm" variant="outline" onClick={props.onToggleLegacy}>
					{props.legacy ? 'Back to V2' : 'Legacy V1'}
				</Button>
			)}
			<div className={'mt-3 flex flex-col gap-3'}>
				<div className={'flex flex-col items-center text-center'}>
					<span className={'text-4xl font-bold'}>{humanify(props.stake)} VC</span>
					<span>{props.legacy ? 'Legacy stake' : 'Payback credited to this wallet'}</span>
					{!props.legacy && props.ownedStake !== props.stake && (
						<span className={'text-sm text-gray-700 dark:text-gray-300'}>
							{humanify(props.ownedStake)} VC self-funded and available to unstake
						</span>
					)}
				</div>
				<div className={'flex flex-wrap justify-center gap-3 md:gap-6'}>
					{props.legacy ? (
						<Button size={'lg'} className={'gap-3'} onClick={() => props.setView(View.Migrate)}>
							<LucideArrowRightLeft /> Migrate to V2
						</Button>
					) : (
						<Button size={'lg'} className={'gap-3'} onClick={() => props.setView(View.Stake)}>
							<LucideCoins /> Stake
						</Button>
					)}
					<Button size={'lg'} className={'gap-3'} onClick={() => props.setView(View.Unstake)}>
						<LucideHandCoins /> Unstake
					</Button>
					<Button size={'lg'} className={'gap-3'} onClick={() => props.setView(View.WithdrawRequests)}>
						<LucideMailbox /> Withdrawal Requests
					</Button>
				</div>
				{props.legacy && (
					<p className={'max-w-xl text-center text-sm text-gray-700 dark:text-gray-300'}>
						New deposits are disabled for V1. Use migration or recovery actions only.
					</p>
				)}
			</div>
		</div>
	);
}
