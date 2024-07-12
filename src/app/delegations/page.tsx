import Delegations from '@/screens/Delegations';
import { Metadata } from 'next';
export const metadata: Metadata = {
	title: 'VinuChain Staking Station - Delegations',
	description: 'Check your delegations, rewards, and other information here.'
};

export default function DelegationsPage() {
	return <Delegations />;
}
