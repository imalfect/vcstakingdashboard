import PageHeader from '@/components/Misc/PageHeader';
import { useTransactionBatch } from '@/components/TransactionProcessor/context';
import { Button } from '@/components/ui/button';
import payback from '@/config/contracts/payback';
import stakeForPayback from '@/generators/write/stakeForPayback';
import unstakePayback from '@/generators/write/unstakePayback';
import withdrawPayback from '@/generators/write/withdrawPayback';
import useAddressPaybackWithdrawRequests from '@/hooks/useAddressPaybackWithdrawRequests';
import useCurrentUnixTime from '@/hooks/useCurrentUnixTime';
import humanify from '@/scripts/humanify';
import { Address } from 'viem';

export default function PaybackMigration(props: {
	address: Address;
	legacyPaybackAddress: Address;
	paybackAddress: Address;
	legacyStake: bigint;
}) {
	const transactionBatch = useTransactionBatch();
	const nowSeconds = useCurrentUnixTime();
	const requests = useAddressPaybackWithdrawRequests(
		props.address,
		props.legacyPaybackAddress,
		false
	);
	const readyRequests =
		nowSeconds === null
			? []
			: requests.data.filter((request) => request.unlockTime <= nowSeconds);
	// The transaction processor persists at most 32 rows: 31 withdrawals plus one V2 stake.
	const migratableRequests = readyRequests.slice(0, 31);
	const pendingRequests =
		nowSeconds === null
			? []
			: requests.data.filter((request) => request.unlockTime > nowSeconds);
	const readyTotal = migratableRequests.reduce((total, request) => total + request.amount, 0n);

	return (
		<div className={'flex max-w-2xl flex-col items-center gap-5 text-center'}>
			<PageHeader
				title={'Migrate Payback V1 to V2'}
				subtitle={'A guided recovery flow that preserves the legacy withdrawal delay.'}
			/>

			<div className={'w-full rounded-md border p-4'}>
				<h3 className={'text-lg font-semibold'}>1. Start legacy withdrawal</h3>
				<p className={'mt-1 text-sm text-gray-700 dark:text-gray-300'}>
					{humanify(props.legacyStake)} VC remains staked in V1.
				</p>
				<Button
					className={'mt-3'}
					disabled={props.legacyStake === 0n}
					onClick={() =>
						transactionBatch.start([
							unstakePayback(
								payback,
								props.legacyPaybackAddress,
								props.legacyStake,
								undefined,
								'paybackLegacy'
							)
						])
					}
				>
					{props.legacyStake === 0n ? 'Legacy stake unstaked' : 'Unstake all from V1'}
				</Button>
			</div>

			<div className={'w-full rounded-md border p-4'}>
				<h3 className={'text-lg font-semibold'}>2. Withdraw and restake in V2</h3>
				{requests.error ? (
					<div className={'mt-2'}>
						<p className={'text-red-500'}>Unable to load legacy withdrawal requests.</p>
						<Button className={'mt-2'} size="sm" variant="outline" onClick={() => void requests.refetch()}>
							Retry
						</Button>
					</div>
				) : requests.isLoading || nowSeconds === null ? (
					<p className={'mt-2'}>Loading legacy withdrawal requests…</p>
				) : (
					<>
						<p className={'mt-1 text-sm text-gray-700 dark:text-gray-300'}>
							{humanify(readyTotal)} VC is ready in this batch. {pendingRequests.length} request
							{pendingRequests.length === 1 ? '' : 's'} still waiting.
							{readyRequests.length > migratableRequests.length &&
								` ${readyRequests.length - migratableRequests.length} additional ready requests can be migrated in the next batch.`}
						</p>
						<Button
							className={'mt-3'}
							disabled={migratableRequests.length === 0}
							onClick={() =>
								transactionBatch.start([
									...migratableRequests.map((request) =>
										withdrawPayback(
											payback,
											props.legacyPaybackAddress,
											request.id,
											'paybackLegacy'
										)
									),
									stakeForPayback(payback, props.paybackAddress, readyTotal)
								])
							}
						>
							{migratableRequests.length === 0
								? 'Waiting for unlock'
								: 'Complete ready migration'}
						</Button>
					</>
				)}
			</div>

			<p className={'text-sm text-gray-700 dark:text-gray-300'}>
				Each on-chain action still requires wallet approval. If multiple withdrawals are ready, they are
				processed first and their exact total is then staked into V2.
			</p>
		</div>
	);
}
