export interface IAccount {
	id: number;
	type: string;
	label: { title: string }[];
	login: string;
	password: string | null;
}
