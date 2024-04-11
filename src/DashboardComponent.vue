<script setup lang="ts">
import TestingComp from './components/TestingComp.vue';
defineProps<{ msg: string }>()
</script>

<template>
	<div>
		<h1 class="read-the-docs">{{ msg }}</h1>
		<TestingComp />
	</div>
</template>

<style scoped>
.read-the-docs {
	color: #888;
}
</style>
