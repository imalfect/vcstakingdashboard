export default interface ValidatorSocialInfo {
	name: string;
	logo: string;
	website: string;
	contact: string;
	error: 'cors' | 'not-found';
}
