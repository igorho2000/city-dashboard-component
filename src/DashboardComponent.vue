<script setup lang="ts">
import { computed, defineProps, PropType, defineEmits, ref } from "vue";
import "./styles/chartStyles.css";
import "./styles/toggleswitch.css";
import 'material-icons/iconfont/material-icons.css';
import { getComponentDataTimeframe } from "./utilities/dataTimeframe";
import { timeTerms } from "./utilities/AllTimes";
import { ComponentConfig, MapConfig } from "./utilities/ComponentConfig";

import ComponentTag from "./components/ComponentTag.vue"
import TagTooltip from "./components/TagTooltip.vue"

const props = defineProps({
	style: { type: Object, default: () => ({}) },
	mode: { type: String, default: "default", validator: (value: string) => ["default", "large", "map", "half", "halfmap", "preview"].includes(value) },
	config: { type: Object as PropType<ComponentConfig>, required: true },
	favoriteBtn: { type: Boolean, default: false },
	isFavorite: { type: Boolean, default: false },
	deleteBtn: { type: Boolean, default: false },
	addBtn: { type: Boolean, default: false },
	infoBtn: { type: Boolean, default: false },
	toggleDisable: { type: Boolean, default: false },
});

const emits = defineEmits<{
	(e: "favorite", id: number): void,
	(e: "delete", id: number): void,
	(e: "add", id: number, name: string): void,
	(e: "info", id: number): void,
	(e: "toggle", value: boolean, map_config: MapConfig[] | null): void
}>()

const toggleOn = ref(false)
const mousePosition = ref({ x: null, y: null });
const showTagTooltip = ref(false);

// Parses time data into display format
const dataTime = computed(() => {
	if (props.config.time_from === "static") {
		return "固定資料";
	} else if (props.config.time_from === "current") {
		return "即時資料";
	} else if (props.config.time_from === "demo") {
		return "示範靜態資料";
	} else if (props.config.time_from === "maintain") {
		return "維護修復中";
	}
	const { timefrom, timeto } = getComponentDataTimeframe(
		props.config.time_from,
		props.config.time_to,
		false
	);
	if (props.config.time_from === "day_start") {
		return `${timefrom.slice(0, 16)} ~ ${timeto.slice(
			11,
			14
		)}00`;
	}
	return `${timefrom.slice(0, 10)} ~ ${timeto.slice(0, 10)}`;
});
// Parses update frequency data into display format
const updateFreq = computed(() => {
	if (props.config.update_freq && props.config.update_freq_unit) {
		return `每${props.config.update_freq}${timeTerms[props.config.update_freq_unit]
			}更新`;
	} else {
		return "不定期更新";
	}
});

// The style for the tag tooltip
const tooltipPosition = computed(() => {
	if (!mousePosition.value.x || !mousePosition.value.y) {
		return {
			left: "-1000px",
			top: "-1000px",
		};
	}
	return {
		left: `${mousePosition.value.x - 40}px`,
		top: `${mousePosition.value.y - 110}px`,
	};
});

// Updates the location for the tag tooltip
function updateMouseLocation(e: any) {
	mousePosition.value.x = e.pageX;
	mousePosition.value.y = e.pageY;
}
// Updates whether to show the tag tooltip
function changeShowTagTooltipState(state: boolean) {
	showTagTooltip.value = state;
}
</script>

<template>
	<div :class="{
		dashboardcomponent: true,
		mapclosed: mode.includes('map') && !toggleOn,
		mapopen: mode === 'map' && toggleOn,
		halfmapopen: mode === 'halfmap' && toggleOn,
		half: mode === 'half',
		large: mode === 'large',
	}">
		<!-- Header -->
		<div class="dashboardcomponent-header">
			<!-- Upper Left Corner -->
			<div>
				<h3>
					{{ config.name }}
					<ComponentTag v-if="!mode.includes('map')" icon="" :text="updateFreq" mode="small" />
					<div v-else @mouseenter="changeShowTagTooltipState(true)" @mousemove="updateMouseLocation"
						@mouseleave="changeShowTagTooltipState(false)">
						<span v-if="config.map_filter && config.map_config">tune</span>
						<span v-if="config.map_config && config.map_config[0]">map</span>
						<span v-if="config.history_config?.range">insights</span>
					</div>
				</h3>
				<div v-if="!mode.includes('map') || toggleOn">
					<h4 v-if="dataTime === '維護修復中'">
						{{ `${config.source} | ` }}<span>warning</span>
						<h4>{{ `${dataTime}` }}</h4>
						<span>warning</span>
					</h4>
					<h4 v-else>{{ `${config.source} | ${dataTime}` }}</h4>
				</div>
			</div>
			<!-- Upper Right Corner -->
			<div v-if="['default', 'half', 'preview'].includes(mode)">
				<button v-if="addBtn" @click="$emit('add', config.id, config.name)">
					<span>add_circle</span>
				</button>
				<button v-if="favoriteBtn" :class="{
		isfavorite: isFavorite,
	}" @click="
		$emit('favorite', config.id);
	">
					<span>favorite</span>
				</button>
				<button v-if="deleteBtn" class="isDelete" @click="$emit('delete', config.id)">
					<span>delete</span>
				</button>
			</div>
			<div v-else-if="mode.includes('map')" class="dashboardcomponent-header-toggle">
				<label class="toggleswitch">
					<input type="checkbox" @change="$emit('toggle', toggleOn, config.map_config)" v-model="toggleOn"
						:disabled="toggleDisable" />
					<span class="toggleswitch-slider"></span>
				</label>
			</div>
		</div>
		<!-- Main Content -->
		<div :class="{
		'dashboardcomponent-chart': true,
		'half-chart': mode === 'half',
		'mapopen-chart': mode.includes('map')
	}
		" v-if="config.chart_data && (toggleOn || !mode.includes('map'))">
			<!-- The components referenced here can be edited in /components/charts -->
		</div>
		<div v-else-if="config.chart_data === null && (toggleOn || !mode.includes('map'))" :class="{
		'dashboardcomponent-error': true,
		'half-loading': mode === 'half',
		'mapopen-loading': mode.includes('map')
	}
		">
			<span>error</span>
			<p>組件資料異常</p>
		</div>
		<div v-else-if="(toggleOn || !mode.includes('map'))" :class="{
		'dashboardcomponent-loading': true,
		'mapopen-loading': mode.includes('map'),
		'half-loading': mode === 'half',
	}
		">
			<div></div>
		</div>
	</div>
	<Teleport to="body">
		<!-- The class "chart-tooltip" could be edited in /assets/styles/chartStyles.css -->
		<TagTooltip v-if="showTagTooltip" :position="tooltipPosition" :hasFilter="config.map_filter ? true : false"
			:hasMapLayer="config.map_config && config.map_config[0] ? true : false"
			:hasHistory="config.history_config?.range ? true : false" />
	</Teleport>
</template>

<style scoped lang="scss">
* {
	margin: 0;
	padding: 0;
	font-family: "微軟正黑體", "Microsoft JhengHei", "Droid Sans", "Open Sans",
		"Helvetica";
	overflow: hidden;
}

button {
	border: none;
	background-color: transparent;
}

button:hover {
	cursor: pointer;
}

.dashboardcomponent {
	height: 330px;
	max-height: 330px;
	width: calc(100% - var(--dashboardcomponent-font-m) * 2);
	max-width: calc(100% - var(--dashboardcomponent-font-m) * 2);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	position: relative;
	padding: var(--dashboardcomponent-font-m);
	border-radius: 5px;
	background-color: var(--dashboardcomponent-color-component-background);

	@media (min-width: 1050px) {
		height: 370px;
		max-height: 370px;
	}

	@media (min-width: 1650px) {
		height: 400px;
		max-height: 400px;
	}

	@media (min-width: 2200px) {
		height: 500px;
		max-height: 500px;
	}

	&-header {
		display: flex;
		justify-content: space-between;

		h3 {
			display: flex;
			align-items: center;
			font-size: var(--dashboardcomponent-font-m);
			color: var(--dashboardcomponent-color-normal-text);
		}

		h4 {
			display: flex;
			align-items: center;
			color: var(--dashboardcomponent-color-complement-text);
			font-size: var(--dashboardcomponent-font-s);
			font-weight: 400;

			span {
				margin: 0 4px;
				color: rgb(237, 90, 90);
				font-size: 1rem;
				font-family: var(--dashboardcomponent-font-icon);
				user-select: none;
			}

			h4 {
				color: rgb(237, 90, 90);
			}
		}

		div:first-child {
			div {
				display: flex;
				align-items: center;
			}

			span {
				margin-left: 8px;
				color: var(--dashboardcomponent-color-complement-text);
				font-family: var(--dashboardcomponent-font-icon);
				user-select: none;
			}
		}

		button span {
			color: var(--dashboardcomponent-color-complement-text);
			font-family: var(--dashboardcomponent-font-icon);
			font-size: calc(var(--dashboardcomponent-font-l) * var(--dashboardcomponent-font-to-icon));
			transition: color 0.2s;

			&:hover {
				color: white;
			}
		}

		button.isfavorite span {
			color: rgb(255, 65, 44);

			&:hover {
				color: rgb(160, 112, 106);
			}
		}

		&-toggle {
			min-height: var(--font-ms);
			min-width: 2rem;
			margin-top: 4px;
		}

		@media (max-width: 760px) {
			button.isDelete {
				display: none !important;
			}
		}

		@media (min-width: 760px) {
			button.isFlag {
				display: none !important;
			}
		}

		@media (min-width: 759px) {
			button.isUnfavorite {
				display: none !important;
			}
		}
	}

	&-chart,
	&-loading,
	&-error {
		height: 75%;
		position: relative;
		padding-top: 5%;
		overflow-y: scroll;

		p {
			color: var(--dashboardcomponent-color-border);
		}
	}

	&-loading {
		display: flex;
		align-items: center;
		justify-content: center;

		div {
			width: 2rem;
			height: 2rem;
			border-radius: 50%;
			border: solid 4px var(--dashboardcomponent-color-border);
			border-top: solid 4px var(--dashboardcomponent-color-highlight);
			animation: spin 0.7s ease-in-out infinite;
		}
	}

	&-error {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		span {
			color: var(--dashboardcomponent-color-complement-text);
			margin-bottom: 0.5rem;
			font-family: var(--dashboardcomponent-font-icon);
			font-size: 2rem;
		}

		p {
			color: var(--dashboardcomponent-color-complement-text);
		}
	}
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

.large {
	height: 350px;
	max-height: 350px;

	@media (min-width: 820px) {
		height: 380px;
		max-height: 380px;
	}

	@media (min-width: 1200px) {
		height: 420px;
		max-height: 420px;
	}

	@media (min-width: 2200px) {
		height: 520px;
		max-height: 520px;
	}
}

.mapclosed {
	max-height: none;
	height: fit-content;
}

.mapopen {
	max-height: 330px;
	height: 330px;

	&-chart,
	&-loading {
		padding-top: 0%;
		height: 80%;
		position: relative;
		overflow-y: scroll;

		p {
			color: var(--color-border);
		}
	}
}

.half {
	height: 180px;
	max-height: 180px;

	@media (min-width: 1050px) {
		height: 210px;
		max-height: 210px;
	}

	@media (min-width: 1650px) {
		height: 225px;
		max-height: 225px;
	}

	@media (min-width: 2200px) {
		height: 275px;
		max-height: 275px;
	}

	&-chart,
	&-loading {
		height: 60%;
	}
}

.halfmapopen {
	height: 200px;
	max-height: 200px;
}
</style>
