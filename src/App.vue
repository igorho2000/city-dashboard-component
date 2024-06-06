<script setup lang="ts">
import { ComponentConfig } from "./utilities/componentConfig";
import DashboardComponent from "./DashboardComponent.vue";
import TestComp from "./assets/backup_all_components.json";

// Can Test: 73, 79, 91, 103, 108, 115, 151
</script>

<template>
	<div class="app">
		<DashboardComponent
			:config="TestComp.data[160]"
			mode="default"
			:favorite-btn="true"
			:info-btn="true"
		/>
		<DashboardComponent
			:config="TestComp.data[115]"
			mode="large"
			:favorite-btn="true"
		/>
		<DashboardComponent
			:config="TestComp.data[59]"
			mode="map"
			:favorite-btn="true"
			@toggle="
				(value, map_config) => {
					console.log(value, map_config);
				}
			"
			@filterByParam="
				(map_filter, map_config, x, y) => {
					console.log(
						'Filter By Param',
						map_filter,
						map_config,
						x,
						y
					);
				}
			"
			@filterByLayer="
				(map_config, x) => {
					console.log('Filter By Layer', map_config, x);
				}
			"
			@clearByParamFilter="
				(map_config) => {
					console.log('Clear By Param Filter', map_config);
				}
			"
			@clearByLayerFilter="
				(map_config) => {
					console.log('Clear By Layer Filter', map_config);
				}
			"
			@fly="
				(location) => {
					console.log('Fly', location);
				}
			"
			:info-btn="true"
		/>
		<DashboardComponent
			:config="TestComp.data[115]"
			mode="halfmap"
			:favorite-btn="true"
			@toggle="
				(value, map_config) => {
					console.log(value, map_config);
				}
			"
			@filterByParam="
				(map_filter, map_config, x, y) => {
					console.log(
						'Filter By Param',
						map_filter,
						map_config,
						x,
						y
					);
				}
			"
			@filterByLayer="
				(map_config, x) => {
					console.log('Filter By Layer', map_config, x);
				}
			"
			@clearByParamFilter="
				(map_config) => {
					console.log('Clear By Param Filter', map_config);
				}
			"
			@clearByLayerFilter="
				(map_config) => {
					console.log('Clear By Layer Filter', map_config);
				}
			"
			@fly="
				(location) => {
					console.log('Fly', location);
				}
			"
			:info-btn="true"
		/>
		<DashboardComponent
			:config="TestComp.data[15]"
			mode="half"
			:favorite-btn="true"
			:info-btn="true"
		/>
		<DashboardComponent
			:config="TestComp.data[82]"
			mode="preview"
			:favorite-btn="true"
			:add-btn="true"
			:info-btn="true"
			info-btn-text="資訊頁面"
		/>
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
