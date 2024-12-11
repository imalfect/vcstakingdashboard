'use client';
import { useState, useEffect } from 'react';
import ValidatorCard from '@/components/Cards/ValidatorCard';
import PageHeader from '@/components/Misc/PageHeader';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	type CarouselApi,
} from '@/components/ui/carousel';
import useActiveValidators from '@/hooks/useActiveValidators';
import useCurrentEpoch from '@/hooks/useCurrentEpoch';
import Validator from '@/types/validator';

export default function DelegateValidators(props: { onValidator: (validator: Validator) => void }) {
	const epoch = useCurrentEpoch();
	const activeValidators = useActiveValidators(epoch || BigInt(0));
	const [currentIndex, setCurrentIndex] = useState(0);
	const [visibleCount, setVisibleCount] = useState(1);
	const [api, setApi] = useState<CarouselApi>();
	const [shuffledValidators, setShuffledValidators] = useState<{ validatorId: bigint; newIndex: number }[]>([]);

	useEffect(() => {
		const updateVisibleCount = () => {
			if (window.innerWidth >= 1280) {
				setVisibleCount(3);
			} else if (window.innerWidth >= 1024) {
				setVisibleCount(2);
			} else {
				setVisibleCount(1);
			}
		};

		updateVisibleCount();
		window.addEventListener('resize', updateVisibleCount);
		return () => window.removeEventListener('resize', updateVisibleCount);
	}, []);

	useEffect(() => {
		if (!api) return;

		const handleSettle = () => {
			setCurrentIndex(api.selectedScrollSnap());
		};

		api.on('settle', handleSettle);
		return () => {
			api.off('settle', handleSettle);
		};
	}, [api]);

	useEffect(() => {
		if (activeValidators && activeValidators.length > 0) {
			const validatorsArray = [...activeValidators];
			validatorsArray.sort(() => Math.random() - 0.5);
			const mappedValidators = validatorsArray.map((validatorId, index) => ({
				validatorId,
				newIndex: index + 1,
			}));
			setShuffledValidators(mappedValidators);
		}
	}, [activeValidators]);

	const getVisibleRange = () => {
		if (shuffledValidators.length === 0) return '0';
		const end = Math.min(currentIndex + visibleCount, shuffledValidators.length);
		return `${end}`;
	};

	return (
		<div className="flex flex-col items-center justify-center gap-6">
			<PageHeader
				title="Choose a validator"
				subtitle="It's time to choose the validator you'd like to support."
			/>
			<Carousel
				className="w-96 lg:w-[48rem] xl:w-[72rem]"
				setApi={setApi}
				opts={{
					align: 'start',
					loop: false,
					containScroll: 'trimSnaps',
				}}
			>
				<CarouselContent>
					{shuffledValidators.map(({ validatorId }) => (
						<CarouselItem key={validatorId.toString()} className="lg:basis-1/2 xl:basis-1/3">
							<ValidatorCard id={validatorId} onSelected={props.onValidator} />
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
			</Carousel>
			<div className="text-center mt-4 text-sm font-medium">
				{getVisibleRange()}/{shuffledValidators.length} validators
			</div>
		</div>
	);
}