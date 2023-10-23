import { ChartTimeUnitType, ValueChartRecord } from "interface/chart";
import moment from "moment";
import { useMemo } from "react";

export const useValueChart = (
    chartData: ValueChartRecord[],
    timeUnit: ChartTimeUnitType,
    mode: "avg" | "sum" | "highest" | "latest" | "accumulated" = "avg",
    maxRecords = 90
) => {
    const _displayChartData: ValueChartRecord[] = useMemo(() => {
        let result: ValueChartRecord[] = [];
        if (timeUnit === "D") result = chartData;
        else {
            const wMap: { [key: number]: ValueChartRecord[] } = {};
            chartData.map((val) => {
                // group by week or month to get the same key(timestamp)
                const unix = moment.unix(val.timestamp).utc();
                const w =
                    timeUnit === "W"
                        ? unix
                              .startOf("week")
                              .hour(0)
                              .minute(0)
                              .second(0)
                              .millisecond(0)
                              .unix()
                        : unix
                              .startOf("month")
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
            result = Object.keys(wMap).map((k) => {
                let value = wMap[+k].reduce((total, value) => {
                    return total + value.value;
                }, 0);
                switch (mode) {
                    case "highest":
                        value = wMap[+k].sort((a, b) => b.value - a.value)[0]
                            .value;
                        break;
                    case "latest":
                        value = wMap[+k][wMap[+k].length - 1].value;
                        break;
                    case "accumulated":
                        break;
                    case "sum":
                        break;
                    case "avg":
                    default:
                        value /= wMap[+k].length;
                }
                return {
                    timestamp: +k,
                    value,
                    range: [
                        wMap[+k][0].timestamp,
                        wMap[+k][wMap[+k].length - 1].timestamp,
                    ],
                };
            });
        }
        if (mode === "accumulated") {
            let acc = 0;
            return result.map((val, i) => {
                acc += result[i - 1]?.value || 0;
                return {
                    ...val,
                    value: acc + val.value,
                };
            });
        }
        return result;
    }, [chartData, timeUnit, mode]);
    // get displayed distinct Xaxis Tick value (timestamp)

    const displayChartData = useMemo(() => {
        if (typeof maxRecords === "number" && maxRecords > 0)
            return _displayChartData.slice(maxRecords * -1);
        return _displayChartData;
    }, [_displayChartData, maxRecords]);
    const timestampTicks = useMemo(() => {
        const temp = new Set<number>();
        displayChartData.map(({ timestamp }) => {
            if (timeUnit === "D") {
                temp.add(timestamp);
            } else {
                const time = moment.unix(timestamp).utc();
                temp.add(
                    timeUnit === "M"
                        ? time.startOf("month").unix()
                        : time.startOf("week").unix()
                );
            }
        });
        return Array.from(temp);
    }, [displayChartData, timeUnit]);
    return { displayChartData, timestampTicks };
};
