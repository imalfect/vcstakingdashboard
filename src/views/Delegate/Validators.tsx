'use client';
import ValidatorCard from '@/components/Cards/ValidatorCard';
import PageHeader from '@/components/Misc/PageHeader';
import { Button } from '@/components/ui/button';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	type CarouselApi
} from '@/components/ui/carousel';
import useActiveValidators from '@/hooks/useActiveValidators';
import useCurrentEpoch from '@/hooks/useCurrentEpoch';
import useValidators from '@/hooks/useValidators';
import useValidatorSocials from '@/hooks/useValidatorSocials';
import Validator from '@/types/validator';
import { useEffect, useMemo, useState } from 'react';
import seedrandom from 'seedrandom';

const VALIDATORS_PER_PAGE = 20;

export default function DelegateValidators(props: { onValidator: (validator: Validator) => void }) {
	const epoch = useCurrentEpoch();
	const activeValidators = useActiveValidators(epoch.error ? null : epoch.data);
	const deduplicatedIds = useMemo(
		() => [...new Set(activeValidators.data)],
		[activeValidators.data]
	);
	const orderSignature = `${epoch.data ?? 'unavailable'}:${deduplicatedIds.join(',')}`;
	const orderedIds = useMemo(() => {
		if (epoch.data === null) return [];
		const shuffled = [...deduplicatedIds];
		const random = seedrandom(`${epoch.data}:${deduplicatedIds.join(',')}`);
		for (let index = shuffled.length - 1; index > 0; index -= 1) {
			const swapIndex = Math.floor(random() * (index + 1));
			[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
		}
		return shuffled;
	}, [deduplicatedIds, epoch.data]);
	const [pagination, setPagination] = useState({ signature: orderSignature, page: 0 });
	const [api, setApi] = useState<CarouselApi>();
	const page = pagination.signature === orderSignature ? pagination.page : 0;
	const pageStart = page * VALIDATORS_PER_PAGE;
	const pageIds = orderedIds.slice(pageStart, pageStart + VALIDATORS_PER_PAGE);
	const validators = useValidators(pageIds);
	const socialUrls = validators.data.flatMap((validator) =>
		validator?.socialInfoUrl ? [validator.socialInfoUrl] : []
	);
	const socials = useValidatorSocials(socialUrls);

	useEffect(() => {
		if (pagination.signature !== orderSignature) {
			setPagination({ signature: orderSignature, page: 0 });
		}
		api?.scrollTo(0, true);
	}, [api, orderSignature, pagination.signature]);

	const changePage = (nextPage: number) => {
		setPagination({ signature: orderSignature, page: nextPage });
		api?.scrollTo(0, true);
	};

	if (epoch.isLoading || activeValidators.isLoading) {
		return <p>Loading validators…</p>;
	}

	if (epoch.error || activeValidators.error) {
		return (
			<div className="flex flex-col items-center gap-3">
				<p>Unable to load validators.</p>
				<Button
					onClick={() => {
						if (epoch.data === null || epoch.error) void epoch.refetch();
						else void activeValidators.refetch();
					}}
				>
					Retry
				</Button>
			</div>
		);
	}

	if (activeValidators.data.length === 0) {
		return <p>No active validators found.</p>;
	}

	const allValidatorReadsFailed =
		validators.data.length > 0 &&
		validators.data.every((validator) => validator === null) &&
		validators.failures.length > 0;
	if (validators.error || allValidatorReadsFailed) {
		return (
			<div className="flex flex-col items-center gap-3">
				<p>Unable to load validator details.</p>
				<Button disabled={validators.isFetching} onClick={() => void validators.refetch()}>
					Retry
				</Button>
			</div>
		);
	}

	const showingStart = pageStart + 1;
	const showingEnd = Math.min(pageStart + pageIds.length, orderedIds.length);
	const pageChangesDisabled = validators.isLoading || socials.isLoading;
	return (
		<div className="flex flex-col items-center justify-center gap-6">
			<PageHeader
				title="Choose a validator"
				subtitle="It's time to choose the validator you'd like to support."
			/>
			{validators.isLoading && <p>Loading validator details…</p>}
			{validators.failures.length > 0 && (
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
			<Carousel
				className="w-96 lg:w-[48rem] xl:w-[72rem]"
				setApi={setApi}
				opts={{ align: 'start', loop: false, containScroll: 'trimSnaps' }}
			>
				<CarouselContent>
					{pageIds.map((validatorId, index) => {
						const validator = validators.data[index] ?? null;
						const social = validator?.socialInfoUrl
							? socials.data.get(validator.socialInfoUrl)
							: undefined;
						return (
							<CarouselItem key={validatorId.toString()} className="lg:basis-1/2 xl:basis-1/3">
								<ValidatorCard
									id={validatorId}
									validator={validator}
									social={social}
									onSelected={props.onValidator}
								/>
							</CarouselItem>
						);
					})}
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
			</Carousel>
			<p className="text-center text-sm font-medium">
				Showing {showingStart}–{showingEnd} of {orderedIds.length} validators
			</p>
			<div className="flex gap-3">
				<Button
					variant="outline"
					disabled={page === 0 || pageChangesDisabled}
					onClick={() => changePage(page - 1)}
				>
					Previous validators
				</Button>
				<Button
					variant="outline"
					disabled={showingEnd >= orderedIds.length || pageChangesDisabled}
					onClick={() => changePage(page + 1)}
				>
					More validators
				</Button>
			</div>
		</div>
	);
}
