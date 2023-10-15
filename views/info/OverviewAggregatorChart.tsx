import { ChartActiveDot } from "components/Chart/ChartActiveDot";
import { ChartLineX } from "components/Chart/ChartLineX";
import { CHART_INTERVAL, MONTH_SHORT } from "const/time";
import { fetcher } from "helper/common";
import { formatAmount } from "helper/number";
import { useScreenSize } from "hooks/useScreenSize";
import { useValueChart } from "hooks/useValueChart";
import { ChartTimeUnitType } from "interface/chart";
import moment from "moment";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import useSWR from "swr";

const CustomActiveDot = ({ dotColor, ...props }: any) => {
    const { cx, cy } = props;
    return <ChartActiveDot dotColor={dotColor} cx={cx} cy={cy} />;
};
const CustomTooltipCursor = ({ barRef, ...props }: any) => {
    let { width, height, payloadIndex } = props;
    if (!barRef.current) return null;
    const y = barRef.current.state.curData[payloadIndex]?.y || 0;
    const value =
        barRef.current.state.curData[payloadIndex]?.payload.value || 0;
    width = width * (barRef.current.state.curData.length - 1) + 51;

    return (
        <ChartLineX
            width={width}
            height={height}
            left={0}
            y={y}
            label={formatAmount(value) || ""}
        />
    );
};
function OverviewAggregatorChart() {
    const { data } = useSWR<[number, number][]>(
        `https://api.ashswap.io/aggregator/graph-statistic`,
        fetcher,
        { refreshInterval: 5 * 60 * 1000 }
    );
    const barRef = useRef<any>(null);
    const [activePayload, setActivePayload] =
        useState<{ timestamp: number; value: number }>();

    const { sm } = useScreenSize();
    const [timeUnit, setTimeUnit] = useState<ChartTimeUnitType>("D");

    const chartData = useMemo(() => {
        if (!data) return [];
        return data.map(([timestamp, value]) => ({ timestamp, value }));
    }, [data]);
    const { displayChartData, timestampTicks: ticks } = useValueChart(
        chartData,
        timeUnit,
        "latest"
    );

    // Xaxis formatter
    const tickFormatter = useCallback(
        (val: number, index: number) => {
            const time = moment.unix(val);
            return timeUnit === "D"
                ? time.format("DD/MM/yyyy")
                : timeUnit === "M"
                ? MONTH_SHORT[time.month()]
                : "week " + time.week();
        },
        [timeUnit]
    );
    return (
        <div
            className="relative bg-ash-dark-600 px-[1.625rem] py-4"
            style={{ boxShadow: "0px 50px 50px rgba(18, 16, 29, 0.5)" }}
        >
            <div className="h-60 mb-5">
                <ResponsiveContainer>
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
                            padding={{ right: 30, left: 20 }}
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
            </div>
            <div className="absolute top-7.5 left-[1.625rem]">
                <div className="text-xs text-white mb-2">
                    Total value of locked LP
                </div>
                <div className="text-lg leading-tight">
                    <span className="text-ash-gray-500">$ </span>
                    <span>
                        {formatAmount(
                            activePayload?.value ??
                                displayChartData[displayChartData.length - 1]
                                    ?.value
                        )}
                    </span>
                </div>
            </div>
            <div className="flex space-x-2 mb-10">
                {CHART_INTERVAL.map((val) => {
                    return (
                        <button
                            key={val}
                            className={`w-9 h-9 bg-ash-dark-400 ${
                                timeUnit === val
                                    ? "text-white"
                                    : "text-ash-gray-500"
                            }`}
                            onClick={() => setTimeUnit(val)}
                        >
                            {val}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default OverviewAggregatorChart;
