<!-- Developed by Taipei Urban Intelligence Center 2023-2024-->

<script setup lang="ts">
import { ref, computed } from "vue";
import { MapConfig, MapFilter } from "../utilities/ComponentConfig";
import VueApexCharts from "vue3-apexcharts";

const props = defineProps([
	"chart_config",
	"activeChart",
	"series",
	"map_config",
	"map_filter",
	"map_filter_on",
]);

const emits = defineEmits<{
	(
		e: "filterByParam",
		map_filter: MapFilter,
		map_config: MapConfig[],
		x: string | null,
		y: string | null
	): void;
	(e: "filterByLayer", map_config: MapConfig[], x: string): void;
	(e: "clearByParamFilter", map_config: MapConfig[]): void;
	(e: "clearByLayerFilter", map_config: MapConfig[]): void;
	(e: "fly", location: any): void;
}>();

const parseSeries = computed(() => {
	const newSeries = [];

	for (let i = 0; i < props.series[0].data.length; i++) {
		let maxPos = 0;
		let max = 0;

		for (let j = 0; j < props.series.length; j++) {
			if (props.series[j].data[i] > max) {
				max = props.series[j].data[i];
				maxPos = j;
			}
		}

		for (let j = 0; j < props.series.length; j++) {
			if (i === 0) {
				newSeries.push({
					name: props.series[j].name,
					data: [j === maxPos ? 1 : 0],
				});
			} else {
				newSeries[j].data.push(j === maxPos ? 1 : 0);
			}
		}
	}

	return newSeries;
});

const chartOptions = ref({
	chart: {
		stacked: true,
		toolbar: {
			show: false,
		},
	},
	colors: [...props.chart_config.color],
	dataLabels: {
		enabled: false,
	},
	grid: {
		show: false,
	},
	legend: {
		show: true,
		offsetY: 10,
	},
	stroke: {
		colors: ["#282a2c"],
		show: true,
		width: 2,
	},
	tooltip: {
		// The class "chart-tooltip" could be edited in /assets/styles/chartStyles.css
		custom: function ({
			seriesIndex,
			dataPointIndex,
			w,
		}: {
			seriesIndex: any;
			dataPointIndex: any;
			w: any;
		}) {
			return (
				'<div class="chart-tooltip">' +
				"<h6>" +
				w.globals.labels[dataPointIndex] +
				`${"-" + w.globals.seriesNames[seriesIndex]}` +
				"</h6>" +
				"<span>" +
				props.series[seriesIndex].data[dataPointIndex] +
				` ${props.chart_config.unit}` +
				"</span>" +
				"</div>"
			);
		},
	},
	xaxis: {
		axisBorder: {
			show: false,
		},
		axisTicks: {
			show: false,
		},
		categories: props.chart_config.categories,
		labels: {
			offsetY: 2,
		},
		type: "category",
	},
	yaxis: {
		show: false,
		max: 1,
	},
});

const selectedIndex = ref<null | string>(null);

function handleDataSelection(_e: any, _chartContext: any, config: any) {
	if (!props.map_filter || !props.map_filter_on) {
		return;
	}
	if (
		`${config.dataPointIndex}-${config.seriesIndex}` !== selectedIndex.value
	) {
		// Supports filtering by xAxis + yAxis
		if (props.map_filter.mode === "byParam") {
			emits(
				"filterByParam",
				props.map_filter,
				props.map_config,
				config.w.globals.labels[config.dataPointIndex],
				config.w.globals.seriesNames[config.seriesIndex]
			);
		}
		// Supports filtering by xAxis
		else if (props.map_filter.mode === "byLayer") {
			emits(
				"filterByLayer",
				props.map_config,
				config.w.globals.labels[config.dataPointIndex]
			);
		}
		selectedIndex.value = `${config.dataPointIndex}-${config.seriesIndex}`;
	} else {
		if (props.map_filter.mode === "byParam") {
			emits("clearByParamFilter", props.map_config);
		} else if (props.map_filter.mode === "byLayer") {
			emits("clearByLayerFilter", props.map_config);
		}
		selectedIndex.value = null;
	}
}
</script>

<template>
	<div v-if="activeChart === 'IndicatorChart'">
		<VueApexCharts
			width="100%"
			height="260px"
			type="bar"
			:options="chartOptions"
			:series="parseSeries"
			@dataPointSelection="handleDataSelection"
		></VueApexCharts>
	</div>
</template>
