'use client';
import DelegationCard from '@/components/Cards/DelegationCard';
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
import useAddressDelegations from '@/hooks/useAddressDelegations';
import useValidators from '@/hooks/useValidators';
import useValidatorSocials from '@/hooks/useValidatorSocials';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Delegations() {
	return (
		<div className={'flex min-h-screen flex-col items-center justify-center'}>
			<StakingSessionGate>
				<SupportedDelegations />
			</StakingSessionGate>
		</div>
	);
}

const DELEGATIONS_PER_PAGE = 12;

function SupportedDelegations() {
	const state = useStakingSession();
	if (state.status !== 'supported') return null;
	return <DelegationsSession session={state.session} />;
}

function DelegationsSession({ session }: { session: SupportedStakingSession }) {
	const delegations = useAddressDelegations(session.address);
	const delegationSignature = delegations.data
		.map((delegation) => delegation.validatorId.toString())
		.join(',');
	const [pagination, setPagination] = useState({ signature: delegationSignature, page: 0 });
	const page = pagination.signature === delegationSignature ? pagination.page : 0;
	const pageStart = page * DELEGATIONS_PER_PAGE;
	const pageDelegations = delegations.data.slice(pageStart, pageStart + DELEGATIONS_PER_PAGE);
	const validators = useValidators(pageDelegations.map((delegation) => delegation.validatorId));
	const socialUrls = validators.data.flatMap((validator) =>
		validator?.socialInfoUrl ? [validator.socialInfoUrl] : []
	);
	const socials = useValidatorSocials(socialUrls);

	useEffect(() => {
		if (pagination.signature !== delegationSignature) {
			setPagination({ signature: delegationSignature, page: 0 });
		}
	}, [delegationSignature, pagination.signature]);

	const showingEnd = Math.min(pageStart + pageDelegations.length, delegations.data.length);
	return (
		<>
			<PageHeader title={'Delegations'} subtitle={'View your delegations'} />
			<p className={'text-center'}>
				Delegation disappeared after starting the undelegation process?{' '}
				<Link href={'/withdraw-requests'} className={'underline'}>
					Find it here
				</Link>
			</p>
			{delegations.isLoading ? (
				<p>Loading delegations…</p>
			) : delegations.error || (delegations.data.length === 0 && delegations.failures.length > 0) ? (
				<div className="flex flex-col items-center gap-3">
					<p>Unable to load delegations.</p>
					<Button disabled={delegations.isFetching} onClick={() => void delegations.refetch()}>
						Retry
					</Button>
				</div>
			) : (
				<>
					{delegations.failures.length > 0 && (
						<div className="flex flex-col items-center gap-2">
							<p>Some delegations could not be loaded.</p>
							<Button
								disabled={delegations.isFetching}
								variant="outline"
								onClick={() => void delegations.refetch()}
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
								disabled={validators.isFetching}
								variant="outline"
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
					{delegations.data.length > 0 ? (
						<>
							<Carousel
								key={`${delegationSignature}:${page}`}
								className={'mt-6 max-w-[22rem] lg:max-w-[45rem] xl:max-w-[68rem]'}
							>
								<CarouselContent>
									{pageDelegations.map((delegation, index) => {
										const validator = validators.data[index] ?? null;
										const social = validator?.socialInfoUrl
											? socials.data.get(validator.socialInfoUrl)
											: undefined;
										return (
											<CarouselItem key={delegation.validatorId} className={'basis-auto'}>
												<DelegationCard delegation={delegation} validator={validator} social={social} />
											</CarouselItem>
										);
									})}
								</CarouselContent>
								<CarouselPrevious className={'hidden lg:flex'} />
								<CarouselNext className={'hidden lg:flex'} />
							</Carousel>
							<div className="flex gap-3">
								<Button
									variant="outline"
									disabled={page === 0 || validators.isLoading || socials.isLoading}
									onClick={() => setPagination({ signature: delegationSignature, page: page - 1 })}
								>
									Previous delegations
								</Button>
								<Button
									variant="outline"
									disabled={
										showingEnd >= delegations.data.length || validators.isLoading || socials.isLoading
									}
									onClick={() => setPagination({ signature: delegationSignature, page: page + 1 })}
								>
									More delegations
								</Button>
							</div>
						</>
					) : (
						<p>No delegations found.</p>
					)}
				</>
			)}
		</>
	);
}
