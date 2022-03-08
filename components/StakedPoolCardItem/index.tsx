import { PoolsState } from "context/pools";
import { toEGLD } from "helper/balance";
import { Unarray } from "interface/utilities";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import Button from "components/Button";
import { theme } from "tailwind.config";
import AddLiquidityModal from "components/AddLiquidityModal";
import RemoveLiquidityModal from "components/RemoveLiquidityModal";
import Down from "assets/svg/down-white.svg";
import ICPlus from "assets/svg/plus.svg";
import ICMinus from "assets/svg/minus.svg";
import ICChevronDown from "assets/svg/chevron-down.svg";
import ICChevronUp from "assets/svg/chevron-up.svg";

function StakedPoolCardItem({
    poolData,
}: {
    poolData: Unarray<PoolsState["poolToDisplay"]>;
}) {
    const { pool, poolStats, stakedData } = poolData;
    const [isExpand, setIsExpand] = useState<boolean>(false);
    const [openAddLiquidity, setOpenAddLiquidity] = useState<boolean>(false);
    const [openRemoveLiquidity, setOpenRemoveLiquidity] =
        useState<boolean>(false);
    if (!stakedData) return null;
    return (
        <div
            className={`bg-ash-dark-700 clip-corner-4 clip-corner-tr pt-8 pb-5 px-11 text-white`}
        >
            <div className="flex flex-row pb-9 border-b border-dashed border-ash-gray-500">
                <div className="mr-5">
                    <div className="mt-5 mb-8">
                        <div className="text-2xl font-bold text-white">
                            {pool.tokens[0].name}
                        </div>
                        <div className="text-earn font-bold text-lg leading-tight">
                            {toEGLD(
                                pool.tokens[0],
                                stakedData.value0.toString()
                            )
                                .toNumber()
                                .toLocaleString("en-US")}
                        </div>
                    </div>
                    <div className="mb-8">
                        <div className="text-2xl font-bold text-white">
                            {pool.tokens[1].name}
                        </div>
                        <div className="text-earn font-bold text-lg leading-tight">
                            {toEGLD(
                                pool.tokens[1],
                                stakedData.value1.toString()
                            )
                                .toNumber()
                                .toLocaleString("en-US")}
                        </div>
                    </div>
                    <div className="flex">
                        <button
                            className="clip-corner-1 clip-corner-bl bg-ash-dark-400 w-14 h-14 flex items-center justify-center text-pink-600 mr-0.5"
                            onClick={() => setOpenAddLiquidity(true)}
                        >
                            <ICPlus />
                        </button>
                        <button
                            className="clip-corner-1 clip-corner-br bg-ash-dark-400 w-14 h-14 flex items-center justify-center text-yellow-600"
                            onClick={() => setOpenRemoveLiquidity(true)}
                        >
                            <ICMinus />
                        </button>
                    </div>
                </div>
                <div className="flex-grow flex flex-col justify-end relative">
                    <div className="absolute top-0 right-0 flex flex-row justify-between items-center">
                        <div className="w-[3.25rem]">
                            <Image src={pool.tokens[0].icon} alt="token icon" />
                        </div>
                        <div className="w-[3.25rem] -ml-2.5">
                            <Image src={pool.tokens[1].icon} alt="token icon" />
                        </div>
                    </div>
                    <div className="mb-8">
                        <div className="text-ash-gray-500 text-xs underline mb-4">
                            Estimate in USD
                        </div>
                        <div className="text-lg leading-tight">
                            <span className="text-ash-gray-500">$</span>
                            <span className="text-white font-bold">
                                {stakedData.lpValueUsd
                                    .toNumber()
                                    .toLocaleString("en-US")}
                            </span>
                        </div>
                    </div>
                    <div>
                        <div className="text-ash-gray-500 text-xs underline mb-4">
                            Your capacity
                        </div>
                        <div className="text-lg text-white font-bold leading-snug">
                            {stakedData.capacityPercent.lt(0.01)
                                ? "< 0.01"
                                : stakedData.capacityPercent.toFixed(2)}
                            %
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-row mt-8 justify-between items-center">
                <div className="mr-1">
                    <div className="text-ash-gray-500 text-xs mb-4 underline">
                        Total Farm
                    </div>
                    <div className="text-earn font-bold text-lg">
                        Comming
                    </div>
                </div>
                <button className="clip-corner-1 clip-corner-br bg-earn w-40 h-14 flex items-center justify-center text-white text-sm font-bold">
                    Harvest
                </button>
            </div>

            <div className="bg-bg my-4 text-text-input-3">
                {isExpand && (
                    <>
                        <div className="flex flex-row justify-between items-center h-12 px-4">
                            <div className="underline text-2xs">
                                Total Liquidity
                            </div>
                            <div className="text-sm">
                                $
                                {poolStats?.total_value_locked?.toLocaleString(
                                    "en-US"
                                )}
                            </div>
                        </div>
                        <div className="flex flex-row justify-between items-center h-12 px-4">
                            <div className="underline text-2xs">24H Volume</div>
                            <div className="text-sm">
                                ${poolStats?.usd_volume?.toLocaleString("en-US")}
                            </div>
                        </div>
                        <div className="flex flex-row justify-between items-center h-12 px-4">
                            <div className="underline text-2xs">LP Token</div>
                            <div className="text-sm">
                                {toEGLD(
                                    pool.lpToken,
                                    stakedData.ownLiquidity.toString()
                                )
                                    .toNumber()
                                    .toLocaleString("en-US")} {pool.tokens[0].name}-{pool.tokens[1].name}
                            </div>
                        </div>
                        <div className="flex flex-row justify-between items-center h-12 px-4">
                            <div className="underline text-2xs">
                                Trading APR
                            </div>
                            <div className="text-sm">_</div>
                        </div>
                        <div className="flex flex-row justify-between items-center h-12 px-4">
                            <div className="underline text-2xs">
                                Emissions APR
                            </div>
                            <div className="text-sm">_</div>
                        </div>
                    </>
                )}
            </div>

            <div
                className="flex flex-row justify-center items-center select-none cursor-pointer py-2 text-white"
                onClick={() => setIsExpand(!isExpand)}
            >
                <div className="font-bold text-sm mr-2">Detail</div>
                {isExpand ? <ICChevronUp className="w-2 h-auto" /> : <ICChevronDown className="w-2 h-auto" />}
            </div>

            <AddLiquidityModal
                open={openAddLiquidity}
                onClose={() => setOpenAddLiquidity(false)}
                pool={pool}
            />
            <RemoveLiquidityModal
                open={openRemoveLiquidity}
                onClose={() => setOpenRemoveLiquidity(false)}
                pool={pool}
            />
        </div>
    );
}

export default StakedPoolCardItem;
