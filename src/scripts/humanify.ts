import BigNumber from 'bignumber.js';
BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_DOWN });

const nf = new Intl.NumberFormat('en-US');
export default function humanify(value: bigint, decimalPlaces?: number): string {
	return nf.format(
		parseFloat(new BigNumber(value.toString()).shiftedBy(-18).toFixed(decimalPlaces || 1))
	);
}
