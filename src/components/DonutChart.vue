<!-- Developed by Taipei Urban Intelligence Center 2023-2024-->

<script setup lang="ts">
import { computed, defineProps, ref } from "vue";
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

// How many data points to show before summing all remaining points into "other"
const steps = ref(6);

// Donut charts in apexcharts uses a slightly different data format from other chart types
// As such, the following parsing functions are required
const parsedSeries = computed(() => {
	const toParse = [...props.series[0].data];
	if (toParse.length <= steps.value) {
		return toParse.map((item) => item.y);
	}
	let output = [];
	for (let i = 0; i < steps.value; i++) {
		output.push(toParse[i].y);
	}
	const toSum = toParse.splice(steps.value, toParse.length - steps.value);
	let sum = 0;
	toSum.forEach((element) => (sum += element.y));
	output.push(sum);
	return output;
});
const parsedLabels = computed(() => {
	const toParse = [...props.series[0].data];
	if (toParse.length <= steps.value) {
		return toParse.map((item) => item.x);
	}
	let output = [];
	for (let i = 0; i < steps.value; i++) {
		output.push(toParse[i].x);
	}
	output.push("其他");
	return output;
});
const sum = computed(() => {
	return Math.round(parsedSeries.value.reduce((a, b) => a + b) * 100) / 100;
});

// chartOptions needs to be in the bottom since it uses computed data
const chartOptions = ref({
	chart: {
		offsetY: 10,
	},
	colors:
		props.series.length >= steps.value
			? [...props.chart_config.color, "#848c94"]
			: props.chart_config.color,
	dataLabels: {
		formatter: function (
			_val: any,
			{ seriesIndex, w }: { seriesIndex: any; w: any }
		) {
			let value = w.globals.labels[seriesIndex];
			return value.length > 7 ? value.slice(0, 6) + "..." : value;
		},
	},
	labels: parsedLabels,
	legend: {
		show: false,
	},
	plotOptions: {
		pie: {
			dataLabels: {
				offset: 15,
			},
			donut: {
				size: "77.5%",
			},
		},
	},
	stroke: {
		colors: ["#282a2c"],
		show: true,
		width: 3,
	},
	tooltip: {
		followCursor: false,
		custom: function ({
			series,
			seriesIndex,
			w,
		}: {
			series: any;
			seriesIndex: any;
			w: any;
		}) {
			// The class "chart-tooltip" could be edited in /assets/styles/chartStyles.css
			return (
				'<div class="chart-tooltip">' +
				"<h6>" +
				w.globals.labels[seriesIndex] +
				"</h6>" +
				"<span>" +
				series[seriesIndex] +
				` ${props.chart_config.unit}` +
				"</span>" +
				"</div>"
			);
		},
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
		// Supports filtering by xAxis
		if (props.map_filter.mode === "byParam") {
			emits(
				"filterByParam",
				props.map_filter,
				props.map_config,
				config.w.globals.labels[config.dataPointIndex],
				null
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
	<div v-if="activeChart === 'DonutChart'" class="donutchart">
		<VueApexCharts
			width="100%"
			type="donut"
			:options="chartOptions"
			:series="parsedSeries"
			@dataPointSelection="handleDataSelection"
		>
		</VueApexCharts>
		<div class="donutchart-title">
			<h5>總合</h5>
			<h6>{{ sum }}</h6>
		</div>
	</div>
</template>

<style scoped lang="scss">
.donutchart {
	height: 100%;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	overflow-y: visible;

	&-title {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		position: absolute;

		h5 {
			margin: 0;
			color: var(--dashboardcomponent-color-complement-text);
		}

		h6 {
			margin: 0;
			color: var(--dashboardcomponent-color-complement-text);
			font-size: var(--dashboardcomponent-font-m);
			font-weight: 400;
		}
	}
}
</style>
