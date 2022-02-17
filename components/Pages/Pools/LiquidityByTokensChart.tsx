import { TOKENS } from "const/tokens";
import { IToken } from "interface/token";
import Image from "next/image";
import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import TokensSelectorForChart from "../components/TokensSelectorForChart";

const data = [
    { name: "Group A", value: 400, token: TOKENS[0] },
    { name: "Group B", value: 300, token: TOKENS[1] },
    { name: "Group C", value: 300, token: TOKENS[2] },
    { name: "Group D", value: 200, token: TOKENS[3] },
];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const TokenLegend = ({ color, token }: { color: string; token: IToken }) => {
    return (
        <div className="flex items-center py-1.5">
            <div
                className="w-4 h-4 rounded-full mr-2.5 flex-shrink-0"
                style={{ backgroundColor: color }}
            ></div>
            <div
                className="font-bold text-sm w-9 text-right mr-9 flex-shrink-0"
                style={{ color }}
            >
                10%
            </div>
            <div className="mr-1 flex-shrink-0">
                <Image
                    src={token.icon}
                    alt={token.name}
                    width={11}
                    height={11}
                />
            </div>
            <div className="font-bold text-xs">{token.name}</div>
        </div>
    );
};
function LiquidityByTokensChart() {
    return (
        <div
            className="bg-ash-dark-600 px-4 lg:px-[1.675rem] py-6 w-full overflow-hidden relative"
            style={{ boxShadow: "0px 50px 50px rgba(18, 16, 29, 0.5)" }}
        >
            <div className="text-xs mb-6">Liquidity distribution by tokens</div>
            {/* flex-col space-y-11 lg:flex-row lg: */}
            <div className="flex flex-wrap items-center -mx-5.5">
                <div className="px-5.5 mb-8 flex-1 2xl:flex-initial">
                    <div className="w-40 h-40 mx-auto">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={data}
                                    innerRadius={60}
                                    outerRadius={80}
                                    stroke="transparent"
                                    dataKey="value"
                                    isAnimationActive={false}
                                >
                                    {data.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="px-5.5 mb-8 flex-1">
                    {/* w-full lg:w-auto  */}
                    <div className="h-40 overflow-x-hidden overflow-y-auto">
                        {data.map((entry, index) => (
                            <TokenLegend
                                key={index}
                                color={COLORS[index % COLORS.length]}
                                token={entry.token}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex h-9">
                <TokensSelectorForChart />
            </div>
        </div>
    );
}

export default LiquidityByTokensChart;
