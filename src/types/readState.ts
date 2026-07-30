export type ReadState<T, F = never> = {
	data: T;
	isLoading: boolean;
	isFetching: boolean;
	error: Error | null;
	failures: readonly F[];
	refetch(): Promise<void>;
};
