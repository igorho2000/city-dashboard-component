# <img src="./src/assets/1premium.png" height="36" /> City Dashboard Component

## Requirements

This component was designed for `Vue` version 3 or above. Please install via `npm` version 20 or above.

## Installation

1. Install the package via npm.

```bash
npm i city-dashboard-component
```

2. Import the stylesheet to `main.js`.

```js
import "city-dashboard-component/style.css";
```

3. Import the component globally or locally in any Vue component.

```js
import { DashboardComponent } from "city-dashboard-component";

// If global
app.component("DashboardComponent", DashboardComponent);
```

## Modes

- **Default**: The default form of this component with a chart in the middle.
- **Large**: Slightly larger height than default mode.
- **Half**: Half the height of default mode.
- **Map**: Adds a toggle and collapse mode.
- **HalfMap**: Half the height of map mode when expanded.
- **Preview**: No chart in the middle but only descriptions.

## Props

>This component follows the configuration of Taipei City Dashboard. Please refer to its [documentation](https://tuic.gov.taipei/documentation/front-end) for more information.

|Prop|Type|Default|Description|
|----|----|-------|-----------|
|config|`Object<ComponentConfig>`|None. Required.|Component Config. Refer to Taipei City Dashboard's docs for the complete list of parameters available.|
|mode|`Enum`|`"default"`|Must be one of "default", "large", "map", "half", "halfmap", "preview"|
|favoriteBtn|`Boolean`|`false`|Whether to show a favorite button|
|isFavorite|`Boolean`|`false`|Whether the component is liked|
|deleteBtn|`Boolean`|`false`|Whether to show a delete button|
|addBtn|`Boolean`|`false`|Whether to show an add button|
|infoBtn|`Boolean`|`false`|Whether to show an info button|
|infoBtnText|`String`|`"組件資訊"`|The text of the info button|
|toggleDisable|`Boolean`|`false`|Whether to disable the toggle in map mode|
|footer|`Boolean`|`true`|Whether to show the footer|
|style|`Object`|`{}`|Override the wrapper styles of the component|


## Events

>This component follows the configuration of Taipei City Dashboard. Please refer to its [documentation](https://tuic.gov.taipei/documentation/front-end) for more information.

|Event|Required Props|Fired When|Parameters|
|-----|--------------|----------|----------|
|favorite|`favoriteBtn`|The favorite button is clicked|`id<Number>`|
|delete|`deleteBtn`|The delete button is clicked|`id<Number>`|
|add|`addBtn`|The add button is clicked|`id<Number>`|
|info|`infoBtn`|The info button is clicked|`config<ComponentConfig>`|
|toggle|`mode<"map", "halfmap">`|The toggle button is clicked|`value<Boolean>, map_config<MapConfig[]>`|
|filterByParam|`mode<"map", "halfmap">`, `config` has map filter in param mode|When the chart is clicked and no filter is present.|`map_filter<MapFilter>, map_config<MapConfig[]>, x<string or null>, y<string or null>`|
|filterByLayer|`mode<"map", "halfmap">`, `config` has map filter in layer mode|When the chart is clicked and no filter is present.|`map_config<MapConfig[]>, x<string or null>`|
|clearByParamFilter|`mode<"map", "halfmap">`, `config` has map filter in param mode|When the chart is clicked and a filter is present.|`map_config<MapConfig[]>`|
|clearByLayerFilter|`mode<"map", "halfmap">`, `config` has map filter in layer mode|When the chart is clicked and a filter is present.|`map_config<MapConfig[]>`|
|fly|`mode<"map", "halfmap">`, `config` specifies `DistrictChart`|When the chart is clicked.|`location<{lng, lat}>`|


## Example
![Screenshot 2024-04-19 at 9 53 39 AM](https://github.com/igorho2000/city-dashboard-component/assets/105908220/f908f42a-e4e0-4105-b3b2-38f07f1a88d1)

```vue
<script setup>
import { ref } from "vue"
import { DashboardComponent } from "city-dashboard-component"

const config = {...} // Please refer to Taipei City Dashboard Docs
const isFavorite = ref(false);

function showMoreInfo(config) {
  // a function to open a dialog to show more info about the component
}
</script>

<template>
  <DashboardComponent
      mode="default"
      :config="config"
      :info-btn="true"
      :favorite-btn="true"
      :is-favorite="isFavorite"
      @favorite="
        (id) => {
          console.log(id);
          isFavorite = !isFavorite
        }
      "
      @info="
        (config) => {
          showMoreInfo(config);
        }
      "
  />
</template>
```

For more examples, please refer to [Taipei City Dashboard](https://citydashboard.taipei) or its [GitHub repository](https://github.com/tpe-doit/Taipei-City-Dashboard).

© 2023-2024 Igor Ho, One Premium Ltd.
