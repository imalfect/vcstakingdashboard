'use client';
import PageHeader from '@/components/Misc/PageHeader';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

export default function DelegateFinish(props: { success: boolean }) {
	const router = useRouter();
	const [confetti, setConfetti] = useState(props.success);
	useEffect(() => {
		if (props.success) {
			setTimeout(() => {
				setConfetti(false);
			}, 3000);
		}
	});
	return (
		<div className={'flex flex-col items-center justify-center gap-6'}>
			{confetti && <Confetti />}
			<PageHeader
				title={props.success ? 'Delegation Successful' : 'Failed'}
				subtitle={
					props.success
						? 'Your delegation has been successfully completed. You can now check it on the dashboard.'
						: 'Your delegation has failed. Please try again.'
				}
			/>
			<div className={'flex flex-col gap-3'}>
				<div className={'flex flex-wrap justify-center gap-6'}>
					<Button onClick={() => router.push('/')} className={'px-12'}>
						Home
					</Button>
					<Button onClick={() => router.push('/delegations')} className={'px-12'}>
						Delegation Dashboard
					</Button>
					<Button onClick={() => router.push('/dashboard')} className={'px-12'}>
						Delegate Again
					</Button>
				</div>
			</div>
		</div>
	);
}
