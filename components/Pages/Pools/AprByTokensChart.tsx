import { randomHexColor } from "helper/color";
import { ValueOf } from "interface/utilities";
import moment from "moment";
import React, { useMemo, useState } from "react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import TokensSelectorForChart from "../components/TokensSelectorForChart";

interface IFeeByTokenData {
    name: number;
    [token: `token${number}`]: number;
}
const fakeData: IFeeByTokenData[] = new Array(30).fill("").map((val, index) => {
    const record: IFeeByTokenData = {
        name: moment("2022-01-02").add(index, "week").valueOf(),
        token0: Math.ceil(Math.random() * 95) + 5,
        token1: Math.ceil(Math.random() * 95) + 5,
        token2: Math.ceil(Math.random() * 95) + 5,
        token3: Math.ceil(Math.random() * 95) + 5,
        token4: Math.ceil(Math.random() * 95) + 5,
        token5: Math.ceil(Math.random() * 95) + 5,
        token6: Math.ceil(Math.random() * 95) + 5,
        token7: Math.ceil(Math.random() * 95) + 5,
    };
    return record;
});

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
function AprByTokensChart() {
    const [timeUnit, setTimeUnit] = useState<ValueOf<typeof TIME_UNIT>>("D");
    const themeColors = useMemo(() => {
        const nToken = Object.keys(fakeData[0]).length - 1;
        if (nToken <= colors.length) {
            return colors;
        } else {
            const result = [...colors];
            while (nToken > result.length) {
                result.unshift(randomHexColor());
            }
            return result;
        }
    }, []);
    const ticks = useMemo(() => {
        const temp = new Set<number>();
        fakeData.map((val) => {
            temp.add(moment(val.name).date(1).valueOf());
        });
        return Array.from(temp);
    }, []);
    return (
        <div
            className="bg-ash-dark-600 px-4 lg:px-[1.675rem] py-6 w-full overflow-hidden relative"
            style={{ boxShadow: "0px 50px 50px rgba(18, 16, 29, 0.5)" }}
        >
            <div className="h-[320px] sm:h-[200px] lg:h-[216px]">
                <ResponsiveContainer>
                    <LineChart width={500} height={300} data={fakeData}>
                        <XAxis
                            dataKey="name"
                            type="number"
                            axisLine={false}
                            tickLine={false}
                            interval="preserveStart"
                            domain={["minData", "maxData"]}
                            padding={{ right: 26 }}
                            stroke="#757391"
                            tickFormatter={(val) => months[moment(val).month()]}
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
                            tickFormatter={(val: number) => `${val.toFixed(0)}%`}
                            width={50}
                        />
                        {themeColors.map((color, index) => {
                            return (
                                <Line
                                    key={index}
                                    type="linear"
                                    dataKey={`token${index}`}
                                    stroke={color}
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
                <TokensSelectorForChart />
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

export default AprByTokensChart;
