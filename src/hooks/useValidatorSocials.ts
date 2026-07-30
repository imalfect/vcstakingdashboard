import getValidatorSocialInfo from '@/actions/getValidatorSocialInfo';
import type {
	ValidatorSocialError,
	ValidatorSocialInfo,
	ValidatorSocialResult
} from '@/types/socialInfo';
import { useQuery } from '@tanstack/react-query';

export type ValidatorSocialFailure = {
	url: string;
	error: ValidatorSocialError;
};

export type ValidatorSocialsState = {
	data: ReadonlyMap<string, ValidatorSocialInfo>;
	failures: readonly ValidatorSocialFailure[];
	isLoading: boolean;
	isFetching: boolean;
	refetch(): Promise<void>;
};

const SUCCESS_STALE_TIME_MS = 5 * 60 * 1_000;
const SOCIAL_GC_TIME_MS = 30 * 60 * 1_000;

export default function useValidatorSocials(urls: readonly string[]): ValidatorSocialsState {
	const sortedUniqueUrls = [...new Set(urls)].sort();
	const socials = useQuery({
		queryKey: ['validator-socials', sortedUniqueUrls],
		queryFn: async (): Promise<readonly ValidatorSocialResult[]> => {
			const result = await getValidatorSocialInfo(sortedUniqueUrls);
			if (!result.ok) throw new Error('Unable to request validator profiles.');
			return result.data;
		},
		enabled: sortedUniqueUrls.length > 0,
		staleTime: (query) =>
			query.state.data?.every((result) => result.ok) ? SUCCESS_STALE_TIME_MS : 0,
		gcTime: SOCIAL_GC_TIME_MS,
		retry: false,
		refetchOnWindowFocus: false
	});
	const data = new Map<string, ValidatorSocialInfo>();
	const failures: ValidatorSocialFailure[] = [];
	if (socials.data) {
		socials.data.forEach((result, index) => {
			const url = sortedUniqueUrls[index];
			if (result.ok) data.set(url, result.data);
			else failures.push({ url, error: result.error });
		});
	}
	if (socials.error && failures.length === 0) {
		for (const url of sortedUniqueUrls) failures.push({ url, error: 'unavailable' });
	}
	return {
		data,
		failures,
		isLoading: sortedUniqueUrls.length > 0 && socials.isLoading,
		isFetching: socials.isFetching,
		refetch: async () => {
			await socials.refetch();
		}
	};
}
