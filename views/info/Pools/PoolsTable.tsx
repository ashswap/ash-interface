import ICArrowLeft from "assets/svg/arrow-left.svg";
import ICArrowRight from "assets/svg/arrow-right.svg";
import ICStarOutline from "assets/svg/star-outline.svg";
import ICStar from "assets/svg/star.svg";
import { network } from "const/network";
import pools from "const/pool";
import { fetcher } from "helper/common";
import { abbreviateCurrency } from "helper/number";
import { useScreenSize } from "hooks/useScreenSize";
import IPool from "interface/pool";
import Image from "next/image";
import React, { useCallback, useMemo, useState } from "react";
import useSWR from "swr";
const currencyFormater = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
});

type PoolRecord = {
    apr_day: number;
    apr_month: number;
    apr_week: number;
    emission_apr: number;
    pool_address: string;
    ratio: number;
    timestamp: number;
    token_1_amount: number;
    token_1_value_locked: number;
    token_2_amount: number;
    token_2_value_locked: number;
    total_value_locked: number;
    usd_volume: number;
    volume: number;
    // added from client
    pool?: IPool;
};
const PoolRecord = ({
    active,
    order,
    poolData,
}: {
    active: boolean;
    order: number;
    poolData: PoolRecord;
}) => {
    const screenSize = useScreenSize();
    const [token1, token2] = poolData?.pool?.tokens || [];
    const format = useCallback(
        (val: number) => {
            if (typeof val !== "number") return "";
            if (screenSize.xl) {
                return currencyFormater.format(val);
            }
            return abbreviateCurrency(val).toString().toUpperCase();
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
            <div className="w-16 lg:w-24 xl:w-32 text-xs text-right">
                <span className="text-ash-gray-500">$</span>
                <span className="text-white">{volume}</span>
            </div>
            <div className="w-16 lg:w-24 xl:w-32 text-xs text-right">
                <span className="text-ash-gray-500">$</span>
                <span className="text-white">{liquidity}</span>
            </div>
            <div className="hidden lg:block w-16 lg:w-24 xl:w-32 text-xs text-right text-white">
                {poolData.apr_day ? poolData.apr_day?.toLocaleString("en-US") : "_"}%
            </div>
            <div className="hidden lg:block w-16 lg:w-24 xl:w-32 text-xs text-right text-white">
                {poolData.emission_apr ? poolData.emission_apr.toLocaleString("en-US") : "_"}%
            </div>
        </div>
    );
};
function PoolsTable() {
    const { data } = useSWR<PoolRecord[]>(
        `${network.ashApiBaseUrl}/pool`,
        fetcher
    );
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState<
        "usd_volume" | "total_value_locked" | "apr_day" | "emission_apr"
    >("usd_volume");
    const poolRecords: PoolRecord[] = useMemo(() => {
        if (!data?.length) return [];
        return data.map((record) => {
            return {
                ...record,
                pool: pools.find((p) => p.address === record.pool_address),
            };
        });
    }, [data]);
    const sortedPoolRecords: PoolRecord[] = useMemo(() => {
        return [...poolRecords].sort((x, y) => {
            return y[sortBy] - x[sortBy];
        });
    }, [poolRecords, sortBy]);
    const displayPoolRecords: PoolRecord[][] = useMemo(() => {
        const length = sortedPoolRecords.length;
        const nPage = Math.ceil(length / pageSize);
        const pagination: PoolRecord[][] = [];
        for (let i = 0; i < nPage; i++) {
            pagination.push(
                sortedPoolRecords.slice(i * pageSize, i * pageSize + pageSize)
            );
        }
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
                    className={`hidden lg:block w-16 lg:w-24 xl:w-32 text-right py-4 cursor-pointer ${
                        sortBy === "apr_day" && "text-white"
                    }`}
                    onClick={() => setSortBy("apr_day")}
                >
                    Trading APR
                </div>
                <div
                    className={`hidden lg:block w-16 lg:w-24 xl:w-32 text-right py-4 cursor-pointer ${
                        sortBy === "emission_apr" && "text-white"
                    }`}
                    onClick={() => setSortBy("emission_apr")}
                >
                    Emission APR
                </div>
            </div>
            {displayPoolRecords[pageIndex]?.map((val, index) => {
                return (
                    <PoolRecord
                        key={val.pool_address}
                        active={false}
                        order={pageIndex * pageSize + index + 1}
                        poolData={val}
                    />
                );
            })}
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
        </div>
    );
}

export default PoolsTable;
