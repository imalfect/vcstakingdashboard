import WithdrawRequests from '@/screens/WithdrawRequests';
import { Metadata } from 'next';
export const metadata: Metadata = {
	title: 'VinuChain Staking Station - Withdraw Requests',
	description: 'View your pending withdrawal requests.'
};

export default function WithdrawRequestsPage() {
	return <WithdrawRequests />;
}
