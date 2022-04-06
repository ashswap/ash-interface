import { ChartTimeUnitType, ValueChartRecord } from "interface/chart";
import moment from "moment";
import { useMemo } from "react";

export const useValueChart = (
    chartData: ValueChartRecord[],
    timeUnit: ChartTimeUnitType
) => {
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
