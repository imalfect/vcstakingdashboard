import PaybackAbi from '@/config/contracts/payback';
import { VinuChain } from '@/types/vinuChain';
import { Address, Chain } from 'viem';
import { useClient, useReadContract } from 'wagmi';

export default function useAddressPayback(address: Address) {
	const client = useClient();
	const typedChain = client?.chain as (Chain & VinuChain) | undefined;
	const addressPayback = useReadContract({
		abi: PaybackAbi,
		address: typedChain?.contracts.payback.address,
		args: [address],
		functionName: 'getStake'
	});
	return (addressPayback.data as bigint) || 0n;
}
