import { Button, ButtonProps } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import React from 'react';
export function TooltipButton({
	children,
	message,
	...props
}: {
	children: React.ReactNode;
	message: string;
} & ButtonProps) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button {...props}>{children}</Button>
			</TooltipTrigger>
			<TooltipContent>{message}</TooltipContent>
		</Tooltip>
	);
}
