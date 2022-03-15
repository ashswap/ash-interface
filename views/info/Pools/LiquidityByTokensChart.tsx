import { network } from "const/network";
import pools from "const/pool";
import { IN_POOL_TOKENS } from "const/tokens";
import { randomHexColor } from "helper/color";
import { fetcher } from "helper/common";
import { IToken } from "interface/token";
import Image from "next/image";
import React, { useCallback, useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import useSWR from "swr";
import TokensSelectorForChart, {
    TokenOptionChart,
} from "../components/TokensSelectorForChart";

type RawChartRecord = {
    liquidity: number;
    // token id
    token: string;
};
type ChartRecord = {
    value: number;
    percent: number;
    token: IToken;
};
const COLORS = [
    "#EC223A",
    "#2502FD",
    "#00FFFF",
    "#FF4C8D",
    "#166BF7",
    "#14E499",
    "#FFC700",
    "#7B61FF",
    "#1EF026",
    "#F9A243",
];
const TokenLegend = ({
    color,
    token,
    percent,
}: {
    color: string;
    token: IToken;
    percent: number;
}) => {
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
                {percent}%
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
    const [selectedPools, setSelectedPools] = useState<Set<string>>(
        new Set(pools.map((p) => p.address))
    );
    const { data } = useSWR<RawChartRecord[]>(
        selectedPools.size > 0
            ? `${
                  network.ashApiBaseUrl
              }/pool/liquidity-distribution?pool=${Array.from(
                  selectedPools
              ).join(",")}`
            : null,
        fetcher
    );
    const chartData: ChartRecord[] = useMemo(() => {
        if (!data?.length) return [];
        const total = data.reduce((t, { liquidity }) => (t += liquidity), 0);
        let spct = 0;
        return data
            .map(({ liquidity, token: tokenId }, index) => {
                const pct = +((liquidity * 100) / total).toFixed(2);
                const record: ChartRecord = {
                    value: liquidity,
                    token: IN_POOL_TOKENS.find((t) => t.id === tokenId) as IToken,
                    percent:
                        index === data.length - 1
                            ? (100 * 1000 - spct * 1000) / 1000
                            : pct,
                };
                spct = (spct * 1000 + pct * 1000) / 1000;
                return record;
            })
            .sort((x, y) => y.percent - x.percent);
    }, [data]);
    const themeColors = useMemo(() => {
        const nToken = IN_POOL_TOKENS.length;
        if (nToken <= COLORS.length) {
            return COLORS;
        } else {
            const result = [...COLORS];
            while (nToken > result.length) {
                result.push(randomHexColor());
            }
            return result;
        }
    }, []);
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
            <div className="text-xs mb-6">Liquidity distribution by tokens</div>
            {/* flex-col space-y-11 lg:flex-row lg: */}
            <div className="flex flex-wrap items-center -mx-5.5">
                <div className="px-5.5 mb-8 flex-1 2xl:flex-initial">
                    <div className="w-40 h-40">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    stroke="transparent"
                                    dataKey="value"
                                    isAnimationActive={true}
                                >
                                    {chartData?.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={themeColors[index]}
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
                        {chartData?.map((entry, index) => (
                            <TokenLegend
                                key={index}
                                percent={entry.percent}
                                color={themeColors[index]}
                                token={entry.token}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex h-9">
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
                                label={p.tokens.map((t) => t.name).join("-")}
                                onChange={(val) => onSelectPool(val, p.address)}
                            />
                        );
                    })}
                </TokensSelectorForChart>
            </div>
        </div>
    );
}

export default LiquidityByTokensChart;
