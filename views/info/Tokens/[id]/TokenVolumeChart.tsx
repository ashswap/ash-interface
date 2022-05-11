import { ChartActiveDot } from "components/Chart/ChartActiveDot";
import { ChartLineX } from "components/Chart/ChartLineX";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { MONTH_SHORT } from "const/time";
import { fetcher } from "helper/common";
import { formatAmount } from "helper/number";
import { useScreenSize } from "hooks/useScreenSize";
import { useValueChart } from "hooks/useValueChart";
import { ChartTimeUnitType } from "interface/chart";
import { IToken } from "interface/token";
import moment from "moment";
import React, { useCallback, useMemo, useRef } from "react";
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
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
function TokenVolumeChart({
    token,
    timeUnit,
}: {
    token: IToken;
    timeUnit: ChartTimeUnitType;
}) {
    const { data } = useSWR<[number, number][]>(
        token.id
            ? `${ASHSWAP_CONFIG.ashApiBaseUrl}/token/${token.id}/graph-statistic?type=volume`
            : null,
        fetcher
    );
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
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={displayChartData}>
                <defs>
                    <linearGradient
                        id="TVC-colorUv"
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
                        id="TVC-pattern"
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
                            fill="url(#TVC-colorUv)"
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
                    domain={[0, (max: number) => max * 1.2]}
                    tickFormatter={(val: number) =>
                        formatAmount(val)
                    }
                    width={50}
                    tick={{ fill: "#B7B7D7", fontSize: sm ? 12 : 10 }}
                />
                <Bar
                    ref={barRef}
                    dataKey="value"
                    fill="url(#TVC-pattern)"
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
    );
}

export default TokenVolumeChart;
