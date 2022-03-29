import { PoolsState } from "context/pools";
import { Unarray } from "interface/utilities";
import React, { useState } from "react";
import Image from "next/image";
import AddLiquidityModal from "components/AddLiquidityModal";
import RemoveLiquidityModal from "components/RemoveLiquidityModal";
import ICPlus from "assets/svg/plus.svg";
import ICMinus from "assets/svg/minus.svg";
import ICChevronDown from "assets/svg/chevron-down.svg";
import ICChevronUp from "assets/svg/chevron-up.svg";
import usePoolDataFormat from "hooks/usePoolDataFormat";
import { network } from "const/network";

function StakedPoolCardItem({
    poolData,
}: {
    poolData: Unarray<PoolsState["poolToDisplay"]>;
}) {
    const { pool, poolStats, liquidityData } = poolData;
    const [isExpand, setIsExpand] = useState<boolean>(false);
    const [openAddLiquidity, setOpenAddLiquidity] = useState<boolean>(false);
    const [openRemoveLiquidity, setOpenRemoveLiquidity] =
        useState<boolean>(false);
    const {
        formatedStats: { TVL, tradingAPR, volumn24h },
        formatedStakedData: {
            fCapacityPercent,
            fLpValueUsd,
            fOwnLiquidity,
            fValue0,
            fValue1,
        },
    } = usePoolDataFormat(poolData);
    if (!liquidityData) return null;

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
                            {fValue0}
                        </div>
                    </div>
                    <div className="mb-8">
                        <div className="text-2xl font-bold text-white">
                            {pool.tokens[1].name}
                        </div>
                        <div className="text-earn font-bold text-lg leading-tight">
                            {fValue1}
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
                        <div className="text-stake-gray-500 text-xs underline mb-4">
                            Estimate in USD
                        </div>
                        <div className="text-lg leading-tight">
                            <span className="text-stake-gray-500">$</span>
                            <span className="text-white font-bold">
                                {fLpValueUsd}
                            </span>
                        </div>
                    </div>
                    <div>
                        <div className="text-stake-gray-500 text-xs underline mb-4">
                            Your capacity
                        </div>
                        <div className="text-lg text-white font-bold leading-snug">
                            {fCapacityPercent}%
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-row mt-6 mb-5.5 justify-between items-center">
                <div className="mr-1">
                    <div className="text-stake-gray-500 text-xs mb-4 underline">
                        Trading APR
                    </div>
                    <div className="text-yellow-600 font-bold text-lg">
                        {tradingAPR}%
                    </div>
                </div>
            </div>

            {isExpand && (
                <>
                    <div className="bg-bg my-4 text-text-input-3">
                        <div className="flex flex-row justify-between items-center h-12 px-4">
                            <div className="underline text-2xs">
                                Total Liquidity
                            </div>
                            <div className="text-sm">${TVL}</div>
                        </div>
                        <div className="flex flex-row justify-between items-center h-12 px-4">
                            <div className="underline text-2xs">24H Volume</div>
                            <div className="text-sm">${volumn24h}</div>
                        </div>
                        <div className="flex flex-row justify-between items-center h-12 px-4">
                            <div className="underline text-2xs">LP Token</div>
                            <div className="text-sm">
                                {fOwnLiquidity} {pool.tokens[0].name}-
                                {pool.tokens[1].name}
                            </div>
                        </div>
                        <div className="flex flex-row justify-between items-center h-12 px-4">
                            <div className="underline text-2xs">
                                Trading APR
                            </div>
                            <div className="text-sm">{tradingAPR}%</div>
                        </div>
                    </div>
                    <div className="text-center mb-8">
                        <a
                            href={`${network.explorerAddress}/tokens/${pool.lpToken.id}`} target="_blank" rel="noreferrer"
                            className="text-earn underline text-2xs font-bold hover:text-earn hover:underline"
                        >
                            View LP Distribution
                        </a>
                    </div>
                </>
            )}

            <div
                className="flex flex-row justify-center items-center select-none cursor-pointer py-2 text-white"
                onClick={() => setIsExpand(!isExpand)}
            >
                <div className="font-bold text-sm mr-2">
                    {isExpand ? "Hide" : "Detail"}
                </div>
                {isExpand ? (
                    <ICChevronUp className="w-2 h-auto" />
                ) : (
                    <ICChevronDown className="w-2 h-auto" />
                )}
            </div>

            <AddLiquidityModal
                open={openAddLiquidity}
                onClose={() => setOpenAddLiquidity(false)}
                poolData={poolData}
            />
            <RemoveLiquidityModal
                open={openRemoveLiquidity}
                onClose={() => setOpenRemoveLiquidity(false)}
                poolData={poolData}
            />
        </div>
    );
}

export default StakedPoolCardItem;
