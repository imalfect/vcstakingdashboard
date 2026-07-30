import Navigation from '@/components/Core/Navigation';
import { TooltipProvider } from '@/components/ui/tooltip';
import { config } from '@/config';
import { ThemeProvider } from '@/providers/ThemeProvider';
import '@rainbow-me/rainbowkit/styles.css';
import { clsx } from 'clsx';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import React from 'react';
import { cookieToInitialState } from 'wagmi';
import RainbowKitProvider from '../providers/RainbowKitProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
export const runtime = 'nodejs';

export const metadata: Metadata = {
	title: 'VinuChain Staking Station',
	description:
		'VinuChain Staking Station allows you to delegate your tokens to validators and earn rewards with ease.'
};
export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	const requestHeaders = await headers();
	const initialState = cookieToInitialState(config, requestHeaders.get('cookie'));
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={clsx(inter.className)}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<RainbowKitProvider initialState={initialState}>
						<TooltipProvider>
							<div className={'absolute bottom-0 left-0 right-0 flex w-full justify-center pb-4'}>
								<Navigation />
							</div>
							{children}
						</TooltipProvider>
					</RainbowKitProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
