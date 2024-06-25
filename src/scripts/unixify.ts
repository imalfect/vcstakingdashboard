export function unixify(date: string | Date): number {
	return Math.floor(new Date(date).getTime() / 1000);
}
export function deunixify(date: number): Date {
	return new Date(date * 1000);
}
