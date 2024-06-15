const nf = new Intl.NumberFormat('en-US');
export default function humanify(value: bigint): string {
	return nf.format(value / BigInt(10 ** 18));
}
