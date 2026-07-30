'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export function DatePicker(props: {
	onDate: (date: Date) => void;
	toDate: Date;
	fromDate: Date;

	placeholder?: string;
}) {
	const [date, setDate] = React.useState<Date>();
	return (
		<Popover modal={true}>
			<PopoverTrigger asChild>
				<Button
					variant={'outline'}
					className={cn(
						'w-[280px] justify-start text-left font-normal',
						!date && 'text-muted-foreground'
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{date ? format(date, 'PPP') : <span>{props.placeholder || 'Pick a date'}</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<Calendar
					mode="single"
					required
					initialFocus
					selected={date}
					onSelect={(selectedDate) => {
						setDate(selectedDate);
						if (selectedDate) props.onDate(selectedDate);
					}}
					fromDate={props.fromDate}
					toDate={props.toDate}
				/>
			</PopoverContent>
		</Popover>
	);
}
