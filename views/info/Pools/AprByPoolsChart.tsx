import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import pools from "const/pool";
import { randomHexColor } from "helper/color";
import { fetcher } from "helper/common";
import { ValueOf } from "interface/utilities";
import moment from "moment";
import React, { useCallback, useMemo, useState } from "react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import useSWR from "swr";
import TokensSelectorForChart, {
    TokenOptionChart,
} from "../components/TokensSelectorForChart";

interface IAPRByPoolData {
    timestamp: number;
    [token: `token${number}`]: number;
}
const colors = ["#2502FD4D", "#166BF7", "#00FFFF", "#7B61FF"];
const TIME_UNIT = {
    DAY: "D",
    WEEK: "W",
    MONTH: "M",
} as const;
const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Otc",
    "Nov",
    "Dec",
];
type RawChartRecord = {
    address: string;
    apr: number[][];
};
function AprByPoolsChart() {
    // default select the first pool
    const [selectedPools, setSelectedPools] = useState<Set<string>>(
        new Set([pools[0].address])
    );
    const { data } = useSWR<RawChartRecord[]>(
        selectedPools.size > 0
            ? `${ASHSWAP_CONFIG.ashApiBaseUrl}/pool/apr?pool=${Array.from(
                  selectedPools
              ).join(",")}`
            : null,
        fetcher
    );
    const [timeUnit, setTimeUnit] = useState<ValueOf<typeof TIME_UNIT>>("D");
    const themeColors = useMemo(() => {
        const nPool = pools.length;
        if (nPool <= colors.length) {
            return colors;
        } else {
            const result = [...colors];
            while (nPool > result.length) {
                result.unshift(randomHexColor());
            }
            return result;
        }
    }, []);
    // convert data to chartData format
    const chartData: IAPRByPoolData[] = useMemo(() => {
        const len = data?.length;
        if (!len) return [];
        const records: IAPRByPoolData[] = [];
        const nodeLength = data[0].apr.length;
        for (let i = 0; i < nodeLength; i++) {
            const record: IAPRByPoolData = { timestamp: data[0].apr[i][0] };
            for (let j = 0; j < len; j++) {
                const aprVal = data[j].apr[i][1];
                record[`token${j}`] = aprVal > 0 ? aprVal : 0;
            }
            records.push(record);
        }
        return records;
    }, [data]);
    // group data by timeUnit
    const displayChartData: IAPRByPoolData[] = useMemo(() => {
        if (timeUnit === "D") return chartData;
        const wMap: { [key: number]: IAPRByPoolData[] } = {};
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
                wMap[w].push(val);
            } else {
                wMap[w] = [val];
            }
        });
        const sum = Object.keys(wMap).map((k) => {
            return wMap[+k].reduce(
                (total: IAPRByPoolData, record) => {
                    data?.map((d, index) => {
                        total[`token${index}`] =
                            (total[`token${index}`] || 0) +
                            record[`token${index}`];
                    });
                    return total;
                },
                { timestamp: +k }
            );
        });
        const avg = sum
            .map((val) => {
                const sRecord: IAPRByPoolData = { timestamp: val.timestamp };
                data?.map((d, index) => {
                    sRecord[`token${index}`] = +(
                        val[`token${index}`] / wMap[val.timestamp].length
                    ).toFixed(2);
                });
                return sRecord;
            })
            .sort((x, y) => x.timestamp - y.timestamp);
        return avg;
    }, [chartData, timeUnit, data]);
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
                ? months[time.month()]
                : "week " + time.week();
        },
        [timeUnit]
    );
    const onSelectPool = useCallback((select: boolean, address: string) => {
        setSelectedPools((set) => {
            if (select) {
                set.add(address);
            } else {
                set.delete(address);
            }
            return new Set(set);
        });
    }, []);
    return (
        <div
            className="bg-ash-dark-600 px-4 lg:px-[1.675rem] py-6 w-full overflow-hidden relative"
            style={{ boxShadow: "0px 50px 50px rgba(18, 16, 29, 0.5)" }}
        >
            <div className="h-[320px] sm:h-[200px] lg:h-[216px]">
                <ResponsiveContainer>
                    <LineChart width={500} height={300} data={displayChartData}>
                        <XAxis
                            dataKey="timestamp"
                            type="number"
                            axisLine={false}
                            tickLine={false}
                            interval="preserveStart"
                            domain={["minData", "maxData"]}
                            padding={{ right: 26 }}
                            stroke="#757391"
                            tickFormatter={tickFormatter}
                            ticks={ticks}
                            tick={{ fontSize: "12px" }}
                        />
                        <YAxis
                            orientation="right"
                            axisLine={false}
                            tickLine={false}
                            stroke="#757391"
                            padding={{ bottom: 10 }}
                            domain={[0, (max: number) => max * 1.1]}
                            tick={{ fontSize: "12px" }}
                            tickFormatter={(val: number) =>
                                `${val.toFixed(0)}%`
                            }
                            width={50}
                        />
                        {data?.map(({ address }, index) => {
                            return (
                                <Line
                                    key={index}
                                    type="linear"
                                    dataKey={`token${index}`}
                                    stroke={
                                        themeColors[
                                            pools.findIndex(
                                                (p) => p.address === address
                                            )
                                        ]
                                    }
                                    dot={false}
                                />
                            );
                        })}
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="absolute top-6 left-[1.675rem]">
                <div className="text-xs">APR change by time</div>
            </div>
            <div className="flex space-x-2 text-xs mt-4">
                <TokensSelectorForChart
                    label={
                        selectedPools.size !== 0
                            ? `${selectedPools.size} pools selected`
                            : "Select pools to view"
                    }
                >
                    {pools.map((p, i) => {
                        return (
                            <TokenOptionChart
                                key={p.address}
                                pool={p}
                                checked={selectedPools.has(p.address)}
                                color={themeColors[i]}
                                label={p.tokens.map((t) => t.symbol).join("-")}
                                onChange={(val) => onSelectPool(val, p.address)}
                            />
                        );
                    })}
                </TokensSelectorForChart>
                <button
                    className={`w-9 h-9 bg-ash-dark-400 ${
                        timeUnit === TIME_UNIT.DAY
                            ? "text-white"
                            : "text-ash-gray-500"
                    }`}
                    onClick={() => setTimeUnit(TIME_UNIT.DAY)}
                >
                    D
                </button>
                <button
                    className={`w-9 h-9 bg-ash-dark-400 ${
                        timeUnit === TIME_UNIT.WEEK
                            ? "text-white"
                            : "text-ash-gray-500"
                    }`}
                    onClick={() => setTimeUnit(TIME_UNIT.WEEK)}
                >
                    W
                </button>
                <button
                    className={`w-9 h-9 bg-ash-dark-400 ${
                        timeUnit === TIME_UNIT.MONTH
                            ? "text-white"
                            : "text-ash-gray-500"
                    }`}
                    onClick={() => setTimeUnit(TIME_UNIT.MONTH)}
                >
                    M
                </button>
            </div>
        </div>
    );
}

export default AprByPoolsChart;
