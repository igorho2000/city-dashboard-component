interface chartType {
	[index: string]: string;
}

export const chartTypes: chartType = {
	DonutChart: "圓餅圖",
	BarChart: "橫向長條圖", // V
	ColumnChart: "縱向長條圖", // V
	BarPercentChart: "長條圖(%)",
	TreemapChart: "矩形圖",
	DistrictChart: "行政區圖", // V
	MetroChart: "捷運行駛圖", // V
	TimelineSeparateChart: "折線圖(比較)", // V
	TimelineStackedChart: "折線圖(堆疊)", // V
	GuageChart: "量表圖",
	RadarChart: "雷達圖",
	HeatmapChart: "熱力圖",
	PolarAreaChart: "極座標圖", // V
	ColumnLineChart: "長條折線圖",
	BarChartWithGoal: "長條圖(目標)",
	IconPercentChart: "圖示比例圖", // V
	SpeedometerChart: "儀表板圖", // 暫時不用
	MapLegend: "地圖圖例", // V
};
