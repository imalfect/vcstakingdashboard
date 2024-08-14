import { useGasPrice } from 'wagmi';

export default function useApproximateTransactionsFromPayback(
	payback: bigint,
	gasPerTransaction: bigint
): number {
	const gasPrice = useGasPrice();
	if (!gasPrice.data || gasPrice.data === 0n) return 0;
	const singleTransactionCost = gasPerTransaction * gasPrice.data;
	return Number(payback / singleTransactionCost);
}
