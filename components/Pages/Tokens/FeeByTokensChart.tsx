import { Popover, Transition } from "@headlessui/react";
import ICArrowBottomRight from "assets/svg/arrow-bottom-right.svg";
import ICCheck from "assets/svg/check.svg";
import ICChevronDown from "assets/svg/chevron-down.svg";
import ICHexagonDuo from "assets/svg/hexagon-duo.svg";
import { abbreviateNumber } from "helper/number";
import { useScreenSize } from "hooks/useScreenSize";
import { IToken } from "interface/token";
import moment from "moment";
import React, { useMemo, useState } from "react";
import { usePopper } from "react-popper";
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
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
type ValueOf<T> = T[keyof T];
const TokenOption = ({
    token,
    checked,
    onChange,
}: {
    token?: IToken;
    checked: boolean;
    onChange: (val: boolean) => void;
}) => {
    return (
        <div>
            <div
                className="flex items-center justify-between px-4 py-2 text-xs"
                style={{ boxShadow: "0px 4px 50px rgba(0, 0, 0, 0.25);" }}
                onClick={() => onChange(!checked)}
            >
                <div className="flex items-center mr-3">
                    <div className="mr-3 lg:mr-6 relative flex items-center justify-center">
                        <ICHexagonDuo
                            className="w-6 h-6 "
                            fill="#F90060"
                            stroke="#FF005c"
                            fillOpacity={0.3}
                        />
                        <ICCheck
                            className={`absolute w-2.5 h-2.5 ${
                                checked ? "opacity-100" : "opacity-0"
                            }`}
                        />
                    </div>
                    <div className="bg-ash-blue-500 w-4 h-4 rounded-full mr-1.5"></div>
                    <div className="font-bold">USDT</div>
                </div>
                <div>
                    <span className="text-ash-gray-500">$&nbsp;</span>
                    <span>32m</span>
                </div>
            </div>
        </div>
    );
};
const TokensPopover = () => {
    const [referenceElement, setReferenceElement] = useState<any>();
    const [popperElement, setPopperElement] = useState<any>();
    const { styles, attributes } = usePopper(referenceElement, popperElement, {
        strategy: "fixed",
        // modifiers: [{ name: "offset", options: { offset: [0, 10] } }],
    });
    const tokens = [1, 2, 3, 4];
    const [selectedTokens, setSelectedTokens] = useState<number[]>([]);
    const onSelectChange = (val: boolean, token: number) => {
        let temp = [...selectedTokens];
        if (val) {
            temp.push(token);
        } else {
            temp = temp.filter((t) => t !== token);
        }
        setSelectedTokens(temp);
    };
    return (
        <Popover className="relative">
            <Popover.Button
                ref={setReferenceElement}
                className="w-48 lg:w-[16.5rem] h-full px-4 flex items-center justify-between text-xs bg-ash-dark-400"
            >
                <div className="text-ash-gray-500">Select token to view</div>
                <ICChevronDown className="inline-block w-3 h-3 text-pink-600" />
            </Popover.Button>

            <Popover.Panel
                ref={setPopperElement}
                style={styles.popper}
                {...attributes.popper}
                className="w-48 lg:w-[16.5rem] transition-none"
            >
                <Transition
                    enter="transition duration-200 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                >
                    <div className="bg-ash-dark-400 py-4">
                        {tokens.map((token) => {
                            return (
                                <TokenOption
                                    key={token}
                                    checked={selectedTokens.some(
                                        (val) => val === token
                                    )}
                                    onChange={(val) =>
                                        onSelectChange(val, token)
                                    }
                                />
                            );
                        })}
                    </div>
                </Transition>
            </Popover.Panel>
        </Popover>
    );
};
function FeeByTokensChart() {
    const screenSize = useScreenSize();
    const [timeUnit, setTimeUnit] = useState<ValueOf<typeof TIME_UNIT>>("D");
    const xAxisPr = useMemo(() => {
        const pr = screenSize?.xl
            ? 80
            : screenSize?.lg
            ? 20
            : 10;
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
        <div className="bg-ash-dark-600 px-4 lg:px-[1.675rem] py-6 w-full overflow-hidden relative">
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
                                "$ " + abbreviateNumber(val).toString()
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
                <TokensPopover />
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
