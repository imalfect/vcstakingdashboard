import { useEffect, useState } from 'react';

export default function useCurrentUnixTime(): bigint | null {
	const [nowSeconds, setNowSeconds] = useState<bigint | null>(null);

	useEffect(() => {
		const updateNow = () => setNowSeconds(BigInt(Math.floor(Date.now() / 1000)));
		updateNow();
		const interval = window.setInterval(updateNow, 1000);
		return () => window.clearInterval(interval);
	}, []);

	return nowSeconds;
}
