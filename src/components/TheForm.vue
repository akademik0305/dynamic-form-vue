<script setup lang="ts">
//===============================-< imports >-===============================
//> icons
import { Add12Filled } from "@vicons/fluent";
//> navi-ui
import {
	NButton,
	NIcon,
	NInput,
	NForm,
	NFormItem,
	NSelect,
	type FormInst,
	type SelectOption,
} from "naive-ui";
// vue
import { ref, reactive, onMounted } from "vue";
import type { IForm } from "../types/form.types";
// store
import { useAccountsStore } from "../stores/accounts.store";
const accountsStore = useAccountsStore();

//===============================-< create form items >-===============================
//> variables
const typeOptions: SelectOption[] = [
	{
		label: "LDAP",
		value: "ldap",
	},
	{
		label: "Локальная",
		value: "local",
	},
];

const formModel = reactive<IForm[]>([]);

//>
const removeRow = (index: number, form_id: number) => {
	formModel.splice(index, 1);
	accountsStore.removeAccount(form_id);
	accountsStore.saveAccounts();
};

const addNewRow = () => {
	formModel.push({
		id: Date.now(),
		label: "",
		type: (typeOptions[0].value ?? "").toString(),
		login: "",
		password: "",
	});
};

//===============================-< submit form >-===============================
//> variables
const formRefs = ref<FormInst[]>([]);

// rules
const rules = {
	label: {
		required: false,
	},
	type: {
		required: true,
		trigger: ["blur"],
		message: "Please choose account type",
	},
	login: {
		required: true,
		trigger: ["blur", "input"],
		message: "Please input login",
	},
	password: {
		required: true,
		trigger: ["blur", "input"],
		message: "Please input password",
	},
};
//> functions
async function submitForm(formValues: IForm) {
	accountsStore.addToAccounts(formValues);
	accountsStore.saveAccounts();
}

//===============================-< validate form >-===============================
//> variables
//> functions
function validateForm(index: number) {
	formRefs.value[index].validate((errors) => {
		if (!errors) {
			console.log("success");
			submitForm(formModel[index]);
		} else {
			console.log(errors);
		}
	});
}

//===============================-< get form data from accounts >-===============================
//> variables
//> functions
function getFormFromAccounts() {
	if (accountsStore.accounts.length) {
		accountsStore.accounts.forEach((account) => {
			formModel.push({
				id: account.id,
				label: account.label?.map((l) => l.title).join(", ") || "",
				type: account.type,
				login: account.login,
				password: account.password,
			});
		});
	} else {
		formModel.push({
			id: Date.now(),
			label: "",
			type: (typeOptions[0].value ?? "").toString(),
			login: "",
			password: "",
		});
	}
}

//===============================-< on mounted >-===============================
//> variables
//> functions
onMounted(() => {
	accountsStore.loadAccounts();
	getFormFromAccounts();
});
</script>
<template>
	<section class="form">
		<div class="container max-w-5xl mx-auto">
			<div class="flex items-center gap-4">
				<h2 class="text-2xl font-bold">Учетные записи</h2>
				<n-button class="form__add" @click="addNewRow">
					<n-icon>
						<add12-filled />
					</n-icon>
				</n-button>
			</div>

			<!-- form -->
			<div class="mt-4">
				<n-form
					ref="formRefs"
					:model="formModel"
					v-for="(form, index) in formModel"
					:key="form.id"
					class="mt-2 grid grid-cols-9 gap-2"
				>
					<n-form-item
						label="Метка"
						:path="`${index}.label`"
						class="col-span-2"
					>
						<n-input
							v-model:value="form.label"
							:maxlength="50"
							placeholder="Введите метка"
							clearable
							@blur="validateForm(index)"
						/>
					</n-form-item>

					<n-form-item
						label="Тип записи"
						:path="`${index}.type`"
						:rule="rules.type"
						class="col-span-2"
					>
						<n-select
							v-model:value="form.type"
							placeholder="Выберите тип записи"
							:options="typeOptions"
							@update:value="validateForm(index)"
						/>
					</n-form-item>

					<n-form-item
						label="Логин"
						:path="`${index}.login`"
						:rule="rules.login"
						:class="[form.type !== 'ldap' ? 'col-span-2' : 'col-span-4']"
					>
						<n-input
							v-model:value="form.login"
							:maxlength="100"
							clearable
							@blur="validateForm(index)"
						/>
					</n-form-item>

					<n-form-item
						v-if="form.type !== 'ldap'"
						label="Пароль"
						:path="`${index}.password`"
						:rule="form.type === 'ldap' ? { required: false } : rules.password"
						class="col-span-2"
					>
						<n-input
							v-model:value="form.password"
							type="password"
							show-password-on="click"
							placeholder="Input Name"
							:maxlength="100"
							:disabled="form.type === 'ldap'"
							@blur="validateForm(index)"
						/>
					</n-form-item>
					<n-form-item>
						<n-button @click="removeRow(index, form.id)" type="error" ghost>
							Remove
						</n-button>
					</n-form-item>
				</n-form>
			</div>
		</div>
	</section>
</template>
<style>
.form__add {
	padding: 0;
	width: 34px;
	height: 34px;
}
</style>
