import PaybackWithdrawRequestCard from '@/components/Cards/PaybackWithdrawRequestCard';
import PageHeader from '@/components/Misc/PageHeader';
import { Button } from '@/components/ui/button';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious
} from '@/components/ui/carousel';
import useAddressPaybackWithdrawRequests from '@/hooks/useAddressPaybackWithdrawRequests';
import useCurrentUnixTime from '@/hooks/useCurrentUnixTime';
import { Address } from 'viem';

export default function PaybackWithdrawRequests(props: {
	address: Address;
	paybackAddress: Address;
}) {
	const withdrawRequests = useAddressPaybackWithdrawRequests(props.address, props.paybackAddress);
	const nowSeconds = useCurrentUnixTime();

	return (
		<div className={'flex flex-col items-center gap-3'}>
			<PageHeader
				title={'Payback Withdrawal Requests'}
				subtitle={'Retrieve your payback staked coins.'}
			/>
			{withdrawRequests.error ? (
				<div className="flex flex-col items-center gap-3">
					<p>Unable to load payback withdrawal requests.</p>
					<Button onClick={() => void withdrawRequests.refetch()}>Retry</Button>
				</div>
			) : withdrawRequests.isLoading || nowSeconds === null ? (
				<p>Loading payback withdrawal requests…</p>
			) : withdrawRequests.data.length > 0 ? (
				<Carousel className={'mt-6 max-w-[18rem] lg:max-w-[37rem] xl:max-w-[56rem]'}>
					<CarouselContent>
						{withdrawRequests.data.map((withdrawRequest) => (
							<CarouselItem key={withdrawRequest.id} className={'basis-auto'}>
								<PaybackWithdrawRequestCard
									withdrawRequest={withdrawRequest}
									nowSeconds={nowSeconds}
									paybackAddress={props.paybackAddress}
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
