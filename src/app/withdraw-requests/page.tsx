'use client';
import WithdrawRequestCard from '@/components/Cards/WithdrawRequestCard';
import { UpdateContext } from '@/components/Contexts/UpdateContext';
import PageHeader from '@/components/Misc/PageHeader';
import WalletNotConnected from '@/components/Misc/WalletNotConnected';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious
} from '@/components/ui/carousel';
import useAddressWithdrawRequests from '@/hooks/useAddressWithdrawRequests';
import useCurrentEpoch from '@/hooks/useCurrentEpoch';
import useWithdrawalPeriods from '@/hooks/useWithdrawalPeriods';
import { useState } from 'react';
import { useAccount } from 'wagmi';
/*export const metadata: Metadata = {
	title: 'VinuChain Staking Station - Delegations',
	description: 'Check your delegations, rewards, and other information here.'
};*/

export default function WithdrawRequestsPage() {
	const account = useAccount();
	const [address, setAddress] = useState(account.address);
	const withdrawRequests = useAddressWithdrawRequests(address || '0x0');
	const withdrawalPeriods = useWithdrawalPeriods();
	const currentEpoch = useCurrentEpoch();
	const update = () => {
		setAddress('0x0');
		setTimeout(() => {
			setAddress(account.address);
		}, 1000);
	};
	return (
		<div className={'flex min-h-screen flex-col items-center justify-center'}>
			{account.isConnected ? (
				<>
					<PageHeader
						title={'Withdraw Requests'}
						subtitle={'Check your delegation withdrawal requests'}
					/>
					<div className={'flex items-start gap-6'}>
						<UpdateContext.Provider value={update}>
							{withdrawRequests.length > 0 ? (
								<Carousel className={'mt-6 max-w-[18rem] lg:max-w-[37rem] xl:max-w-[56rem]'}>
									<CarouselContent>
										{withdrawRequests.map((withdrawRequest) => (
											<CarouselItem
												key={`wr${withdrawRequest.id}v${withdrawRequest.validatorId}`}
												className={'basis-auto'}
											>
												<WithdrawRequestCard
													withdrawRequest={withdrawRequest}
													withdrawalPeriods={withdrawalPeriods}
													currentEpoch={currentEpoch}
												/>
											</CarouselItem>
										))}
									</CarouselContent>
									<CarouselPrevious />
									<CarouselNext />
								</Carousel>
							) : (
								<p>No withdraw requests found.</p>
							)}
						</UpdateContext.Provider>
					</div>
				</>
			) : (
				<WalletNotConnected />
			)}
		</div>
	);
}
