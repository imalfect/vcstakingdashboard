import { maxUint256, parseUnits } from 'viem';

export const VC_DECIMALS = 18;

type ParseVcAmountResult =
	| { ok: true; amountWei: bigint }
	| { ok: false; error: 'empty' | 'invalid' | 'precision' | 'overflow' };

const MAX_UINT256_DECIMAL = maxUint256.toString();

export function parseVcAmount(raw: string): ParseVcAmountResult {
	if (raw === '') return { ok: false, error: 'empty' };

	const fixedPointMatch = /^(0|[1-9]\d*)\.(\d+)$/.exec(raw);
	if (fixedPointMatch && fixedPointMatch[2].length > VC_DECIMALS) {
		return { ok: false, error: 'precision' };
	}

	const validMatch = /^(0|[1-9]\d*)(?:\.(\d{1,18}))?$/.exec(raw);
	if (!validMatch) return { ok: false, error: 'invalid' };

	const amountDigits = `${validMatch[1]}${(validMatch[2] ?? '').padEnd(VC_DECIMALS, '0')}`.replace(
		/^0+(?=\d)/,
		''
	);
	if (
		amountDigits.length > MAX_UINT256_DECIMAL.length ||
		(amountDigits.length === MAX_UINT256_DECIMAL.length && amountDigits > MAX_UINT256_DECIMAL)
	) {
		return { ok: false, error: 'overflow' };
	}

	return { ok: true, amountWei: parseUnits(raw, VC_DECIMALS) };
}
