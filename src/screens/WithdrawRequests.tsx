'use client';
import DelegationWithdrawRequestCard from '@/components/Cards/DelegationWithdrawRequestCard';
import {
	StakingSessionGate,
	SupportedStakingSession,
	useStakingSession
} from '@/components/Contexts/StakingSession';
import PageHeader from '@/components/Misc/PageHeader';
import { Button } from '@/components/ui/button';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious
} from '@/components/ui/carousel';
import useAddressDelegationWithdrawRequests from '@/hooks/useAddressDelegationWithdrawRequests';
import useCurrentEpoch from '@/hooks/useCurrentEpoch';
import useLastValidatorId from '@/hooks/useLastValidatorId';
import useValidators from '@/hooks/useValidators';
import useValidatorSocials from '@/hooks/useValidatorSocials';
import useWithdrawalPeriods from '@/hooks/useWithdrawalPeriods';
import { useEffect, useState } from 'react';

export default function WithdrawRequests() {
	return (
		<div className={'flex min-h-screen flex-col items-center justify-center'}>
			<StakingSessionGate>
				<SupportedWithdrawRequests />
			</StakingSessionGate>
		</div>
	);
}
const REQUESTS_PER_PAGE = 12;

function SupportedWithdrawRequests() {
	const state = useStakingSession();
	if (state.status !== 'supported') return null;
	return <WithdrawRequestsSession session={state.session} />;
}

function WithdrawRequestsSession({ session }: { session: SupportedStakingSession }) {
	const lastValidatorId = useLastValidatorId();
	if (lastValidatorId.isLoading) {
		return (
			<>
				<PageHeader
					title={'Withdraw Requests'}
					subtitle={'Check your delegation withdrawal requests'}
				/>
				<p>Loading withdraw requests…</p>
			</>
		);
	}
	if (lastValidatorId.error || lastValidatorId.data === null) {
		return (
			<>
				<PageHeader
					title={'Withdraw Requests'}
					subtitle={'Check your delegation withdrawal requests'}
				/>
				<div className="flex flex-col items-center gap-3">
					<p>Unable to load withdraw requests.</p>
					<Button disabled={lastValidatorId.isFetching} onClick={() => void lastValidatorId.refetch()}>
						Retry
					</Button>
				</div>
			</>
		);
	}
	return <WithdrawRequestsData session={session} lastValidatorId={lastValidatorId.data} />;
}

function WithdrawRequestsData({
	session,
	lastValidatorId
}: {
	session: SupportedStakingSession;
	lastValidatorId: bigint;
}) {
	const withdrawRequests = useAddressDelegationWithdrawRequests(session.address, lastValidatorId);
	const withdrawalPeriods = useWithdrawalPeriods();
	const currentEpoch = useCurrentEpoch();
	const periods = withdrawalPeriods.data;
	const epoch = currentEpoch.data;
	const requestSignature = withdrawRequests.data
		.map((request) => `${request.validatorId}:${request.id}`)
		.join(',');
	const [pagination, setPagination] = useState({ signature: requestSignature, page: 0 });
	const page = pagination.signature === requestSignature ? pagination.page : 0;
	const pageStart = page * REQUESTS_PER_PAGE;
	const pageRequests = withdrawRequests.data.slice(pageStart, pageStart + REQUESTS_PER_PAGE);
	const validators = useValidators(pageRequests.map((request) => request.validatorId));
	const socialUrls = validators.data.flatMap((validator) =>
		validator?.socialInfoUrl ? [validator.socialInfoUrl] : []
	);
	const socials = useValidatorSocials(socialUrls);

	useEffect(() => {
		if (pagination.signature !== requestSignature) {
			setPagination({ signature: requestSignature, page: 0 });
		}
	}, [pagination.signature, requestSignature]);

	const prerequisiteUnavailable = periods === null || epoch === null;
	const requiredError =
		withdrawRequests.error ||
		withdrawalPeriods.error ||
		currentEpoch.error ||
		prerequisiteUnavailable ||
		(withdrawRequests.data.length === 0 && withdrawRequests.failures.length > 0);
	const showingEnd = Math.min(pageStart + pageRequests.length, withdrawRequests.data.length);
	return (
		<>
			<PageHeader title={'Withdraw Requests'} subtitle={'Check your delegation withdrawal requests'} />
			<div className={'flex flex-col items-center gap-6'}>
				{withdrawRequests.isLoading || withdrawalPeriods.isLoading || currentEpoch.isLoading ? (
					<p>Loading withdraw requests…</p>
				) : requiredError ? (
					<div className="flex flex-col items-center gap-3">
						<p>Unable to load withdraw requests.</p>
						<Button
							disabled={
								withdrawRequests.isFetching || withdrawalPeriods.isFetching || currentEpoch.isFetching
							}
							onClick={() => {
								void withdrawRequests.refetch();
								void withdrawalPeriods.refetch();
								void currentEpoch.refetch();
							}}
						>
							Retry
						</Button>
					</div>
				) : periods !== null && epoch !== null ? (
					<>
						{withdrawRequests.failures.length > 0 && (
							<div className="flex flex-col items-center gap-2">
								<p>Some withdraw requests could not be loaded.</p>
								<Button
									variant="outline"
									disabled={withdrawRequests.isFetching}
									onClick={() => void withdrawRequests.refetch()}
								>
									Retry
								</Button>
							</div>
						)}
						{validators.isLoading && <p>Loading validator details…</p>}
						{(validators.error || validators.failures.length > 0) && (
							<div className="flex flex-col items-center gap-2">
								<p>Some validator details could not be loaded.</p>
								<Button
									variant="outline"
									disabled={validators.isFetching}
									onClick={() => void validators.refetch()}
								>
									Retry
								</Button>
							</div>
						)}
						{socials.isLoading && <p>Loading validator profiles…</p>}
						{socials.failures.length > 0 && (
							<div className="flex flex-col items-center gap-2">
							</div>
						)}
						{withdrawRequests.data.length > 0 ? (
							<>
								<Carousel
									key={`${requestSignature}:${page}`}
									className={'mt-6 max-w-[18rem] lg:max-w-[37rem] xl:max-w-[56rem]'}
								>
									<CarouselContent>
										{pageRequests.map((withdrawRequest, index) => {
											const validator = validators.data[index] ?? null;
											const social = validator?.socialInfoUrl
												? socials.data.get(validator.socialInfoUrl)
												: undefined;
											return (
												<CarouselItem
													key={`wr${withdrawRequest.id}v${withdrawRequest.validatorId}`}
													className={'basis-auto'}
												>
													<DelegationWithdrawRequestCard
														withdrawRequest={withdrawRequest}
														withdrawalPeriods={periods}
														currentEpoch={epoch}
														social={social}
													/>
												</CarouselItem>
											);
										})}
									</CarouselContent>
									<CarouselPrevious />
									<CarouselNext />
								</Carousel>
								<div className="flex gap-3">
									<Button
										variant="outline"
										disabled={page === 0 || validators.isLoading || socials.isLoading}
										onClick={() => setPagination({ signature: requestSignature, page: page - 1 })}
									>
										Previous requests
									</Button>
									<Button
										variant="outline"
										disabled={
											showingEnd >= withdrawRequests.data.length || validators.isLoading || socials.isLoading
										}
										onClick={() => setPagination({ signature: requestSignature, page: page + 1 })}
									>
										More requests
									</Button>
								</div>
							</>
						) : (
							<p>No withdraw requests found.</p>
						)}
						{withdrawRequests.hasMore && (
							<Button
								disabled={withdrawRequests.isFetching || withdrawRequests.failures.length > 0}
								onClick={() => void withdrawRequests.loadMore()}
							>
								{withdrawRequests.isFetchingMore ? 'Loading…' : 'Load more'}
							</Button>
						)}
					</>
				) : null}
			</div>
		</>
	);
}
