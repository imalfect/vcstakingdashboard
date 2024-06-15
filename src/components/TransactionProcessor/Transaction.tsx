import { LucideCheck, LucideLoader2, LucideX } from 'lucide-react';

export default function TransactionProcessorTransaction(props: {
	name: string;
	status: 'pending' | 'success' | 'error';
	message?: string;
}) {
	return (
		<div className={'flex items-center gap-6'}>
			<div>
				{props.status === 'pending' && <LucideLoader2 className={'animate-spin'} />}
				{props.status === 'success' && <LucideCheck className={'text-green-500'} />}
				{props.status === 'error' && <LucideX className={'text-red-500'} />}
			</div>
			<div className={'flex flex-col gap-1'}>
				<p className={'font-bold'}>{props.name}</p>
				{props.status === 'pending' && <p className={'text-sm'}>{props.message || 'Pending...'}</p>}
				{props.status === 'success' && <p className={'text-sm'}>Success!</p>}
				{props.status === 'error' && (
					<p className={'text-sm'}>{props.message || 'Transaction failed'}</p>
				)}
			</div>
		</div>
	);
}
