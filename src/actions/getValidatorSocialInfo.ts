'use server';
// Server actions because 99% of validators don't feel like enabling cors 💀

import ValidatorSocialInfo from '@/types/socialInfo';
import { ofetch } from 'ofetch';

export default async function getValidatorSocialInfo(url: string) {
	const data = await ofetch<ValidatorSocialInfo>(url, {
		parseResponse: JSON.parse
	}).catch((e) => {
		return {
			error: e.response?.status === 404 ? 'not-found' : 'cors'
		} as ValidatorSocialInfo;
	});
	console.log('Fetched social info for', url, data?.name || 'Unknown Validator');
	console.log(data);
	return data;
}
