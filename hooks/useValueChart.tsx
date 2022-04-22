import { ChartTimeUnitType, ValueChartRecord } from "interface/chart";
import moment from "moment";
import { useMemo } from "react";

export const useValueChart = (
    chartData: ValueChartRecord[],
    timeUnit: ChartTimeUnitType
) => {
    const displayChartData: ValueChartRecord[] = useMemo(() => {
        if (timeUnit === "D") return chartData;
        const wMap: { [key: number]: ValueChartRecord[] } = {};
        chartData.map((val) => {
            // group by week or month to get the same key(timestamp)
            const unix = moment.unix(val.timestamp);
            const w =
                timeUnit === "W"
                    ? unix
                          .day(1)
                          .hour(0)
                          .minute(0)
                          .second(0)
                          .millisecond(0)
                          .unix()
                    : unix
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
        console.log(wMap);
        const avg: ValueChartRecord[] = Object.keys(wMap).map((k) => {
            const sum = wMap[+k].reduce((total, value) => {
                return total + value.value;
            }, 0);
            return {
                timestamp: +k,
                value: sum / wMap[+k].length,
                range: [
                    wMap[+k][0].timestamp,
                    wMap[+k][wMap[+k].length - 1].timestamp,
                ],
            };
        });
        return avg;
    }, [chartData, timeUnit]);
    // get displayed distinct Xaxis Tick value (timestamp)
    const timestampTicks = useMemo(() => {
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
    return { displayChartData, timestampTicks };
};
