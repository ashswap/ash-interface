import { network } from "const/network";
import { fetcher } from "helper/common";
import { abbreviateCurrency } from "helper/number";
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
import { TokenChartTimeUnitType } from "./TokenChart";

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
    const value = areaRef.current.state.curPoints[payloadIndex]?.payload.value || 0;
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
                {abbreviateCurrency(value)}
            </text>
        </>
        //   <svg width="600" height="1" version="1.1" xmlns="http://www.w3.org/2000/svg">

        // </svg>
    );
};
const MONTH = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
];
function TokenLiquidityChart({
    token,
    timeUnit,
}: {
    token: IToken;
    timeUnit: TokenChartTimeUnitType;
}) {
    const { data } = useSWR<[number, number][]>(
        token.id
            ? `${network.ashApiBaseUrl}/token/${token.id}/graph-statistic?type=liquidity`
            : null,
        fetcher
    );
    const areaRef = useRef<any>(null);
    const chartData = useMemo(() => {
        if (!data) return [];
        return data.map(([timestamp, value]) => ({ timestamp, value }));
    }, [data]);
    const displayChartData = useMemo(() => {
        if (timeUnit === "D") return chartData;
        const wMap: { [key: number]: number[] } = {};
        chartData.map((val) => {
            // group by week or month to get the same key(timestamp)
            const w =
                timeUnit === "W"
                    ? moment
                          .unix(val.timestamp)
                          .day(1)
                          .hour(0)
                          .minute(0)
                          .second(0)
                          .millisecond(0)
                          .unix()
                    : moment
                          .unix(val.timestamp)
                          .date(1)
                          .hour(0)
                          .minute(0)
                          .second(0)
                          .millisecond(0)
                          .unix();
            if (wMap[w]) {
                wMap[w].push(val.value);
            } else {
                wMap[w] = [val.value];
            }
        });
        const avg = Object.keys(wMap).map((k) => {
            const sum = wMap[+k].reduce((total, value) => {
                return total + value;
            }, 0);
            return {
                timestamp: +k,
                value: sum / wMap[+k].length,
            };
        });
        return avg;
    }, [chartData, timeUnit]);

        // get displayed distinct Xaxis Tick value (timestamp)
        const ticks = useMemo(() => {
            const temp = new Set<number>();
            displayChartData.map(({ timestamp }) => {
                if (timeUnit === "D") {
                    temp.add(timestamp);
                } else {
                    const time = moment.unix(timestamp);
                    temp.add(
                        timeUnit === "M" ? time.date(1).unix() : time.day(1).unix()
                    );
                }
            });
            return Array.from(temp);
        }, [displayChartData, timeUnit]);
        // Xaxis formatter
        const tickFormatter = useCallback(
            (val, index: number) => {
                const time = moment.unix(val);
                return timeUnit === "D"
                    ? time.format("DD/MM/yyyy")
                    : timeUnit === "M"
                    ? MONTH[time.month()]
                    : "week " + time.week();
            },
            [timeUnit]
        );
    return (
        <ResponsiveContainer>
            <AreaChart data={displayChartData}>
                <defs>
                    <linearGradient id="TLC-colorUv" x1="0" y1="0" x2="0" y2="1">
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
                    <filter id="TLC-shadowUv" height="200%">
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
                    tick={{fill: "#B7B7D7", fontSize: 12}}
                />
                <YAxis
                    dataKey="value"
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    padding={{ top: 20, bottom: 20 }}
                    domain={[0, (max: number) => max * 1.5]}
                    tickFormatter={(val: number) => abbreviateCurrency(val).toString()}
                    width={50}
                    tick={{fill: "#B7B7D7", fontSize: 12}}
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
                    fill="url(#TLC-colorUv)"
                    strokeWidth={3}
                    filter="url(#TLC-shadowUv)"
                    activeDot={(activeDotProps) => (
                        <CustomActiveDot
                            {...activeDotProps}
                            dotColor="#FF005C"
                        />
                    )}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

export default TokenLiquidityChart;
