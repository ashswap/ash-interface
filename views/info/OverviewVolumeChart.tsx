import { ChartActiveDot } from "components/Chart/ChartActiveDot";
import { ChartLineX } from "components/Chart/ChartLineX";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { CHART_INTERVAL, MONTH_SHORT } from "const/time";
import { fetcher } from "helper/common";
import { formatAmount } from "helper/number";
import { useScreenSize } from "hooks/useScreenSize";
import { useValueChart } from "hooks/useValueChart";
import { ChartTimeUnitType, ValueChartRecord } from "interface/chart";
import moment from "moment";
import { useCallback, useMemo, useRef, useState } from "react";
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import useSWR from "swr";

const CustomTooltipCursor = ({ barRef, ...rest }: any) => {
    const { left, payloadIndex } = rest;
    if (!barRef.current) return null;
    const { state, props } = barRef.current;
    const { width, height } = props;
    const data = state.curData[payloadIndex];
    const y = data?.y || 0;
    const value = data?.payload.value || 0;
    return (
        <>
            <ChartLineX
                width={width}
                height={height}
                left={left}
                y={y}
                label={formatAmount(value) || ""}
            />
            <ChartActiveDot
                dotColor="#FF005C"
                cx={(data?.x || 0) + (data?.width || 0) / 2}
                cy={data?.y || 0}
            />
        </>
    );
};
function OverviewVolumeChart() {
    const { data } = useSWR<[number, number][]>(
        `${ASHSWAP_CONFIG.ashApiBaseUrl}/overview/volume`,
        fetcher
    );
    const [timeUnit, setTimeUnit] = useState<ChartTimeUnitType>("D");
    const [activePayload, setActivePayload] = useState<ValueChartRecord>();
    const barRef = useRef<any>(null);
    const { sm } = useScreenSize();
    const chartData = useMemo(() => {
        if (!data) return [];
        return data.map(([timestamp, value]) => ({
            timestamp,
            value,
        }));
    }, [data]);
    const { displayChartData, timestampTicks: ticks } = useValueChart(
        chartData,
        timeUnit
    );
    // Xaxis formatter
    const tickFormatter = useCallback(
        (val, index: number) => {
            const time = moment.unix(val);
            return timeUnit === "D"
                ? time.format("DD/MM/yyyy")
                : timeUnit === "M"
                ? MONTH_SHORT[time.month()]
                : "week " + time.week();
        },
        [timeUnit]
    );
    const rangeFormat = useMemo(() => {
        const payload =
            activePayload || displayChartData[displayChartData.length - 1];
        if (!payload) return "";
        if (timeUnit === "D")
            return moment.unix(payload.timestamp).format("DD MMM, yyyy");
        if (payload?.range) {
            const [start, end] = payload.range;
            return `${moment.unix(start).format("DD MMM")} - ${moment
                .unix(end)
                .format("DD MMM, yyyy")}`;
        }

        return "";
    }, [activePayload, timeUnit, displayChartData]);
    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="grow relative">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={displayChartData}
                        onMouseLeave={() => setActivePayload(undefined)}
                        onMouseMove={(e) =>
                            setActivePayload(e?.activePayload?.[0]?.payload)
                        }
                    >
                        <defs>
                            <linearGradient
                                id="OVC-colorUv"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="16.28%"
                                    stopColor="#FF005C"
                                    stopOpacity={1}
                                />
                                <stop
                                    offset="80%"
                                    stopColor="#2F2B66"
                                    stopOpacity={0.5}
                                />
                            </linearGradient>
                            <pattern
                                id="OVC-pattern"
                                x="0"
                                y="10%"
                                width="100%"
                                height="100%"
                                patternUnits="userSpaceOnUse"
                            >
                                <rect
                                    x="0"
                                    y="0"
                                    width="100%"
                                    height="100%"
                                    fill="url(#OVC-colorUv)"
                                />
                            </pattern>
                        </defs>
                        <XAxis
                            dataKey="timestamp"
                            type="number"
                            axisLine={false}
                            tickLine={false}
                            padding={{ right: 30 }}
                            interval="preserveStart"
                            domain={["dataMin", "dataMax"]}
                            ticks={ticks}
                            tickFormatter={tickFormatter}
                            tick={{ fill: "#B7B7D7", fontSize: sm ? 12 : 10 }}
                        />
                        <YAxis
                            dataKey="value"
                            orientation="right"
                            axisLine={false}
                            tickLine={false}
                            padding={{ top: 20, bottom: 20 }}
                            domain={[0, (max: number) => max * 1.5]}
                            tickFormatter={(val: number) => formatAmount(val)}
                            width={50}
                            tick={{ fill: "#B7B7D7", fontSize: sm ? 12 : 10 }}
                        />
                        <Bar
                            ref={barRef}
                            dataKey="value"
                            fill="url(#OVC-pattern)"
                            maxBarSize={50}
                        />
                        <Tooltip
                            coordinate={{ x: 0, y: 0 }}
                            active={true}
                            position={{ x: 0, y: 0 }}
                            cursor={<CustomTooltipCursor barRef={barRef} />}
                            content={<></>}
                        />
                    </BarChart>
                </ResponsiveContainer>
                <div className="absolute top-0">
                    <div className="text-xs text-white mb-2">
                        Volume{" "}
                        <span className="text-stake-gray-500">
                            {rangeFormat}
                        </span>
                    </div>
                    <div className="text-lg leading-tight">
                        <span className="text-ash-gray-500">$ </span>
                        <span>
                            {formatAmount(
                                activePayload?.value ??
                                    displayChartData[
                                        displayChartData.length - 1
                                    ]?.value
                            )}
                        </span>
                    </div>
                </div>
            </div>
            <div className="text-ash-gray-500 flex space-x-2 shrink-0">
                {CHART_INTERVAL.map((unit) => {
                    return (
                        <button
                            key={unit}
                            className={`w-9 h-9 bg-ash-dark-400 ${
                                timeUnit === unit
                                    ? "text-white"
                                    : "text-ash-gray-500"
                            }`}
                            onClick={() => setTimeUnit(unit)}
                        >
                            {unit}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default OverviewVolumeChart;
