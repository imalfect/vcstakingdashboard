import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function DelegateAmount(props: { onAmount: () => void }) {
	return (
		<div className={'flex flex-col items-center justify-center gap-6'}>
			<PageHeader
				title={'Select the amount'}
				subtitle={"Using the box below, enter the amount of coins you'd like to delegate."}
			/>
			<div className={'flex flex-col items-center gap-1'}>
				<div className="flex w-full max-w-sm items-center space-x-2">
					<Input type="number" placeholder="10 VC" />
					<Button>Available Balance</Button>
				</div>
				<span className={'text-gray-700 dark:text-gray-300'}>100,000 VC Available</span>
			</div>

			<Button onClick={props.onAmount} className={'px-12'}>
				Continue
			</Button>
		</div>
	);
}
