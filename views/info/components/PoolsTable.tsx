import ICArrowLeft from "assets/svg/arrow-left.svg";
import ICArrowRight from "assets/svg/arrow-right.svg";
import Avatar from "components/Avatar";
import pools from "const/pool";
import { formatAmount } from "helper/number";
import { useScreenSize } from "hooks/useScreenSize";
import IPool from "interface/pool";
import { PoolStatsRecord } from "interface/poolStats";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
const currencyFormater = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
});

type PoolWithStatsRecords = PoolStatsRecord & { pool?: IPool };
const PoolRecord = ({
    order,
    poolData,
}: {
    order: number;
    poolData: PoolWithStatsRecords;
}) => {
    const screenSize = useScreenSize();
    const [token1, token2] = poolData?.pool?.tokens || [];
    const format = useCallback(
        (val: number) => {
            if (typeof val !== "number") return "";
            if (screenSize.xl) {
                return currencyFormater.format(val);
            }
            return formatAmount(val);
        },
        [screenSize.xl]
    );
    const volume = useMemo(() => {
        return format(poolData.usd_volume);
    }, [format, poolData.usd_volume]);
    const liquidity = useMemo(() => {
        return format(poolData.total_value_locked);
    }, [format, poolData.total_value_locked]);
    return (
        <Link href={`/info/pools/${poolData.pool_address}`}>
            <a>
                <div className="flex items-center bg-ash-dark-600 hover:bg-ash-dark-700 px-4 lg:px-[1.625rem] text-ash-gray-500 space-x-2 text-xs h-14 overflow-hidden">
                    {/* <div className="w-5">
                {active ? (
                    <ICStar className="w-4 h-4 text-pink-600" />
                ) : (
                    <ICStarOutline className="w-4 h-4 text-ash-gray-500" />
                )}
            </div> */}
                    <div className="w-5">{order}</div>
                    <div className="flex-1 overflow-hidden">
                        <div className="flex items-center mr-2 overflow-hidden">
                            <div className="shrink-0 flex">
                                <Avatar
                                    src={token1?.icon || ""}
                                    alt={token1?.symbol}
                                    className="w-4 h-4 lg:w-6 lg:h-6"
                                />
                                <Avatar
                                    src={token2?.icon || ""}
                                    alt={token2?.symbol}
                                    className="w-4 h-4 lg:w-6 lg:h-6 -ml-1"
                                />
                            </div>
                            <div className="ml-2 lg:ml-4 font-bold text-xs lg:text-sm text-white truncate">
                                {token1?.symbol} & {token2?.symbol}
                            </div>
                        </div>
                    </div>
                    <div className="w-16 lg:w-24 xl:w-32 text-xs text-right">
                        <span className="text-ash-gray-500">$</span>
                        <span className="text-white">{volume}</span>
                    </div>
                    <div className="w-16 lg:w-24 xl:w-32 text-xs text-right">
                        <span className="text-ash-gray-500">$</span>
                        <span className="text-white">{liquidity}</span>
                    </div>
                    <div className="hidden md:block w-16 lg:w-24 xl:w-32 text-xs text-right text-white">
                        {formatAmount(poolData.apr_day || 0, {
                            notation: "standard",
                        })}
                        %
                    </div>
                </div>
            </a>
        </Link>
    );
};
function PoolsTable({
    data,
    hidePaging,
}: {
    data: PoolStatsRecord[];
    hidePaging?: boolean;
}) {
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState<
        "usd_volume" | "total_value_locked" | "apr_day"
    >("usd_volume");
    const poolRecords: PoolWithStatsRecords[] = useMemo(() => {
        if (!data?.length) return [];
        return data.map((record) => {
            return {
                ...record,
                pool: pools.find((p) => p.address === record.pool_address),
            };
        });
    }, [data]);
    const sortedPoolRecords: PoolWithStatsRecords[] = useMemo(() => {
        return [...poolRecords].sort((x, y) => {
            return y[sortBy] - x[sortBy];
        });
    }, [poolRecords, sortBy]);
    const displayPoolRecords: PoolWithStatsRecords[][] = useMemo(() => {
        const length = sortedPoolRecords.length;
        const nPage = Math.ceil(length / pageSize);
        const pagination: PoolWithStatsRecords[][] = [];
        for (let i = 0; i < nPage; i++) {
            pagination.push(
                sortedPoolRecords.slice(i * pageSize, i * pageSize + pageSize)
            );
        }
        setPageIndex((val) => (pagination.length < val + 1 ? 0 : val));
        return pagination;
    }, [sortedPoolRecords, pageSize]);

    return (
        <div className="flex flex-col space-y-[1px]">
            <div className="flex bg-ash-dark-600 px-4 lg:px-[1.625rem] text-ash-gray-500 space-x-2 text-2xs lg:text-xs">
                {/* <div className="w-5 py-4"></div> */}
                <div className="w-5 py-4">#</div>
                <div className="flex-1 py-4 overflow-hidden">Token</div>
                <div
                    className={`w-16 lg:w-24 xl:w-32 text-right py-4 cursor-pointer ${
                        sortBy === "usd_volume" && "text-white"
                    }`}
                    onClick={() => setSortBy("usd_volume")}
                >
                    Volume 24H
                </div>
                <div
                    className={`w-16 lg:w-24 xl:w-32 text-right py-4 cursor-pointer ${
                        sortBy === "total_value_locked" && "text-white"
                    }`}
                    onClick={() => setSortBy("total_value_locked")}
                >
                    Liquidity
                </div>
                <div
                    className={`hidden md:block w-16 lg:w-24 xl:w-32 text-right py-4 cursor-pointer ${
                        sortBy === "apr_day" && "text-white"
                    }`}
                    onClick={() => setSortBy("apr_day")}
                >
                    Trading APR
                </div>
            </div>
            {displayPoolRecords[pageIndex]?.map((val, index) => {
                return (
                    <PoolRecord
                        key={val.pool_address}
                        order={pageIndex * pageSize + index + 1}
                        poolData={val}
                    />
                );
            })}
            {!hidePaging && (
                <div className="bg-ash-dark-600 h-14 flex items-center justify-center text-xs">
                    <button
                        className={`p-1 ${
                            pageIndex === 0
                                ? "text-white/20 pointer-events-none"
                                : "text-pink-600"
                        }`}
                        disabled={pageIndex === 0}
                        onClick={() => setPageIndex((i) => i - 1)}
                    >
                        <ICArrowLeft className="w-4 h-4" />
                    </button>
                    <div className="px-6">
                        <span className="text-white">{pageIndex + 1}</span>
                        <span className="text-ash-gray-500">/</span>
                        <span className="text-ash-gray-500">
                            {displayPoolRecords.length}
                        </span>
                    </div>
                    <button
                        className={`p-1 ${
                            pageIndex === displayPoolRecords.length - 1
                                ? "text-white/20 pointer-events-none"
                                : "text-pink-600"
                        }`}
                        disabled={pageIndex === displayPoolRecords.length - 1}
                        onClick={() => setPageIndex((i) => i + 1)}
                    >
                        <ICArrowRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}

export default PoolsTable;
