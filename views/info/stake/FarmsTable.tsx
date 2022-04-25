import ICArrowLeft from "assets/svg/arrow-left.svg";
import ICArrowRight from "assets/svg/arrow-right.svg";
import ICStarOutline from "assets/svg/star-outline.svg";
import ICStar from "assets/svg/star.svg";
import { FARMS } from "const/farms";
import pools from "const/pool";
import { fetcher } from "helper/common";
import { abbreviateCurrency, formatAmount } from "helper/number";
import { useScreenSize } from "hooks/useScreenSize";
import { IFarm } from "interface/farm";
import { FarmStatsRecord } from "interface/farmStats";
import IPool from "interface/pool";
import { PoolStatsRecord } from "interface/poolStats";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useMemo, useState } from "react";
import useSWR from "swr";
const currencyFormater = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
});

type FarmWithStatsRecords = FarmStatsRecord & { pool?: IPool; farm?: IFarm };
const FarmRecord = ({
    order,
    farmData,
}: {
    order: number;
    farmData: FarmWithStatsRecords;
}) => {
    const [token1, token2] = farmData?.pool?.tokens || [];
    const format = useCallback((val: number) => {
        if (typeof val !== "number") return "";
        return formatAmount(val)?.toUpperCase() || "";
    }, []);
    const liquidity = useMemo(() => {
        return format(farmData.total_value_locked);
    }, [format, farmData.total_value_locked]);
    return (
        <Link href={`/info/stake/farms/${farmData.farm_address}`}>
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
                            <div className="flex-shrink-0 flex">
                                <div className="w-4 h-4 lg:w-6 lg:h-6">
                                    <Image
                                        src={token1?.icon || ""}
                                        alt="token"
                                        width={24}
                                        height={24}
                                    />
                                </div>
                                <div className="w-4 h-4 lg:w-6 lg:h-6 -ml-1">
                                    <Image
                                        src={token2?.icon || ""}
                                        alt="token"
                                        width={24}
                                        height={24}
                                    />
                                </div>
                            </div>
                            <div className="ml-2 lg:ml-4 font-bold text-xs lg:text-sm text-white truncate">
                                {token1?.name} & {token2?.name}
                            </div>
                        </div>
                    </div>
                    <div className="w-20 sm:flex-1 text-xs text-right">
                        <span className="text-ash-gray-500">$</span>
                        <span className="text-white">{liquidity}</span>
                    </div>
                    <div className="w-20 md:flex-1 text-xs text-right text-white">
                        {farmData?.emission_apr
                            ? formatAmount(farmData.emission_apr)
                            : "0"}
                        %
                    </div>
                </div>
            </a>
        </Link>
    );
};
function FarmsTable({
    data,
    hidePaging,
}: {
    data: FarmStatsRecord[];
    hidePaging?: boolean;
}) {
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState<"emission_apr" | "total_value_locked">(
        "total_value_locked"
    );
    const farmRecords: FarmWithStatsRecords[] = useMemo(() => {
        if (!data?.length) return [];
        return data.map((record) => {
            return {
                ...record,
                pool: pools.find((p) => p.address === record.pool_address),
                farm: FARMS.find((f) => f.farm_address === record.farm_address),
            };
        });
    }, [data]);
    const sortedPoolRecords: FarmWithStatsRecords[] = useMemo(() => {
        return [...farmRecords].sort((x, y) => {
            return y[sortBy] - x[sortBy];
        });
    }, [farmRecords, sortBy]);
    const displayPoolRecords: FarmWithStatsRecords[][] = useMemo(() => {
        const length = sortedPoolRecords.length;
        const nPage = Math.ceil(length / pageSize);
        const pagination: FarmWithStatsRecords[][] = [];
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
                    className={`w-20 sm:flex-1 text-right py-4 cursor-pointer ${
                        sortBy === "total_value_locked" && "text-white"
                    }`}
                    onClick={() => setSortBy("total_value_locked")}
                >
                    Liquidity
                </div>
                <div
                    className={`w-20 md:flex-1 text-right py-4 cursor-pointer ${
                        sortBy === "emission_apr" && "text-white"
                    }`}
                    onClick={() => setSortBy("emission_apr")}
                >
                    Emission APR
                </div>
            </div>
            {displayPoolRecords[pageIndex]?.map((val, index) => {
                return (
                    <FarmRecord
                        key={val.pool_address}
                        order={pageIndex * pageSize + index + 1}
                        farmData={val}
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

export default FarmsTable;
