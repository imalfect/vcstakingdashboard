export default interface ValidatorSocialInfo {
	name: string;
	logoUrl: string;
	website: string;
	contact: string;
	error: 'cors' | 'not-found';
}
