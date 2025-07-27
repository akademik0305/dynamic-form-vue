<script setup lang="ts">
//===============================-< imports >-===============================
//> navie-ui
import { NMessageProvider } from "naive-ui";
//> components
import TheForm from "./components/TheForm.vue";
</script>

<template>
	<main class="py-10">
    <n-message-provider>
      <TheForm />
    </n-message-provider>
	</main>
</template>
