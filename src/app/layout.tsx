import Navigation from '@/components/Navigation';
import { config } from '@/config';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { clsx } from 'clsx';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import React from 'react';
import { cookieToInitialState } from 'wagmi';
import Web3ModalProvider from '../providers/WebThreeModalProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'VinuChain Staking Dasboard',
	description:
		'VinuChain Staking Dashboard allows you to delegate your tokens to validators and earn rewards with ease.'
};
export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	const initialState = cookieToInitialState(config, headers().get('cookie'));
	return (
		<html lang="en">
			<body className={clsx(inter.className)}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<Web3ModalProvider initialState={initialState}>
						<div className={'absolute bottom-0 left-0 right-0 flex w-full justify-center pb-4'}>
							<Navigation />
						</div>
						{children}
					</Web3ModalProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
