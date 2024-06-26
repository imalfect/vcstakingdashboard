'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { LucideTriangleAlert } from 'lucide-react';
import { useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';

export default function DelegateWarning(props: { onAccepted: () => void }) {
	const [checked, setChecked] = useState([false, false, false]);
	const [didAcknowledgeWarning, setdidAcknowledgeWarning] = useLocalStorage(
		'delegate-warning-acknowledged',
		false
	);
	return (
		<div className={'flex flex-col items-center justify-center gap-6'}>
			<h2 className={'flex items-center gap-3 text-2xl font-bold md:text-4xl'}>
				<LucideTriangleAlert className={'text-yellow-500'} size={32} /> Before we get started
			</h2>

			<div className={'flex max-w-[45rem] flex-col gap-6'}>
				<div className="flex items-center space-x-2">
					<Checkbox
						id="rule1"
						checked={checked[0]}
						onCheckedChange={(checkedState) => {
							setChecked([checkedState as boolean, checked[1], checked[2]]);
						}}
					/>
					<label
						htmlFor="rule1"
						className="text-base peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						You will not earn rewards if the validator you are delegating to goes offline or get slashed.
					</label>
				</div>
				<div className="flex items-center space-x-2">
					<Checkbox
						id="rule2"
						checked={checked[1]}
						onCheckedChange={(checkedState) => {
							setChecked([checked[0], checkedState as boolean, checked[2]]);
						}}
					/>
					<label
						htmlFor="rule2"
						className="space-x-5 text-base peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						While locked delegations are more profitable, you will not be able to withdraw your coins
						before the lock period ends without paying a penalty.
					</label>
				</div>
				<div className="flex items-center space-x-2">
					<Checkbox
						id="rule3"
						checked={checked[2]}
						onCheckedChange={(checkedState) => {
							setChecked([checked[0], checked[1], checkedState as boolean]);
						}}
					/>
					<label
						htmlFor="rule3"
						className="text-base peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						This software is in beta. Use at your own risk.
					</label>
				</div>
			</div>
			<Button
				size={'lg'}
				disabled={!(checked[0] && checked[1] && checked[2])}
				onClick={() => {
					setdidAcknowledgeWarning(true);
					props.onAccepted();
				}}
			>
				I understand, let&apos;s get started
			</Button>
		</div>
	);
}
