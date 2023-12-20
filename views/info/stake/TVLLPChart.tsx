import { ChartActiveDot } from "components/Chart/ChartActiveDot";
import { ChartLineX } from "components/Chart/ChartLineX";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { CHART_INTERVAL, CHART_INTERVAL_MAP, MONTH_SHORT } from "const/time";
import { fetcher } from "helper/common";
import { formatAmount } from "helper/number";
import { useScreenSize } from "hooks/useScreenSize";
import { useValueChart } from "hooks/useValueChart";
import { ChartTimeUnitType } from "interface/chart";
import moment from "moment";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
    Area,
    AreaChart,
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
const CustomTooltipCursor = ({ areaRef, ...props }: any) => {
    const { width, height, left, payloadIndex } = props;
    if (!areaRef.current) return null;
    const y = areaRef.current.state.curPoints[payloadIndex]?.y || 0;
    const value =
        areaRef.current.state.curPoints[payloadIndex]?.payload.value || 0;

    return (
        <ChartLineX
            width={width}
            height={height}
            left={left}
            y={y}
            label={formatAmount(value) || ""}
        />
    );
};
function TVLLPChart() {
    const [timeUnit, setTimeUnit] = useState<ChartTimeUnitType>("D");
    const { data } = useSWR<[number, number][]>(
        `${ASHSWAP_CONFIG.ashApiBaseUrl}/stake/farming/graph-statistic?type=liquidity&interval=${CHART_INTERVAL_MAP[timeUnit]}`,
        fetcher,
        { refreshInterval: 5 * 60 * 1000 }
    );
    const areaRef = useRef<any>(null);
    const [activePayload, setActivePayload] =
        useState<{ timestamp: number; value: number }>();

    const { sm } = useScreenSize();

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
                    <AreaChart
                        data={displayChartData}
                        onMouseLeave={() => setActivePayload(undefined)}
                        onMouseMove={(e: any) =>
                            setActivePayload(e?.activePayload?.[0])
                        }
                    >
                        <defs>
                            <linearGradient
                                id="TVLLP-colorUv"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="#FF005C"
                                    stopOpacity={0.2}
                                />
                                <stop
                                    offset="93.33%"
                                    stopColor="#FF005C"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                            <filter id="TVLLP-shadowUv" height="200%">
                                <feDropShadow
                                    dx="0"
                                    dy="0"
                                    stdDeviation="5"
                                    floodColor="#FF005C"
                                />
                            </filter>
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
                            domain={[
                                (min: number) => min / 2,
                                (max: number) => max * 1.5,
                            ]}
                            tickFormatter={(val: number) =>
                                formatAmount(val)?.toString() || ""
                            }
                            width={50}
                            tick={{ fill: "#B7B7D7", fontSize: sm ? 12 : 10 }}
                        />
                        <Tooltip
                            coordinate={{ x: 0, y: 0 }}
                            active={true}
                            position={{ x: 0, y: 0 }}
                            cursor={<CustomTooltipCursor areaRef={areaRef} />}
                            content={<></>}
                        />
                        {/* <Tooltip cursor={{}} content={<CustomTooltip/>}/> */}
                        {/* <Tooltip coordinate={{x: 0, y: 0}} active={true} position={{x: 0, y: 0}} cursor={true} content={<CustomTooltip/>}/> */}
                        <Area
                            ref={areaRef}
                            type="linear"
                            dataKey="value"
                            stroke="#FF005C"
                            fillOpacity={1}
                            fill="url(#TVLLP-colorUv)"
                            strokeWidth={3}
                            filter="url(#TVLLP-shadowUv)"
                            activeDot={(activeDotProps) => {
                                return (
                                    <CustomActiveDot
                                        {...activeDotProps}
                                        dotColor="#FF005C"
                                    />
                                );
                            }}
                            className="pt-10"
                        />
                    </AreaChart>
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

export default TVLLPChart;
