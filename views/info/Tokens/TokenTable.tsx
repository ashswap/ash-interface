import ICArrowLeft from "assets/svg/arrow-left.svg";
import ICArrowRight from "assets/svg/arrow-right.svg";
import ICStarOutline from "assets/svg/star-outline.svg";
import ICStar from "assets/svg/star.svg";
import { ENVIRONMENT } from "const/env";
import { IN_POOL_TOKENS } from "const/tokens";
import { fetcher } from "helper/common";
import { abbreviateCurrency, currencyFormater } from "helper/number";
import { useScreenSize } from "hooks/useScreenSize";
import { IToken } from "interface/token";
import Image from "next/image";
import React, { useCallback, useMemo, useState } from "react";
import useSWR from "swr";
type TokenRecord = {
    change_percentage_day: number;
    change_percentage_hour: number;
    change_percentage_week: number;
    liquidity: number;
    price: number;
    token_id: string;
    transaction_count: number;
    volume: number;
    // added from client
    token?: IToken;
};

const TokenRecord = ({
    active,
    order,
    tokenData,
}: {
    active?: boolean;
    order: number;
    tokenData: TokenRecord;
}) => {
    const screenSize = useScreenSize();
    const format = useCallback(
        (val: number) => {
            if (typeof val !== "number") return "";
            if (screenSize.xl) {
                return currencyFormater.format(val);
            }
            return abbreviateCurrency(val).toString().toUpperCase();
        },
        [screenSize]
    );
    const volume = useMemo(() => {
        return format(tokenData.volume);
    }, [format, tokenData]);
    const liquidity = useMemo(() => {
        return format(tokenData.liquidity);
    }, [format, tokenData]);
    const price = useMemo(() => {
        return format(tokenData.price);
    }, [format, tokenData]);
    return (
        // <Link href={`/info/tokens/${tokenData?.token_id}`}>
        //     <a>
        <div className="flex items-center bg-ash-dark-600 hover:bg-ash-dark-700 px-4 lg:px-[1.625rem] text-ash-gray-500 space-x-2 text-xs h-14 overflow-hidden">
            {/* <div
                className="w-5"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
            >
                {active ? (
                    <ICStar className="w-4 h-4 text-pink-600" />
                ) : (
                    <ICStarOutline className="w-4 h-4 text-ash-gray-500" />
                )}
            </div> */}
            <div className="w-5">{order}</div>
            <div className="w-20 md:w-28 lg:w-44 flex items-center justify-between overflow-hidden">
                <div className="flex items-center mr-2">
                    {/* <Image
                        src={tokenData?.token?.icon || ""}
                        alt="token"
                        width={24}
                        height={24}
                    /> */}
                    <div className="ml-2.5 font-bold text-sm">
                        {tokenData?.token?.name}
                    </div>
                </div>
                <div className="hidden lg:block text-2xs text-ash-gray-500 truncate">
                    {tokenData?.token?.name} Coin
                </div>
            </div>
            <div className="flex-1 overflow-hidden text-right">
                <span className="text-ash-gray-500">$</span>
                <span className="text-white">{volume}</span>
            </div>
            <div className="flex-1 overflow-hidden text-right">
                <span className="text-ash-gray-500">$</span>
                <span className="text-white">{liquidity}</span>
            </div>
            <div className="hidden md:block flex-1 overflow-hidden text-right">
                <span className="text-ash-gray-500">$</span>
                <span className="text-white">{price}</span>
            </div>
            {[
                tokenData.change_percentage_hour,
                tokenData.change_percentage_day,
                tokenData.change_percentage_week,
            ].map((val, index) => {
                return (
                    <div
                        key={index}
                        className={`hidden xl:block w-14 text-right ${
                            val >= 0
                                ? "text-ash-green-500"
                                : "text-ash-purple-500"
                        }`}
                    >
                        {val.toFixed(1)}%
                    </div>
                );
            })}
        </div>
        //     </a>
        // </Link>
    );
};
function TokenTable() {
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState<
        keyof Omit<TokenRecord, "token" | "token_id"> | "name"
    >("volume");
    const { data } = useSWR<TokenRecord[]>(
        ENVIRONMENT.ASH_API + "/token",
        fetcher
    );
    const tokenRecords: TokenRecord[] = useMemo(() => {
        if (!data) return [];
        return data.map((val) => {
            const token = IN_POOL_TOKENS.find((t) => t.id === val.token_id);
            const record: TokenRecord = { ...val, token };
            return record;
        });
    }, [data]);
    const sortedTokenRecords: TokenRecord[] = useMemo(() => {
        if (sortBy === "name") {
            return [...tokenRecords].sort((x, y) => {
                const strX = x?.token?.name || "";
                const strY = y?.token?.name || "";
                return strY > strX ? -1 : strX > strY ? 1 : 0;
            });
        }
        return [...tokenRecords].sort((x, y) => {
            return y[sortBy] - x[sortBy];
        });
    }, [tokenRecords, sortBy]);
    const displayTokens: TokenRecord[][] = useMemo(() => {
        const length = sortedTokenRecords.length;
        const nPage = Math.ceil(length / pageSize);
        const pagination: TokenRecord[][] = [];
        for (let i = 0; i < nPage; i++) {
            pagination.push(
                sortedTokenRecords.slice(i * pageSize, i * pageSize + pageSize)
            );
        }
        return pagination;
    }, [sortedTokenRecords, pageSize]);

    return (
        <div>
            <div className="w-full flex flex-col space-y-[1px]">
                <div className="flex bg-ash-dark-600 px-4 lg:px-[1.625rem] text-ash-gray-500 space-x-2 text-2xs lg:text-xs">
                    {/* <div className="w-5 py-4"></div> */}
                    <div className="w-5 py-4">#</div>
                    <div
                        className={`w-20 md:w-28 lg:w-44 py-4 cursor-pointer ${
                            sortBy === "name" && "text-white"
                        }`}
                        onClick={() => setSortBy("name")}
                    >
                        Token
                    </div>
                    <div
                        className={`flex-1 overflow-hidden text-right py-4 cursor-pointer ${
                            sortBy === "volume" && "text-white"
                        }`}
                        onClick={() => setSortBy("volume")}
                    >
                        Volume 24H
                    </div>
                    <div
                        className={`flex-1 overflow-hidden text-right py-4 cursor-pointer ${
                            sortBy === "liquidity" && "text-white"
                        }`}
                        onClick={() => setSortBy("liquidity")}
                    >
                        Liquidity
                    </div>
                    <div
                        className={`hidden md:block flex-1 overflow-hidden text-right py-4 cursor-pointer ${
                            sortBy === "price" && "text-white"
                        }`}
                        onClick={() => setSortBy("price")}
                    >
                        Price
                    </div>
                    <div
                        className={`hidden xl:block w-14 text-right py-4 cursor-pointer ${
                            sortBy === "change_percentage_hour" && "text-white"
                        }`}
                        onClick={() => setSortBy("change_percentage_hour")}
                    >
                        1H
                    </div>
                    <div
                        className={`hidden xl:block w-14 text-right py-4 cursor-pointer ${
                            sortBy === "change_percentage_day" && "text-white"
                        }`}
                        onClick={() => setSortBy("change_percentage_day")}
                    >
                        24H
                    </div>
                    <div
                        className={`hidden xl:block w-14 text-right py-4 cursor-pointer ${
                            sortBy === "change_percentage_week" && "text-white"
                        }`}
                        onClick={() => setSortBy("change_percentage_week")}
                    >
                        7D
                    </div>
                </div>
                {displayTokens[pageIndex]?.map((record, index) => {
                    return (
                        <TokenRecord
                            key={record.token_id}
                            order={pageIndex * pageSize + index + 1}
                            tokenData={record}
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
                            {displayTokens.length}
                        </span>
                    </div>
                    <button
                        className={`p-1 ${
                            pageIndex === displayTokens.length - 1
                                ? "text-white/20 pointer-events-none"
                                : "text-pink-600"
                        }`}
                        disabled={pageIndex === displayTokens.length - 1}
                        onClick={() => setPageIndex((i) => i + 1)}
                    >
                        <ICArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TokenTable;
