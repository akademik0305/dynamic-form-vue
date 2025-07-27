export interface IForm {
	id: number;
	label: string;
	type: string;
	login: string;
	password: string | null;
}

export interface ITypeOptions {
	label: string;
	value: string;
}
