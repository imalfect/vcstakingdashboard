import PaybackWithdrawRequestCard from '@/components/Cards/PaybackWithdrawRequestCard';
import PageHeader from '@/components/Misc/PageHeader';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious
} from '@/components/ui/carousel';
import useAddressPaybackWithdrawRequests from '@/hooks/useAddressPaybackWithdrawRequests';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export default function PaybackWithdrawRequests() {
	const account = useAccount();
	const [address, setAddress] = useState(account.address || '0x0');
	const withdrawRequests = useAddressPaybackWithdrawRequests(address);
	return (
		<div className={'flex flex-col items-center gap-3'}>
			<PageHeader
				title={'Payback Withdrawal Requests'}
				subtitle={'Retrieve your payback staked coins.'}
			/>
			{withdrawRequests.length > 0 ? (
				<Carousel className={'mt-6 max-w-[18rem] lg:max-w-[37rem] xl:max-w-[56rem]'}>
					<CarouselContent>
						{withdrawRequests.map((withdrawRequest) => (
							<CarouselItem key={withdrawRequest.id} className={'basis-auto'}>
								<PaybackWithdrawRequestCard
									withdrawRequest={withdrawRequest}
									onWithdraw={() => {
										// refresh
										setAddress('0x0');
										setTimeout(() => {
											setAddress(account.address!);
										}, 1000);
									}}
									key={withdrawRequest.id}
								/>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
			) : (
				<p className={'text-gray-700 dark:text-gray-300'}>No withdrawal requests found.</p>
			)}
		</div>
	);
}
