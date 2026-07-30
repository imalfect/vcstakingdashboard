import { useStakingSession } from '@/components/Contexts/StakingSession';
import { useTransactionBatch } from '@/components/TransactionProcessor/context';
import { Button } from '@/components/ui/button';
import sfc from '@/config/contracts/sfc';
import undelegate from '@/generators/write/undelegate';
import unlockStake from '@/generators/write/unlockStake';
import humanify from '@/scripts/humanify';
import { Delegation } from '@/types/delegation';
import { clsx } from 'clsx';
import dayjs from 'dayjs';
import { LucideLockKeyhole, LucideLockOpen } from 'lucide-react';

export default function UndelegateContent(props: { delegation: Delegation; mobile?: boolean }) {
	const transactionBatch = useTransactionBatch();
	const state = useStakingSession();
	const session = state.status === 'supported' ? state.session : undefined;
	const sfcAddress = session?.chain.contracts.sfc.address;
	return (
		<>
			<div
				className={clsx(
					'flex w-full px-3',
					props.mobile ? 'justify-center gap-12' : 'justify-between gap-6'
				)}
			>
				<div className={'flex flex-col text-center'}>
					<p className={'flex items-center gap-3 text-2xl font-bold'}>
						<LucideLockKeyhole
							onDoubleClick={() => {
								if (session && sfcAddress && props.delegation.lockedAmount !== 0n) {
									transactionBatch.start([
										unlockStake(sfc, sfcAddress, props.delegation.validatorId, props.delegation.lockedAmount)
									]);
								}
							}}
						/>
						{humanify(props.delegation.lockedAmount)} VC
					</p>
					<span className={'text-sm text-muted-foreground'}>
						{props.delegation.lockedDelegation && props.delegation.lockedAmount !== 0n
							? dayjs.unix(Number(props.delegation.lockedDelegation.endTime)).diff(dayjs(), 'days') +
								' days'
							: 'No locked delegation'}
					</span>
				</div>
				<div className={'flex flex-col text-center'}>
					<p className={'flex items-center gap-3 text-2xl font-bold'}>
						<LucideLockOpen />
						{humanify(props.delegation.unlockedAmount)} VC
					</p>
					<span className={'text-sm text-muted-foreground'}>Unlocked</span>
				</div>
			</div>
			<p className={'mt-2 text-center text-sm'}>
				{props.delegation.lockedDelegation && props.delegation.lockedAmount !== 0n
					? dayjs.unix(Number(props.delegation.lockedDelegation.endTime)).diff(dayjs(), 'seconds') <= 0
						? 'You can undelegate your delegation now.'
						: 'You can only undelegate your unlocked delegation, as the locked delegation did not expire yet.'
					: 'No locked delegation. You can withdraw everything.'}
			</p>
			<div className={'mt-3 grid grid-flow-col gap-6 pb-6'}>
				<div className={'flex flex-col gap-1'}>
					<p className={'text-lg font-bold'}>Step 1</p>
					<p>Unlock your expired locked delegation.</p>
					<Button
						disabled={
							!sfcAddress ||
							!(
								dayjs.unix(Number(props.delegation.lockedDelegation?.endTime)).diff(dayjs(), 'seconds') <=
									0 && props.delegation.lockedAmount !== 0n
							)
						}
						onClick={() => {
							if (!session || !sfcAddress) return;
							transactionBatch.start([
								unlockStake(sfc, sfcAddress, props.delegation.validatorId, props.delegation.lockedAmount)
							]);
						}}
					>
						Unlock
					</Button>
				</div>
				<div className={'flex flex-col gap-1'}>
					<p className={'text-lg font-bold'}>Step 2</p>
					<p>Start the undelegation process</p>
					<Button
						disabled={!sfcAddress || props.delegation.unlockedAmount === 0n}
						onClick={() => {
							if (!session || !sfcAddress) return;
							transactionBatch.start([
								undelegate(sfc, sfcAddress, props.delegation.validatorId, props.delegation.unlockedAmount)
							]);
						}}
					>
						Undelegate
					</Button>
				</div>
				<div className={'flex flex-col gap-1'}>
					<p className={'text-lg font-bold'}>Step 3</p>
					<p>After 24 hours, withdraw your funds using the undelegations tab.</p>
				</div>
			</div>
		</>
	);
}
