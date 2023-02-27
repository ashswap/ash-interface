import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import { MONTH_SHORT } from "const/time";
import { fetcher } from "helper/common";
import { formatAmount } from "helper/number";
import { IESDTInfo } from "helper/token/token";
import { ChartTimeUnitType } from "interface/chart";
import moment from "moment";
import { useCallback, useMemo } from "react";
import {
    Bar,
    BarChart,
    Cell,
    ResponsiveContainer,
    XAxis,
    YAxis
} from "recharts";
import useSWR from "swr";
type CandleChartRecord = {
    high: number;
    low: number;
    open: number;
    close: number;
    timestamp: number;
};

const FAKE_DATA: CandleChartRecord[] = new Array(30)
    .fill("")
    .map((val, i) => {
        const high = Math.floor(Math.random() * 100000) + 2000;
        const low = high - Math.floor(Math.random() * 2000);
        return {
            high,
            low,
            open: high * (Math.random() + 0.1),
            close: high * (Math.random() + 0.1),
            timestamp: moment().subtract(i, "days").endOf("days").unix(),
        };
    })
    .reverse();

const prepareData = (data: CandleChartRecord[]) => {
    return data.map(({ open, close, ...other }) => {
        return {
            ...other,
            openClose: [open, close],
        };
    });
};
const Candlestick = ({
    stickLine,
    ...props
}: {
    stickLine?: boolean;
    [key: string]: any;
}) => {
    const {
        fill,
        x,
        y,
        width,
        height,
        low,
        high,
        openClose: [open, close],
    } = props;
    const isGrowing = open < close;
    const color = isGrowing ? "#00FF75" : "#7B61FF";
    const ratio = Math.abs(height / (open - close));
    return (
        <g stroke={color} fill={color} strokeWidth="2">
            <path
                d={`
            M ${x},${y}
            L ${x},${y + height}
            L ${x + width},${y + height}
            L ${x + width},${y}
            L ${x},${y}
          `}
            />
            {stickLine && (
                <>
                    {/* bottom line */}
                    {isGrowing ? (
                        <path
                            d={`
              M ${x + width / 2}, ${y + height}
              v ${(open - low) * ratio}
            `}
                        />
                    ) : (
                        <path
                            d={`
              M ${x + width / 2}, ${y}
              v ${(close - low) * ratio}
            `}
                        />
                    )}
                    {/* top line */}
                    {isGrowing ? (
                        <path
                            d={`
              M ${x + width / 2}, ${y}
              v ${(close - high) * ratio}
            `}
                        />
                    ) : (
                        <path
                            d={`
              M ${x + width / 2}, ${y + height}
              v ${(open - high) * ratio}
            `}
                        />
                    )}
                </>
            )}
        </g>
    );
};
const TokenPriceChart = ({
    token,
    timeUnit,
}: {
    token: IESDTInfo;
    timeUnit: ChartTimeUnitType;
}) => {
    const { data } = useSWR<[number, number][]>(
        token.identifier
            ? `${ASHSWAP_CONFIG.ashApiBaseUrl}/token/${token.identifier}/graph-statistic?type=price`
            : null,
        fetcher,
        { refreshInterval: 5 * 60 * 1000 }
    );
    const displayChartData = useMemo(() => {
        const raw = prepareData(FAKE_DATA);
        return raw;
    }, []);
    const minValue = useMemo(() => {
        return displayChartData.reduce(
            (minValue, { low, openClose: [open, close] }) => {
                return Math.min(low, open, close, minValue);
            },
            Number.POSITIVE_INFINITY
        );
    }, [displayChartData]);

    const maxValue = useMemo(() => {
        return displayChartData.reduce(
            (maxValue, { high, openClose: [open, close] }) => {
                return Math.max(high, open, close, maxValue);
            },
            minValue
        );
    }, [displayChartData, minValue]);

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
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                width={600}
                height={300}
                data={displayChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
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
                    tick={{ fill: "#B7B7D7", fontSize: 12 }}
                />
                <YAxis
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    padding={{ top: 20 }}
                    domain={[minValue, maxValue + (maxValue - minValue) * 0.2]}
                    tickFormatter={(val: number) => formatAmount(val)}
                    width={50}
                    tick={{ fill: "#B7B7D7", fontSize: 12 }}
                />
                <Bar
                    dataKey="openClose"
                    fill="#8884d8"
                    shape={<Candlestick />}
                    // label={{ position: 'top' }}
                >
                    {displayChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default TokenPriceChart;
