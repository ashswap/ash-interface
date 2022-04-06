import { network } from "const/network";
import { MONTH_SHORT } from "const/time";
import { VE_ASH_DECIMALS } from "const/tokens";
import { toEGLDD } from "helper/balance";
import { fetcher } from "helper/common";
import { formatAmount } from "helper/number";
import { useScreenSize } from "hooks/useScreenSize";
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
import ICArrowTopRight from "assets/svg/arrow-top-right.svg";
import ICArrowBottomRight from "assets/svg/arrow-bottom-right.svg";
import { ChartActiveDot } from "components/Chart/ChartActiveDot";
import { ChartLineX } from "components/Chart/ChartLineX";

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
const interval = ["D", "W", "M"];
function VotePowerChart() {
    const { data } = useSWR<[number, string][]>(
        `${network.ashApiBaseUrl}/stake/governance/voting-power`,
        fetcher,
        { refreshInterval: 10 * 60 * 1000 }
    );
    const areaRef = useRef<any>(null);
    const [activeIndex, setActiveIndex] = useState(-1);

    const { sm } = useScreenSize();

    const chartData = useMemo(() => {
        if (!data) return [];
        return data.map(([timestamp, value]) => ({
            timestamp,
            value: toEGLDD(VE_ASH_DECIMALS, value).toNumber(),
        }));
    }, [data]);
    const displayChartData = useMemo(() => {
        return chartData;
    }, [chartData]);

    const ticks = useMemo(() => {
        return displayChartData.map(({ timestamp }) => timestamp);
    }, [displayChartData]);
    // Xaxis formatter
    const tickFormatter = useCallback((val, index: number) => {
        const time = moment.unix(val);
        return time.format("yyyy");
    }, []);
    const activePayload = useMemo(() => {
        if (activeIndex === -1)
            return displayChartData[displayChartData.length - 1];
        return displayChartData[activeIndex];
    }, [displayChartData, activeIndex]);
    const prevPayload = useMemo(() => {
        const index = activeIndex - 1;
        if (index === -2) return displayChartData[displayChartData.length - 2];
        return displayChartData[index];
    }, [displayChartData, activeIndex]);
    const pct = useMemo(() => {
        const activeVal = activePayload?.value || 0;
        const prevVal = prevPayload?.value || 0;
        if (prevVal === 0) return 0;
        return ((activeVal - prevVal) * 100) / prevVal;
    }, [activePayload, prevPayload]);
    return (
        <div
            className="relative bg-ash-dark-600 px-[1.625rem] py-4"
            style={{ boxShadow: "0px 50px 50px rgba(18, 16, 29, 0.5)" }}
        >
            <div className="h-60 mb-5">
                <ResponsiveContainer>
                    <AreaChart
                        data={displayChartData}
                        onMouseLeave={() => setActiveIndex(-1)}
                        onMouseMove={(e) => {
                            setActiveIndex(e?.activeTooltipIndex || -1);
                        }}
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
                    Voting Power - Amount of veASH locked
                </div>
                <div className="text-lg flex items-start leading-tight">
                    <span>
                        {formatAmount(
                            activePayload?.value ??
                                displayChartData[displayChartData.length - 1]
                                    ?.value
                        )}
                    </span>
                    {pct !== 0 &&
                        moment
                            .unix(activePayload.timestamp)
                            .isSame(moment(), "year") && (
                            <div
                                className={`flex items-center ml-4 ${
                                    pct > 0
                                        ? "text-ash-green-500"
                                        : "text-ash-purple-500"
                                }`}
                            >
                                {pct > 0 ? (
                                    <ICArrowTopRight className="w-1.5 h-1.5" />
                                ) : (
                                    <ICArrowBottomRight className="w-1.5 h-1.5" />
                                )}
                                <span className={`text-xs font-bold ml-1`}>
                                    {pct > 0 && "+"}
                                    {pct.toFixed(2)}%
                                </span>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
}

export default VotePowerChart;
