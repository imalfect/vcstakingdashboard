'use client';
import PageHeader from '@/components/PageHeader';
import ValidatorCard from '@/components/ValidatorCard';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious
} from '@/components/ui/carousel';
import useActiveValidators from '@/hooks/useActiveValidators';
import useCurrentEpoch from '@/hooks/useCurrentEpoch';
import Validator from '@/types/validator';

export default function DelegateValidators(props: { onValidator: (validator: Validator) => void }) {
	const epoch = useCurrentEpoch();
	const activeValidators = useActiveValidators(epoch || BigInt(0));
	return (
		<div className={'flex flex-col items-center justify-center gap-6'}>
			<PageHeader
				title={'Choose a validator'}
				subtitle={"It's time to choose the validator you'd like to support."}
			/>
			<Carousel className={'w-96'}>
				<CarouselContent>
					{activeValidators?.map((validatorId) => (
						<CarouselItem key={validatorId}>
							<ValidatorCard id={validatorId} onSelected={props.onValidator} />
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
			</Carousel>
		</div>
	);
}
