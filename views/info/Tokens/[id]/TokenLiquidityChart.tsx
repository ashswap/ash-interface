import { network } from "const/network";
import { fetcher } from "helper/common";
import { IToken } from "interface/token";
import React, { useRef, useState } from "react";
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import useSWR from "swr";
const data = [
    {
        name: 1,
        uv: 4000,
    },
    {
        name: 1.2,
        uv: 2000,
    },
    {
        name: 1.4,
        uv: 2300,
    },
    {
        name: 1.5,
        uv: 1000,
    },
    {
        name: 2,
        uv: 2000,
    },
    {
        name: 2.5,
        uv: 2780,
    },
    {
        name: 3,
        uv: 1890,
    },
    {
        name: 3.5,
        uv: 2390,
    },
    {
        name: 4,
        uv: 3490,
    },
];

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
                x={width + 17}
                y={y}
                width="62"
                height="28"
                fill="white"
                textAnchor="middle"
                alignmentBaseline="central"
            >
                5k
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
function TokenLiquidityChart({token}: {token: IToken}) {
    const {data} = useSWR(token.id ? `${network.ashApiBaseUrl}/token/${token.id}/graph-statistic?type=liquidity` : null, fetcher);
    const areaRef = useRef<any>(null);
    
    return (
        <ResponsiveContainer>
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
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
                    <filter id="shadowUv" height="200%">
                        <feDropShadow
                            dx="0"
                            dy="0"
                            stdDeviation="10"
                            floodColor="#FF005C"
                        />
                    </filter>
                </defs>
                <XAxis
                    dataKey="name"
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    padding={{ right: 30 }}
                    interval="preserveStart"
                    domain={["dataMin", "dataMax"]}
                    tickFormatter={(val: number) =>
                        MONTH[(Math.ceil(val) % MONTH.length) - 1]
                    }
                />
                <YAxis
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    padding={{ top: 20 }}
                    domain={[0, (max: number) => max * 1.5]}
                    tickFormatter={(val: number) => val / 1000 + "k"}
                    width={50}
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
                    dataKey="uv"
                    stroke="#FF005C"
                    fillOpacity={1}
                    fill="url(#colorUv)"
                    strokeWidth={3}
                    filter="url(#shadowUv)"
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
