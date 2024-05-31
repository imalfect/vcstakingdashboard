import { clsx } from 'clsx';

export default function PageHeader(props: { title: string; subtitle: string; hidden?: boolean }) {
	return (
		<div className={clsx('flex flex-col items-center break-words', props.hidden && 'hidden')}>
			<h1 className={'text-2xl font-bold md:text-4xl'}>{props.title}</h1>
			<h2 className={'text-sm md:text-xl'}>{props.subtitle}</h2>
		</div>
	);
}
