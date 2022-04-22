import { ChartActiveDot } from "components/Chart/ChartActiveDot";
import { ChartLineX } from "components/Chart/ChartLineX";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { CHART_INTERVAL, MONTH_SHORT } from "const/time";
import { fetcher } from "helper/common";
import { abbreviateCurrency, formatAmount } from "helper/number";
import { useScreenSize } from "hooks/useScreenSize";
import { useValueChart } from "hooks/useValueChart";
import { ChartTimeUnitType, ValueChartRecord } from "interface/chart";
import { IToken } from "interface/token";
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
function OverviewLiquidityChart() {
    const { data } = useSWR<[number, number][]>(
        `${ASHSWAP_CONFIG.ashApiBaseUrl}/overview/liquidity`,
        fetcher
    );
    const areaRef = useRef<any>(null);
    const [timeUnit, setTimeUnit] = useState<ChartTimeUnitType>("D");
    const [activePayload, setActivePayload] = useState<ValueChartRecord>();
    const { sm } = useScreenSize();
    const chartData = useMemo(() => {
        if (!data) return [];
        return data.map(([timestamp, value]) => ({ timestamp, value }));
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
        const payload = activePayload || displayChartData[displayChartData.length - 1];
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
            <div className="flex-grow relative">
                <ResponsiveContainer>
                    <AreaChart
                        data={displayChartData}
                        onMouseLeave={() => setActivePayload(undefined)}
                        onMouseMove={(e) =>
                            setActivePayload(e?.activePayload?.[0]?.payload)
                        }
                    >
                        <defs>
                            <linearGradient
                                id="OLC-colorUv"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#FF005C"
                                    stopOpacity={0.2}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#FF005C"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                            <filter id="OLC-shadowUv" height="200%">
                                <feDropShadow
                                    dx="0"
                                    dy="0"
                                    stdDeviation="10"
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
                            tickFormatter={tickFormatter}
                            ticks={ticks}
                            tick={{ fill: "#B7B7D7", fontSize: sm ? 12 : 10 }}
                        />
                        <YAxis
                            dataKey="value"
                            orientation="right"
                            axisLine={false}
                            tickLine={false}
                            padding={{ top: 20, bottom: 20 }}
                            domain={[0, (max: number) => max * 1.5]}
                            tickFormatter={(val: number) =>
                                abbreviateCurrency(val).toString()
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
                            fill="url(#OLC-colorUv)"
                            strokeWidth={3}
                            filter="url(#OLC-shadowUv)"
                            activeDot={(activeDotProps) => (
                                <CustomActiveDot
                                    {...activeDotProps}
                                    dotColor="#FF005C"
                                />
                            )}
                        />
                    </AreaChart>
                </ResponsiveContainer>
                <div className="absolute top-0">
                    <div className="text-xs text-white mb-2">
                        Liquidity{" "}
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
            <div className="text-ash-gray-500 flex space-x-2 flex-shrink-0">
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

export default OverviewLiquidityChart;
