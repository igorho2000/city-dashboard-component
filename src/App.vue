<script setup lang="ts">
import { ComponentConfig } from './utilities/componentConfig';
import DashboardComponent from './DashboardComponent.vue';
import TestComp from "./assets/backup_all_components.json";
</script>

<template>
	<div class="app">
		<DashboardComponent :config="TestComp.data[103]" mode="default" :favorite-btn="true"
			@toggle="(value, map_config) => { console.log(value, map_config) }" />
		<DashboardComponent :config="TestComp.data[103]" mode="large" :favorite-btn="true"
			@toggle="(value, map_config) => { console.log(value, map_config) }" />
		<DashboardComponent :config="TestComp.data[103]" mode="map" :favorite-btn="true"
			@toggle="(value, map_config) => { console.log(value, map_config) }" />
		<DashboardComponent :config="TestComp.data[103]" mode="halfmap" :favorite-btn="true"
			@toggle="(value, map_config) => { console.log(value, map_config) }" />
		<DashboardComponent :config="TestComp.data[103]" mode="half" :favorite-btn="true"
			@toggle="(value, map_config) => { console.log(value, map_config) }" />
		<DashboardComponent :config="TestComp.data[103]" mode="preview" :favorite-btn="true"
			@toggle="(value, map_config) => { console.log(value, map_config) }" />
	</div>
</template>

<style lang="scss">
.app {
	width: 100vw;
	height: 100vh;
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	grid-template-rows: 1fr 1fr;
	justify-content: center;
	align-items: center;
}

body {
	margin: 0;
	padding: 0;
}
</style>