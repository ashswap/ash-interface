import { CHART_INTERVAL } from "const/time";

export type ValueChartRecord = {timestamp: number, value: number, range?: [number, number]};
export type ChartTimeUnitType = typeof CHART_INTERVAL[number];