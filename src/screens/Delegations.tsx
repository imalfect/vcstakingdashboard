'use client';
import DelegationCard from '@/components/Cards/DelegationCard';
import { UpdateContext } from '@/components/Contexts/UpdateContext';
import PageHeader from '@/components/Misc/PageHeader';
import WalletNotConnected from '@/components/Misc/WalletNotConnected';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious
} from '@/components/ui/carousel';
import useAddressDelegations from '@/hooks/useAddressDelegations';
import Link from 'next/link';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export default function Delegations() {
	const account = useAccount();
	const [address, setAddress] = useState(account.address);
	const delegs = useAddressDelegations(address || '0x0');
	const update = () => {
		setAddress('0x0');
		setTimeout(() => {
			setAddress(account.address);
		}, 1000);
	};
	return (
		<div className={'flex min-h-screen flex-col items-center justify-center'}>
			{account.isConnected ? (
				<UpdateContext.Provider value={update}>
					<PageHeader title={'Delegations'} subtitle={'View your delegations'} />
					<p className={'text-center'}>
						Delegation disappeared after starting the undelegation process?{' '}
						<Link href={'/withdraw-requests'} className={'underline'}>
							Find it here
						</Link>
					</p>
					{delegs.length > 0 ? (
						<Carousel className={'mt-6 max-w-[22rem] lg:max-w-[45rem] xl:max-w-[68rem]'}>
							<CarouselContent>
								{delegs.map((delegation) => (
									<CarouselItem key={delegation.validatorId} className={'basis-auto'}>
										<DelegationCard delegation={delegation} />
									</CarouselItem>
								))}
							</CarouselContent>
							<CarouselPrevious className={'hidden lg:flex'} />
							<CarouselNext className={'hidden lg:flex'} />
						</Carousel>
					) : (
						<p>No delegations found.</p>
					)}
				</UpdateContext.Provider>
			) : (
				<WalletNotConnected />
			)}
		</div>
	);
}
