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
	legacy?: boolean;
}) {
	const withdrawRequests = useAddressPaybackWithdrawRequests(
		props.address,
		props.paybackAddress,
		!props.legacy
	);
	const nowSeconds = useCurrentUnixTime();

	return (
		<div className={'flex flex-col items-center gap-3'}>
			<PageHeader
				title={props.legacy ? 'Legacy Withdrawal Requests' : 'Payback Withdrawal Requests'}
				subtitle={
					props.legacy
						? 'Recover coins waiting in the V1 contract.'
						: 'Retrieve your payback staked coins.'
				}
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
									stakerAddress={props.address}
									legacy={props.legacy}
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
