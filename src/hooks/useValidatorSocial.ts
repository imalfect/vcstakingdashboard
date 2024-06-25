import getValidatorSocialInfo from '@/actions/getValidatorSocialInfo';
import ValidatorSocialInfo from '@/types/socialInfo';
import { useEffect, useState } from 'react';

export default function useValidatorSocial(url: string) {
	const [socialData, setSocialData] = useState<ValidatorSocialInfo>();
	useEffect(() => {
		/*const fetchValidatorSocial = async () => {
			const data = await ofetch<ValidatorSocialInfo>(url).catch((e) => {
				return {
					error: e.response?.status === 404 ? 'not-found' : 'cors'
				} as ValidatorSocialInfo;
			});
			setSocialData(data);
		};*/
		const fetchValidatorSocial = async () => {
			const data = await getValidatorSocialInfo(url);
			setSocialData(data);
		};
		fetchValidatorSocial();
	}, [url]);
	return socialData;
}
