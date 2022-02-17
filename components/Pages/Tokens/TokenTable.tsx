import ICArrowLeft from "assets/svg/arrow-left.svg";
import ICArrowRight from "assets/svg/arrow-right.svg";
import ICStarOutline from "assets/svg/star-outline.svg";
import ICStar from "assets/svg/star.svg";
import { TOKENS } from "const/tokens";
import { abbreviateNumber } from "helper/number";
import { useScreenSize } from "hooks/useScreenSize";
import { IToken } from "interface/token";
import Image from "next/image";
import React, { useCallback, useMemo, useState } from "react";
import { FakeTokenTable } from "./fake";
type TokenRecord = {
    id: string;
    "1h": number;
    "24h": number;
    "7d": number;
    liquidity: number;
    price: number;
    volume: number;
} & Partial<IToken>;
const currencyFormater = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
});
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
            return abbreviateNumber(val).toString().toUpperCase();
        },
        [screenSize]
    );
    const volumn = useMemo(() => {
        return format(tokenData.volume);
    }, [format, tokenData]);
    const liquidity = useMemo(() => {
        return format(tokenData.liquidity);
    }, [format, tokenData]);
    const price = useMemo(() => {
        return format(tokenData.price);
    }, [format, tokenData]);
    return (
        <div className="flex items-center bg-ash-dark-600 px-4 lg:px-[1.625rem] text-ash-gray-500 space-x-2 text-xs h-14 overflow-hidden">
            <div className="w-5">
                {active ? (
                    <ICStar className="w-4 h-4 text-pink-600" />
                ) : (
                    <ICStarOutline className="w-4 h-4 text-ash-gray-500" />
                )}
            </div>
            <div className="w-5">{order}</div>
            <div className="w-20 md:w-28 lg:w-44 flex items-center justify-between overflow-hidden">
                <div className="flex items-center mr-2">
                    <Image
                        src={tokenData.icon || ""}
                        alt="token"
                        width={24}
                        height={24}
                    />
                    <div className="ml-2.5 font-bold text-sm">
                        {tokenData?.name}
                    </div>
                </div>
                <div className="hidden lg:block text-2xs text-ash-gray-500 truncate">
                    {tokenData?.name} Coin
                </div>
            </div>
            <div className="flex-1 overflow-hidden text-right">
                <span className="text-ash-gray-500">$</span>
                <span className="text-white">{volumn}</span>
            </div>
            <div className="flex-1 overflow-hidden text-right">
                <span className="text-ash-gray-500">$</span>
                <span className="text-white">{liquidity}</span>
            </div>
            <div className="hidden md:block flex-1 overflow-hidden text-right">
                <span className="text-ash-gray-500">$</span>
                <span className="text-white">{price}</span>
            </div>
            {[tokenData["1h"], tokenData["24h"], tokenData["7d"]].map(
                (val, index) => {
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
                }
            )}
        </div>
    );
};
function TokenTable() {
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const tokenRecords: TokenRecord[] = useMemo(() => {
        return FakeTokenTable.map((val) => {
            const token = TOKENS.find((t) => t.id === val.id);
            const record: TokenRecord = { ...val, ...token };
            return record;
        });
    }, []);
    const displayTokens: TokenRecord[][] = useMemo(() => {
        const length = tokenRecords.length;
        const nPage = Math.ceil(length / pageSize);
        const pagination: TokenRecord[][] = [];
        for (let i = 0; i < nPage; i++) {
            pagination.push(
                tokenRecords.slice(i * pageSize, i * pageSize + pageSize)
            );
        }
        return pagination;
    }, [tokenRecords, pageSize]);

    return (
        <div>
            <div className="w-full flex flex-col space-y-[1px]">
                <div className="flex bg-ash-dark-600 px-4 lg:px-[1.625rem] text-ash-gray-500 space-x-2 text-2xs lg:text-xs">
                    <div className="w-5 py-4"></div>
                    <div className="w-5 py-4">#</div>
                    <div className="w-20 md:w-28 lg:w-44 py-4">Token</div>
                    <div className="flex-1 overflow-hidden text-right py-4">
                        Volume 24H
                    </div>
                    <div className="flex-1 overflow-hidden text-right py-4">
                        Liquidity
                    </div>
                    <div className="hidden md:block flex-1 overflow-hidden text-right py-4">
                        Price
                    </div>
                    <div className="hidden xl:block w-14 text-right py-4">
                        1H
                    </div>
                    <div className="hidden xl:block w-14 text-right py-4">
                        24H
                    </div>
                    <div className="hidden xl:block w-14 text-right py-4">
                        7D
                    </div>
                </div>
                {displayTokens[pageIndex].map((record, index) => {
                    return (
                        <TokenRecord
                            key={record.id}
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
