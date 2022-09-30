import BigNumber from "bignumber.js";
import Avatar from "components/Avatar";
import { ASHSWAP_CONFIG } from "const/ashswapConfig";
import pools, { IN_POOL_TOKENS } from "const/pool";
import { randomHexColor } from "helper/color";
import { fetcher } from "helper/common";
import { IESDTInfo } from "helper/token/token";
import { useCallback, useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import useSWR from "swr";
import TokensSelectorForChart, {
    TokenOptionChart
} from "../components/TokensSelectorForChart";

type RawChartRecord = {
    liquidity: number;
    // token id
    token: string;
};
type ChartRecord = {
    value: number;
    percent: number;
    token: IESDTInfo;
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
    token: IESDTInfo;
    percent: number;
}) => {
    return (
        <div className="flex items-center py-1.5">
            <div
                className="w-4 h-4 rounded-full mr-2.5 shrink-0"
                style={{ backgroundColor: color }}
            ></div>
            <div
                className="font-bold text-sm w-9 text-right mr-9 shrink-0"
                style={{ color }}
            >
                {percent}%
            </div>
            <Avatar
                src={token.logoURI}
                alt={token.symbol}
                className="w-3 h-3 mr-1 shrink-0"
            />
            <div className="font-bold text-xs">{token.symbol}</div>
        </div>
    );
};
const ashPools = pools.filter((p) => !p.isMaiarPool);
function LiquidityByTokensChart() {
    const [selectedPools, setSelectedPools] = useState<Set<string>>(
        new Set(ashPools.map((p) => p.address))
    );
    const { data } = useSWR<RawChartRecord[]>(
        selectedPools.size > 0
            ? `${
                  ASHSWAP_CONFIG.ashApiBaseUrl
              }/pool/liquidity-distribution?pool=${Array.from(
                  selectedPools
              ).join(",")}`
            : null,
        fetcher
    );
    const chartData: ChartRecord[] = useMemo(() => {
        if (!data?.length) return [];
        const total = data.reduce((t, { liquidity }) => (t += liquidity), 0);
        let spct = new BigNumber(0);
        return data
            .map(({ liquidity, token: tokenId }, index) => {
                const pct = +((liquidity * 100) / total).toFixed(2);
                const record: ChartRecord = {
                    value: liquidity,
                    token: IN_POOL_TOKENS.find(
                        (t) => t.identifier === tokenId
                    ) as IESDTInfo,
                    percent:
                        index === data.length - 1
                            ? new BigNumber(100).minus(spct).toNumber()
                            : pct,
                };
                spct = spct.plus(pct);
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
                    {ashPools.map((p, i) => {
                        return (
                            <TokenOptionChart
                                key={p.address}
                                pool={p}
                                checked={selectedPools.has(p.address)}
                                label={p.tokens.map((t) => t.symbol).join("-")}
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
