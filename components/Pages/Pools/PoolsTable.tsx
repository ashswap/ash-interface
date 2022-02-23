import ICStarOutline from "assets/svg/star-outline.svg";
import ICArrowLeft from "assets/svg/arrow-left.svg";
import ICArrowRight from "assets/svg/arrow-right.svg";
import ICStar from "assets/svg/star.svg";
import pools from "const/pool";
import { abbreviateCurrency } from "helper/number";
import { useScreenSize } from "hooks/useScreenSize";
import IPool from "interface/pool";
import Image from "next/image";
import React, { useCallback, useMemo, useState } from "react";
const currencyFormater = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
});
type PoolRecord = {
    id: string;
    liquidity: number;
    apr: number;
    volume: number;
} & Partial<IPool>;
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
    const [token1, token2] = poolData?.tokens || [];
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
    const volumn = useMemo(() => {
        return format(poolData.volume);
    }, [format, poolData.volume]);
    const liquidity = useMemo(() => {
        return format(poolData.liquidity);
    }, [format, poolData.liquidity]);
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
                            src={token1?.icon || ""}
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
                <span className="text-white">{volumn}</span>
            </div>
            <div className="w-16 lg:w-24 xl:w-32 text-xs text-right">
                <span className="text-ash-gray-500">$</span>
                <span className="text-white">{liquidity}</span>
            </div>
            <div className="hidden md:block w-16 lg:w-24 xl:w-32 text-xs text-right text-white">{poolData.apr}%</div>
        </div>
    );
};
const displayTokens = [1,2,3]
function PoolsTable() {
    const [pageIndex, setPageIndex] = useState(0);

    return (
        <div className="flex flex-col space-y-[1px]">
            <div className="flex bg-ash-dark-600 px-4 lg:px-[1.625rem] text-ash-gray-500 space-x-2 text-2xs lg:text-xs">
                <div className="w-5 py-4"></div>
                <div className="w-5 py-4">#</div>
                <div className="flex-1 py-4 overflow-hidden">Token</div>
                <div className="w-16 lg:w-24 xl:w-32 text-right py-4">Volume 24H</div>
                <div className="w-16 lg:w-24 xl:w-32 text-right py-4">Liquidity</div>
                <div className="hidden md:block w-16 lg:w-24 xl:w-32 text-right py-4">APR</div>
            </div>
            {[1, 2, 3, 4, 5, 6].map((val) => {
                return (
                    <PoolRecord
                        key={val}
                        active={false}
                        order={val}
                        poolData={{
                            apr: 120,
                            id: val.toString(),
                            liquidity: 10000000.14,
                            volume: 200000000.2,
                            ...pools[0],
                        }}
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
    );
}

export default PoolsTable;
