import { ChartActiveDot } from "components/Chart/ChartActiveDot";
import { ChartLineX } from "components/Chart/ChartLineX";
import { CHART_INTERVAL, MONTH_SHORT } from "const/time";
import { formatAmount } from "helper/number";
import { useScreenSize } from "hooks/useScreenSize";
import { useValueChart } from "hooks/useValueChart";
import { ChartTimeUnitType, ValueChartRecord } from "interface/chart";
import moment from "moment";
import { useCallback, useId, useMemo, useRef, useState } from "react";
import {
    Area,
    AreaChart as PrimitiveAreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

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
type Props = {
    data: [number, number][];
    maxRecords?: number;
    mode?: Parameters<typeof useValueChart>[2];
    label?: React.ReactNode;
    hideInfo?: boolean;
};
function AreaChart({ data, maxRecords, mode = "sum", label, hideInfo }: Props) {
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
        timeUnit,
        mode,
        maxRecords
    );
    const colorId = useId();
    const shadowId = useId();
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
                <ResponsiveContainer>
                    <PrimitiveAreaChart
                        data={displayChartData}
                        onMouseLeave={() => setActivePayload(undefined)}
                        onMouseMove={(e: any) =>
                            setActivePayload(e?.activePayload?.[0]?.payload)
                        }
                    >
                        <defs>
                            <linearGradient
                                id={colorId}
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
                            <filter id={shadowId} height="200%">
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
                            tickFormatter={(val: number) => formatAmount(val)}
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
                            fill={`url(#${colorId})`}
                            strokeWidth={3}
                            filter={`url(#${shadowId})`}
                            activeDot={(activeDotProps) => (
                                <CustomActiveDot
                                    {...activeDotProps}
                                    dotColor="#FF005C"
                                />
                            )}
                        />
                    </PrimitiveAreaChart>
                </ResponsiveContainer>
                <div className="absolute top-0" hidden={!!hideInfo}>
                    <div className="text-xs text-white mb-2">
                        {label}{" "}
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

export default AreaChart;
