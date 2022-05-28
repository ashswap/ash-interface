import ICArrowBottomRight from "assets/svg/arrow-bottom-right.svg";
import { formatAmount } from "helper/number";
import { useScreenSize } from "hooks/useScreenSize";
import { ValueOf } from "interface/utilities";
import moment from "moment";
import React, { useMemo, useState } from "react";
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import TokensSelectorForChart from "../components/TokensSelectorForChart";
// prettier-ignore
interface IFeeByTokenData {
    name: number;
    [token: `token${number}`]: number;
}
const fakeData: IFeeByTokenData[] = new Array(30).fill("").map((val, index) => {
    const record: IFeeByTokenData = {
        name: moment("2022-01-02").add(index, "week").valueOf(),
        token0: Math.ceil(Math.random() * 1000) + 2000,
        token1: Math.ceil(Math.random() * 1000) + 2000,
        token2: Math.ceil(Math.random() * 1000) + 2000,
        token3: Math.ceil(Math.random() * 1000) + 2000,
    };
    return record;
});
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
const colors = ["#2502FD4D", "#166BF7", "#00FFFF", "#7B61FF"];
const TIME_UNIT = {
    DAY: "D",
    WEEK: "W",
    MONTH: "M",
} as const;

function FeeByTokensChart() {
    const screenSize = useScreenSize();
    const [timeUnit, setTimeUnit] = useState<ValueOf<typeof TIME_UNIT>>("D");
    const xAxisPr = useMemo(() => {
        const pr = screenSize?.xl ? 80 : screenSize?.lg ? 20 : 10;
        return pr;
    }, [screenSize]);
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
            <div className="h-[320px] sm:h-[200px] lg:h-[370px]">
                <ResponsiveContainer>
                    <BarChart data={fakeData}>
                        <XAxis
                            dataKey="name"
                            type="number"
                            tickLine={false}
                            axisLine={false}
                            domain={["minData", "maxData"]}
                            interval="preserveStart"
                            tickFormatter={(val) => months[moment(val).month()]}
                            ticks={ticks}
                            padding={{ right: xAxisPr }}
                            tick={{ fontSize: "12px" }}
                        />
                        <YAxis
                            orientation="right"
                            tickLine={false}
                            axisLine={false}
                            domain={["minData", (max: number) => max * 1.5]}
                            tickFormatter={(val) =>
                                "$ " + formatAmount(val)
                            }
                            width={50}
                            tick={{ fontSize: "12px" }}
                        />
                        <Tooltip
                            cursor={false}
                            content={(e) => {
                                return "";
                            }}
                        />
                        {colors.map((color, index) => {
                            if (fakeData?.[0]?.[`token${index}`] > 0) {
                                return (
                                    <Bar
                                        key={index}
                                        dataKey={`token${index}`}
                                        stackId="a"
                                        fill={color}
                                    />
                                );
                            }
                        })}
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="absolute top-6 left-[1.675rem]">
                <div className="text-xs mb-2">
                    <span>Fees by Token </span>
                    <span className="text-ash-gray-500">
                        24 Sep - 1 Oct, 2021{" "}
                    </span>
                </div>
                <div className="flex items-start">
                    <div className="text-lg mr-2">
                        <span className="text-ash-gray-500">$</span>
                        <span>6b</span>
                    </div>
                    <div className="text-ash-purple-500 font-bold text-xs">
                        <ICArrowBottomRight className="inline-block w-2.5 h-2.5 mr-1" />
                        <span>-19%</span>
                    </div>
                </div>
            </div>
            <div className="flex space-x-2 text-xs">
                {/* <TokensSelectorForChart /> */}
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

export default FeeByTokensChart;
