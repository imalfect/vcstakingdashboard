import Delegate from '@/screens/Delegate';
import { Metadata } from 'next';
export const metadata: Metadata = {
	title: 'VinuChain Staking Station - Delegate',
	description: 'Make a delegation to a Validator on the VinuChain network.'
};

export default function DelegatePage() {
	return <Delegate />;
}
