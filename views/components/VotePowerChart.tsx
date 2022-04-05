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

const CustomActiveDot = ({ dotColor, ...props }: any) => {
    const { cx, cy } = props;
    return (
        <svg
            x={cx - 20}
            y={cy - 20}
            width="40"
            height="41"
            viewBox="0 0 40 41"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g filter="url(#filter0_f_2859_6154)">
                <rect
                    width="18.2302"
                    height="18.2302"
                    transform="matrix(0.694136 0.719844 -0.694136 0.719844 19.6543 7)"
                    fill={dotColor || "currentColor"}
                />
            </g>
            <path
                opacity="0.7"
                d="M24.8957 20.1453C24.8957 20.9771 22.5064 21.7359 22.0105 22.3105C21.437 22.9749 20.6037 25.5583 19.6761 25.5583C18.7486 25.5583 17.9153 22.9749 17.3418 22.3105C16.8459 21.7359 14.4565 20.9771 14.4565 20.1453C14.4565 19.3135 16.8459 18.5548 17.3418 17.9802C17.9153 17.3157 18.7486 14.7324 19.6761 14.7324C20.6037 14.7324 21.437 17.3157 22.0105 17.9802C22.5064 18.5548 24.8957 19.3135 24.8957 20.1453Z"
                fill="white"
            />
            <defs>
                <filter
                    id="filter0_f_2859_6154"
                    x="0"
                    y="0"
                    width="39.3086"
                    height="40.2461"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                    />
                    <feGaussianBlur
                        stdDeviation="3.5"
                        result="effect1_foregroundBlur_2859_6154"
                    />
                </filter>
            </defs>
        </svg>
    );
};
const CustomTooltipCursor = ({ areaRef, ...props }: any) => {
    const { width, height, left, payloadIndex } = props;
    if (!areaRef.current) return null;
    const y = areaRef.current.state.curPoints[payloadIndex]?.y || 0;
    const value =
        areaRef.current.state.curPoints[payloadIndex]?.payload.value || 0;

    return (
        <>
            <line
                width={width}
                height={height}
                strokeDasharray="5, 5"
                x1={left}
                y1={y}
                x2={width}
                y2={y}
                strokeWidth={1}
                stroke="#FF005C"
            ></line>
            <rect
                x={width}
                y={y - 14}
                width="62"
                height="28"
                fill="#FF005C"
                className="transition-none"
            ></rect>
            <text
                x={width + 12}
                y={y}
                width="62"
                height="28"
                fill="white"
                // textAnchor="middle"
                alignmentBaseline="central"
                fontSize={12}
            >
                {formatAmount(value)}
            </text>
        </>
        //   <svg width="600" height="1" version="1.1" xmlns="http://www.w3.org/2000/svg">

        // </svg>
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
                            <div className={`flex items-center ml-4 ${pct > 0 ? "text-ash-green-500" : "text-ash-purple-500"}`}>
                                {pct > 0 ? <ICArrowTopRight className="w-1.5 h-1.5"/> : <ICArrowBottomRight className="w-1.5 h-1.5"/>}
                                <span className={`text-xs font-bold ml-1`}>{pct > 0 && "+"}{pct.toFixed(2)}%</span>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
}

export default VotePowerChart;
