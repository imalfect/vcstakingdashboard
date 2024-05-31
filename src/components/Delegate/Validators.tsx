'use client';
import PageHeader from '@/components/PageHeader';
import ValidatorCard from '@/components/ValidatorCard';

export default function DelegateValidators(props: { onContinue: () => void }) {
	return (
		<div className={'flex flex-col items-center justify-center gap-6'}>
			<PageHeader
				title={'Choose a validator'}
				subtitle={"It's time to choose the validator you'd like to support."}
			/>
			<div className={'grid grid-cols-3 gap-6'}>
				<ValidatorCard />
				<ValidatorCard />
				<ValidatorCard />
			</div>
		</div>
	);
}
