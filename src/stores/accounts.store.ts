import { ref } from "vue";
import { defineStore } from "pinia";
import type { IAccount } from "../types/account.types";
import type { IForm } from "../types/form.types";

export const useAccountsStore = defineStore("accounts", () => {
	const accounts = ref<IAccount[]>([]);

	function addToAccounts(formValue: IForm) {
		const accountIndex = accounts.value.findIndex(
			(account) => account.id === formValue.id
		);
		if (accountIndex >= 0) {
			accounts.value[accountIndex] = {
				id: formValue.id,
				type: formValue.type,
				login: formValue.login,
				password: formValue.password ? formValue.password : null,
				label: [],
			};

			if (formValue.label) {
				formValue.label.split(";").forEach((key) => {
					accounts.value[accountIndex].label?.push({
						title: key.replace(" ", ""),
					});
				});
			}
		} else {
			const newAccount: IAccount = {
				id: formValue.id,
				type: formValue.type,
				login: formValue.login,
				password: formValue.password ? formValue.password : null,
				label: [],
			};
			if (formValue.label) {
				formValue.label.split(";").forEach((key) => {
					newAccount.label?.push({ title: key.replace(" ", "") });
				});
			}
			accounts.value.push(newAccount);
		}
	}

	function saveAccounts() {
		localStorage.setItem("accounts", JSON.stringify(accounts.value));
	}

	function removeAccount(id: number) {
		const accountIndex = accounts.value.findIndex(
			(account) => account.id === id
		);

		if (accountIndex >= 0) {
			accounts.value.splice(accountIndex, 1);
		}
	}

	function loadAccounts() {
		accounts.value = JSON.parse(localStorage.getItem("accounts") || "[]");
	}

	return { accounts, addToAccounts, removeAccount, saveAccounts, loadAccounts };
});
